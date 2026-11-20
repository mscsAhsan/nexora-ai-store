// Orders - PKR + Safepay (Pakistan). This store sells in Pakistan only.
// Payment flow:
//   createOrder()            -> order row, status 'pending', method 'safepay'
//   safepayCheckout()        -> Safepay hosted checkout URL + tracker stored on order
//   webhook / success page   -> verify tracker is really paid, then fulfilOrder()
//   fulfilOrder()            -> markPaid() + download tokens + delivery email
// fulfilOrder() is idempotent: calling it twice (webhook retry + success
// page at the same time) delivers once. The webhook_events table is the
// dedupe key - a Safepay event id is never processed twice.
import crypto from "crypto";
import { q, run } from "./db";
import { plans } from "./tools";
import { createSafepayCheckout, isTrackerPaid } from "./safepay";
import { createDownloadTokens } from "./downloads";
import { sendDeliveryEmail } from "./email";

const licenseKey = () => "NV-" + [0, 1, 2].map(() => crypto.randomBytes(2).toString("hex").toUpperCase()).join("-");

export async function createOrder({ user, slugs = [], plan, method, reference }) {
  const lines = [];
  if (plan) {
    const p = plans.find((x) => x.name === plan && x.monthly > 0);
    if (!p) throw new Error("Invalid plan");
    lines.push({ slug: `plan:${p.name}`, name: `${p.name} plan (1 month)`, price: p.monthly });
  } else {
    if (!slugs.length) throw new Error("Your cart is empty");
    const ph = slugs.map(() => "?").join(",");
    const rows = await q(`SELECT slug,name,price FROM tools WHERE active=1 AND slug IN (${ph})`, slugs);
    if (!rows.length) throw new Error("Tools not found");
    rows.forEach((r) => lines.push({ slug: r.slug, name: r.name, price: r.price }));
  }
  const total = lines.reduce((s, l) => s + l.price, 0);
  const o = await run("INSERT INTO orders (user_id,total,status,method,reference,plan,created_at) VALUES (?,?,?,?,?,?,?)",
    [user.id, total, "pending", method, reference || null, plan || null, new Date().toISOString()]);
  for (const l of lines) await run("INSERT INTO order_items (order_id,tool_slug,name,price) VALUES (?,?,?,?)", [o.id, l.slug, l.name, l.price]);
  return { id: o.id, total, lines };
}

export async function getOrderWithItems(orderId) {
  const [o] = await q("SELECT * FROM orders WHERE id=?", [orderId]);
  if (!o) return null;
  const items = await q("SELECT * FROM order_items WHERE order_id=?", [orderId]);
  return { ...o, items };
}

// Generate license keys + upgrade plan. Does NOT send email or create
// download tokens - use fulfilOrder() for that (it calls this).
export async function markPaid(orderId) {
  const [o] = await q("SELECT * FROM orders WHERE id=?", [orderId]);
  if (!o || o.status === "paid") return o;
  await run("UPDATE orders SET status='paid' WHERE id=?", [orderId]);
  const items = await q("SELECT * FROM order_items WHERE order_id=?", [orderId]);
  for (const it of items) if (!it.tool_slug.startsWith("plan:") && !it.license_key) await run("UPDATE order_items SET license_key=? WHERE id=?", [licenseKey(), it.id]);
  if (o.plan) await run("UPDATE users SET plan=? WHERE id=?", [o.plan, o.user_id]);
  return { ...o, status: "paid" };
}

// Full fulfilment, safe to call twice. Returns { fulfilled, alreadyPaid, email }.
export async function fulfilOrder(orderId, origin) {
  const before = await getOrderWithItems(orderId);
  if (!before) return { fulfilled: false, error: "Order not found" };
  if (before.status === "paid") return { fulfilled: true, alreadyPaid: true };
  await markPaid(orderId);
  const order = await getOrderWithItems(orderId);

  // Download tokens (7 days, 5 uses) - one per non-plan item.
  const tokens = await createDownloadTokens(orderId, order.items);
  const tokenBySlug = Object.fromEntries(tokens.map((t) => [t.tool_slug, t.token]));
  const tools = await q("SELECT slug, url, file_url FROM tools");
  const toolBySlug = Object.fromEntries(tools.map((t) => [t.slug, t]));

  const itemsForEmail = order.items.map((it) => ({
    ...it,
    access_url: toolBySlug[it.tool_slug]?.url || "",
    download_url: tokenBySlug[it.tool_slug]
      ? `${origin}/api/downloads/${tokenBySlug[it.tool_slug]}`
      : "",
  }));

  const [user] = await q("SELECT * FROM users WHERE id=?", [order.user_id]);
  const email = user?.email
    ? await sendDeliveryEmail({ to: user.email, name: user.name, order, items: itemsForEmail, origin })
    : { skipped: true };
  return { fulfilled: true, email, tokens };
}

// Step 2 of checkout: build the Safepay hosted-checkout URL for a pending order.
export async function safepayCheckout({ order, user, origin }) {
  const { url, tracker } = await createSafepayCheckout({ order, totalRupees: order.total, user, origin });
  await run("UPDATE orders SET safepay_tracker=? WHERE id=?", [tracker, order.id]);
  return { url, tracker };
}

// Verify a Safepay tracker against Safepay itself, then fulfil if paid.
// Used by /checkout/success when the customer returns from Safepay.
// Returns the fulfilled order, or null when Safepay says it is not paid (yet).
export async function verifySafepayTracker(tracker, orderId, origin) {
  if (!tracker) return null;
  const [o] = await q("SELECT * FROM orders WHERE id=?", [orderId]);
  if (!o) return null;
  if (o.safepay_tracker && o.safepay_tracker !== tracker) return null;
  if (o.status === "paid") return o;
  if (!(await isTrackerPaid(tracker))) return null;
  await fulfilOrder(orderId, origin);
  const [paid] = await q("SELECT * FROM orders WHERE id=?", [orderId]);
  return paid;
}

// Record a webhook event id. Returns false if this exact event was already seen.
export async function recordWebhookEvent({ eventId, eventType, tracker, orderId, payload }) {
  if (!eventId) return true; // no id to dedupe on - caller still processes it once
  try {
    await run(
      "INSERT INTO webhook_events (event_id, provider, event_type, tracker, order_id, payload, received_at) VALUES (?,?,?,?,?,?,?)",
      [eventId, "safepay", eventType || null, tracker || null, orderId || null, JSON.stringify(payload || {}), new Date().toISOString()]
    );
    return true;
  } catch {
    return false; // duplicate event_id - already processed
  }
}
