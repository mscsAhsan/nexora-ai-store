// Safepay (Pakistan) - Express Checkout via the official @sfpy/node-core SDK.
// Docs: https://safepay-docs.netlify.app/build-your-integration/express-checkout/
// Flow (server only, never in the browser):
//   1. payments.session.setup()  -> tracker token  (amount in PAISA, currency PKR)
//   2. client.passport.create()  -> short-lived auth token (tbt, 1 hour)
//   3. checkout.createCheckoutUrl({ env, tracker, tbt, source: 'hosted',
//        redirect_url, cancel_url, order_id }) -> redirect the customer there
//   4. Webhook payment.succeeded (or reporter fetch) -> tracker.state === 'TRACKER_ENDED'
//      is the ONLY proof of payment. The redirect back to /checkout/success is
//      NOT proof - the customer can close the tab before it loads.
//
// Env vars (see .env.example):
//   SAFEPAY_SECRET_KEY  - secret key, server only (sec_...)
//   SAFEPAY_API_KEY     - public / merchant api key
//   SAFEPAY_ENV         - 'sandbox' (default) or 'production'
//   SAFEPAY_WEBHOOK_SECRET - base64 webhook signing secret from Safepay dashboard
//     (new style) or plain shared secret (legacy style). Both are supported below.
import crypto from "crypto";
import { createRequire } from "module";

const requireCjs = createRequire(import.meta.url);

export function safepayEnv() {
  return (process.env.SAFEPAY_ENV || "sandbox").toLowerCase() === "production"
    ? "production"
    : "sandbox";
}

export function safepayHost() {
  return safepayEnv() === "production"
    ? "https://api.getsafepay.com"
    : "https://sandbox.api.getsafepay.com";
}

export function safepayConfigured() {
  return Boolean(process.env.SAFEPAY_SECRET_KEY && process.env.SAFEPAY_API_KEY);
}

function getClient() {
  const secret = process.env.SAFEPAY_SECRET_KEY;
  if (!secret) throw new Error("Safepay is not configured. Set SAFEPAY_SECRET_KEY and SAFEPAY_API_KEY in .env.local (see .env.example).");
  // @sfpy/node-core is CommonJS - load it with createRequire so it works
  // inside Next.js App Router (ESM) route handlers.
  const SafepayModule = requireCjs("@sfpy/node-core");
  const SafepayCtor = SafepayModule.Safepay || SafepayModule.default || SafepayModule;
  // Short timeout on purpose: the SDK default is 80s, which would leave the
  // webhook hanging (and Safepay retrying) if Safepay's API is slow. 10s is
  // plenty for a status check - and isTrackerPaid() races it anyway.
  return new SafepayCtor(secret, { authType: "secret", host: safepayHost(), timeout: 10000 });
}

function unwrap(res) {
  // SDK responses are { data: {...}, status: { message: 'success' } }
  if (res && typeof res === "object" && "data" in res) return res.data;
  return res;
}

// A hung upstream API must never hang checkout / the webhook forever.
function withTimeout(promise, ms, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error(`${label} timed out after ${ms / 1000}s`)), ms)),
  ]);
}

// Create a Safepay hosted-checkout URL for an already-created Nexavo order.
// amountRupees is whole PKR (e.g. 1999). Returns { url, tracker }.
// The tracker is stored on the order (orders.safepay_tracker) so the webhook
// and the success page can both match the payment back to this order.
export async function createSafepayCheckout({ order, totalRupees, user, origin }) {
  const client = getClient();
  const amountPaisa = Math.round(Number(totalRupees) * 100);
  if (!Number.isFinite(amountPaisa) || amountPaisa <= 0) throw new Error("Invalid order total for Safepay.");

  const session = unwrap(
    await withTimeout(client.payments.session.setup({
      merchant_api_key: process.env.SAFEPAY_API_KEY,
      intent: "CYBERSOURCE",
      mode: "payment",
      entry_mode: "raw",
      currency: "PKR",
      amount: amountPaisa,
      metadata: { order_id: String(order.id), customer_email: user.email },
      include_fees: false,
    }), 15000, "Safepay payment session")
  );
  const tracker = session?.tracker?.token || session?.token;
  if (!tracker) throw new Error("Safepay did not return a payment tracker.");

  const passport = unwrap(await withTimeout(client.client.passport.create(), 15000, "Safepay passport token"));
  const tbt = typeof passport === "string" ? passport : passport?.token || passport?.data;
  if (!tbt) throw new Error("Safepay did not return a passport token.");

  const url = client.checkout.createCheckoutUrl({
    env: safepayEnv(),
    tracker,
    tbt,
    source: "hosted",
    order_id: String(order.id),
    redirect_url: `${origin}/checkout/success?order=${order.id}&tracker=${encodeURIComponent(tracker)}`,
    cancel_url: `${origin}/checkout?cancelled=${order.id}`,
  });
  return { url, tracker };
}

