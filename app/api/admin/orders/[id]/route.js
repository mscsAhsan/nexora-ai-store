import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { fulfilOrder } from "@/lib/orders";
import { run } from "@/lib/db";

export async function POST(req, { params }) {
  const u = await getUser();
  if (u?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { action } = await req.json().catch(() => ({}));
  if (action === "approve") await fulfilOrder(params.id, req.nextUrl.origin); // manual order: license + download tokens + delivery email
  else if (action === "cancel") await run("UPDATE orders SET status='cancelled' WHERE id=? AND status!='paid'", [params.id]);
  else return NextResponse.json({ error: "Bad action" }, { status: 400 });
  return NextResponse.json({ ok: true });
}
