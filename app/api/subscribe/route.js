import { NextResponse } from "next/server";
import { run } from "@/lib/db";

export async function POST(req) {
  const { email } = await req.json().catch(() => ({}));
  if (!/^\S+@\S+\.\S+$/.test(email || "")) return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
  await run("INSERT OR IGNORE INTO subscribers (email,created_at) VALUES (?,?)", [email.trim().toLowerCase(), new Date().toISOString()]);
  return NextResponse.json({ ok: true });
}