// Ask Safepay directly whether a tracker is paid. Returns true only when
// tracker.state === 'TRACKER_ENDED'. Use this on the success page as a
// second check - the webhook is still the source of truth for fulfilment.
export async function isTrackerPaid(tracker) {
  if (!tracker) return false;
  try {
    const client = getClient();
    // Never let a hung Safepay API block the webhook / success page: 8s max.
    const res = unwrap(await withTimeout(client.reporter.payments.fetch(tracker), 8000, "Safepay reporter"));
    const state = res?.tracker?.state || res?.state;
    return state === "TRACKER_ENDED";
  } catch (e) {
    console.error("[safepay] reporter fetch failed:", e?.message || e);
    return false;
  }
}

// --- Webhook signature verification -------------------------------------
// Safepay sends two generations of signatures, both are HMAC-SHA256:
//  (a) New style: X-SFPY-SIGNATURE: "sha256=<hex>", signed message is
//      "<X-SFPY-TIMESTAMP>.<raw_body>", secret is base64-decoded first.
//      X-SFPY-EVENT-ID is the idempotency key.
//  (b) Legacy style: X-SFPY-SIGNATURE is a hex digest of the raw body
//      (or of tracker+secret). We try (a) first, then (b).
// Returns { ok, eventId, eventType }. If no secret is configured we refuse
// to trust the webhook (production) - callers must then rely on the
// reporter fetch, never on the raw body alone.
export function verifySafepayWebhook({ rawBody, headers }) {
  const secretRaw = process.env.SAFEPAY_WEBHOOK_SECRET || "";
  const signature = headers["x-sfpy-signature"] || headers["X-SFPY-SIGNATURE"] || "";
  const timestamp = headers["x-sfpy-timestamp"] || headers["X-SFPY-TIMESTAMP"] || "";
  const eventId = headers["x-sfpy-event-id"] || headers["X-SFPY-EVENT-ID"] || "";
  const eventType = headers["x-sfpy-event-type"] || headers["X-SFPY-EVENT-TYPE"] || "";

  if (!secretRaw || !signature) return { ok: false, eventId, eventType, reason: "missing secret or signature" };

  const safeEqual = (a, b) => {
    try {
      const ab = Buffer.from(String(a));
      const bb = Buffer.from(String(b));
      return ab.length === bb.length && crypto.timingSafeEqual(ab, bb);
    } catch { return false; }
  };

  // (a) New style: sha256=<hex> over "<timestamp>.<rawBody>"
  if (signature.startsWith("sha256=") && timestamp) {
    const candidates = [];
    try { candidates.push(Buffer.from(secretRaw, "base64")); } catch {}
    candidates.push(Buffer.from(secretRaw, "utf8"));
    for (const key of candidates) {
      if (!key.length) continue;
      const digest = crypto.createHmac("sha256", key).update(`${timestamp}.${rawBody}`).digest("hex");
      if (safeEqual(`sha256=${digest}`, signature)) {
        // Reject replays older than 5 minutes (Safepay's own guidance).
        const ageMs = Date.now() - Date.parse(timestamp);
        if (Number.isFinite(ageMs) && Math.abs(ageMs) > 5 * 60 * 1000) {
          return { ok: false, eventId, eventType, reason: "timestamp too old - possible replay" };
        }
        return { ok: true, eventId, eventType };
      }
    }
    return { ok: false, eventId, eventType, reason: "new-style signature mismatch" };
  }

  // (b) Legacy style: HMAC-SHA256 of the raw body with the shared secret.
  const legacy = crypto.createHmac("sha256", secretRaw).update(rawBody).digest("hex");
  if (safeEqual(legacy, signature)) return { ok: true, eventId, eventType };
  return { ok: false, eventId, eventType, reason: "signature mismatch" };
}

// Extract the tracker + order id from a Safepay webhook body, whatever
// shape Safepay sends. payment.succeeded bodies carry the tracker in
// data.tracker.token (or data.tracker), and the order id in metadata.
export function extractTrackerFromWebhook(body) {
  if (!body || typeof body !== "object") return { tracker: null, orderId: null };
  const data = body.data || body;
  const tracker =
    data?.tracker?.token || data?.tracker || data?.tracker_token ||
    body?.tracker?.token || body?.tracker || null;
  const orderId =
    data?.metadata?.order_id || data?.metadata?.orderId ||
    body?.metadata?.order_id || data?.order_id || null;
  const success =
    body?.success === true || data?.success === true ||
    body?.event === "payment.succeeded" || data?.event === "payment.succeeded";
  return { tracker: tracker ? String(tracker) : null, orderId: orderId ? String(orderId) : null, success };
}
