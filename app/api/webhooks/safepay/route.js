// Safepay webhook - POST /api/webhooks/safepay
// Set this URL in the Safepay dashboard (Developers > Webhooks):
//   https://yourdomain.com/api/webhooks/safepay
// Rules:
//  - Always read the RAW body first. Parsing / re-serialising before
//    verification breaks the HMAC signature.
//  - Verify the signature (X-SFPY-SIGNATURE). If it fails, return 400 and
//    do NOTHING - an unverified webhook must never mark an order paid.
//  - Dedupe on X-SFPY-EVENT-ID (webhook_events table). Safepay retries
//    failed deliveries, so the same event can arrive twice.
//  - Only fulfil after confirming the tracker with Safepay itself
//    (reporter fetch, tracker.state === 'TRACKER_ENDED'). The webhook
//    body alone is a notification, not proof.
//  - Always return 200 fast once the event is accepted. If verification
//    fails, 400 tells Safepay to retry - which is correct, because a
//    misconfigured secret should be fixed, not silently swallowed.
import { NextResponse } from "next/server";
import { q } from "@/lib/db";
import { verifySafepayWebhook, extractTrackerFromWebhook } from "@/lib/safepay";
import { recordWebhookEvent, verifySafepayTracker } from "@/lib/orders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req) {
  const rawBody = await req.text();
  const headers = Object.fromEntries(req.headers.entries());
  const { ok, eventId, eventType, reason } = verifySafepayWebhook({ rawBody, headers });

  let body = null;
  try { body = JSON.parse(rawBody); } catch { /* keep null */ }

  if (!ok) {
    console.error("[safepay webhook] signature verification failed:", reason);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const { tracker, orderId, success } = extractTrackerFromWebhook(body);
  const type = eventType || body?.event || body?.webhook_event_type || body?.type || "payment.succeeded";
  const isSuccessEvent = /payment\.(succeeded|completed)/.test(String(type)) || success === true;

  // Dedupe first - a retry of an already-processed event is a 200, not a re-fulfilment.
  const isNew = await recordWebhookEvent({ eventId, eventType: type, tracker, orderId, payload: body });
  if (!isNew) return NextResponse.json({ ok: true, duplicate: true });

  if (!isSuccessEvent || !tracker) {
    // payment.failed etc. - acknowledged, nothing to fulfil.
    return NextResponse.json({ ok: true });
  }

  // Resolve the order: prefer the order id in the webhook metadata, else the tracker.
  let order = null;
  if (orderId) [order] = await q("SELECT * FROM orders WHERE id=?", [orderId]);
  if (!order && tracker) [order] = await q("SELECT * FROM orders WHERE safepay_tracker=?", [tracker]);
  if (!order) {
    console.error("[safepay webhook] no matching order for tracker", tracker);
    return NextResponse.json({ ok: true, error: "order not found" });
  }

  // Confirm with Safepay before fulfilling - never trust the body alone.
  const paid = await verifySafepayTracker(tracker, order.id, req.nextUrl.origin);
  if (!paid) {
    // Tracker not ended yet (e.g. a test / early event). Return 200 so
    // Safepay does not retry forever; the success page re-checks on return.
    console.warn("[safepay webhook] tracker not ended yet for order", order.id);
    return NextResponse.json({ ok: true, pending: true });
  }
  // fulfilOrder already ran inside verifySafepayTracker when it was paid.
  return NextResponse.json({ ok: true, orderId: order.id });
}
