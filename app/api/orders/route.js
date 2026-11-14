import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { createOrder, markPaid, stripeSession } from "@/lib/orders";
import { run } from "@/lib/db";

export async function POST(req) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Please sign in first." }, { status: 401 });
  const { slugs, plan, method, reference } = await req.json().catch(() => ({}));
  const stripeOn = !!process.env.STRIPE_SECRET_KEY;
  const demoOn = !process.env.DISABLE_DEMO_PAYMENT;
  if (!["stripe", "demo", "manual"].includes(method) || (method === "stripe" && !stripeOn) || (method === "demo" && !demoOn))
    return NextResponse.json({ error: "This payment method is not available." }, { status: 400 });
  if (method === "manual" && !String(reference || "").trim()) return NextResponse.json({ error: "Please enter your payment transaction ID." }, { status: 400 });
  try {
    const order = await createOrder({ user, slugs: Array.isArray(slugs) ? slugs : [], plan, method, reference: String(reference || "").trim() });
    if (method === "demo") { await markPaid(order.id); return NextResponse.json({ orderId: order.id }); }
    if (method === "stripe") {
      try { return NextResponse.json({ orderId: order.id, url: await stripeSession({ order, lines: order.lines, user, origin: req.nextUrl.origin }) }); }
      catch (e) { await run("UPDATE orders SET status='cancelled' WHERE id=?", [order.id]); throw e; }
    }
    return NextResponse.json({ orderId: order.id });
  } catch (e) { return NextResponse.json({ error: e.message || "Could not create order." }, { status: 400 }); }
}
