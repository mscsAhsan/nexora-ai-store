import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { createOrder, fulfilOrder, safepayCheckout } from "@/lib/orders";
import { run } from "@/lib/db";
import { safepayConfigured } from "@/lib/safepay";

export async function POST(req) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Please sign in first." }, { status: 401 });
  const { slugs, plan, method, reference } = await req.json().catch(() => ({}));
  const safepayOn = safepayConfigured();
  const demoOn = !process.env.DISABLE_DEMO_PAYMENT;
  if (!["safepay", "demo", "manual"].includes(method) || (method === "safepay" && !safepayOn) || (method === "demo" && !demoOn))
    return NextResponse.json({ error: method === "safepay" ? "Safepay is not configured yet. Set SAFEPAY_SECRET_KEY and SAFEPAY_API_KEY in .env.local." : "This payment method is not available." }, { status: 400 });
  if (method === "manual" && !String(reference || "").trim()) return NextResponse.json({ error: "Please enter your payment transaction ID." }, { status: 400 });
  try {
    const order = await createOrder({ user, slugs: Array.isArray(slugs) ? slugs : [], plan, method, reference: String(reference || "").trim() });
    if (method === "demo") { await fulfilOrder(order.id, req.nextUrl.origin); return NextResponse.json({ orderId: order.id }); }
    if (method === "safepay") {
      try { return NextResponse.json({ orderId: order.id, ...(await safepayCheckout({ order, user, origin: req.nextUrl.origin })) }); }
      catch (e) { await run("UPDATE orders SET status='cancelled' WHERE id=?", [order.id]); throw e; }
    }
    return NextResponse.json({ orderId: order.id });
  } catch (e) { return NextResponse.json({ error: e.message || "Could not create order." }, { status: 400 }); }
}
