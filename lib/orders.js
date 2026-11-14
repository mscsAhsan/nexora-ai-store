import crypto from "crypto";
import { q, run } from "./db";
import { plans } from "./tools";

const licenseKey = () => "NX-" + [0, 1, 2].map(() => crypto.randomBytes(2).toString("hex").toUpperCase()).join("-");

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

export async function markPaid(orderId) {
  const [o] = await q("SELECT * FROM orders WHERE id=?", [orderId]);
  if (!o || o.status === "paid") return o;
  await run("UPDATE orders SET status='paid' WHERE id=?", [orderId]);
  const items = await q("SELECT * FROM order_items WHERE order_id=?", [orderId]);
  for (const it of items) if (!it.tool_slug.startsWith("plan:") && !it.license_key) await run("UPDATE order_items SET license_key=? WHERE id=?", [licenseKey(), it.id]);
  if (o.plan) await run("UPDATE users SET plan=? WHERE id=?", [o.plan, o.user_id]);
  return { ...o, status: "paid" };
}

export async function stripeSession({ order, lines, user, origin }) {
  const body = new URLSearchParams();
  body.set("mode", "payment");
  body.set("success_url", `${origin}/checkout/success?order=${order.id}&session_id={CHECKOUT_SESSION_ID}`);
  body.set("cancel_url", `${origin}/checkout`);
  body.set("client_reference_id", String(order.id));
  body.set("customer_email", user.email);
  lines.forEach((l, i) => {
    body.set(`line_items[${i}][price_data][currency]`, "usd");
    body.set(`line_items[${i}][price_data][product_data][name]`, l.name);
    body.set(`line_items[${i}][price_data][unit_amount]`, String(Math.round(l.price * 100)));
    body.set(`line_items[${i}][quantity]`, "1");
  });
  const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST", headers: { Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`, "Content-Type": "application/x-www-form-urlencoded" }, body,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || "Stripe error");
  return data.url;
}

export async function verifyStripe(sessionId, orderId) {
  const res = await fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`, { headers: { Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}` } });
  const s = await res.json();
  if (res.ok && s.payment_status === "paid" && String(s.client_reference_id) === String(orderId)) return markPaid(orderId);
  return null;
}
