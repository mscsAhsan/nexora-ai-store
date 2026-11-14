import { NextResponse } from "next/server";
import { run } from "@/lib/db";

export async function POST(req) {
  const { name, email, subject, body } = await req.json().catch(() => ({}));
  if (!name?.trim() || !/^\S+@\S+\.\S+$/.test(email || "") || !body?.trim()) return NextResponse.json({ error: "Please fill in your name, a valid email and a message." }, { status: 400 });
  await run("INSERT INTO messages (name,email,subject,body,created_at) VALUES (?,?,?,?,?)", [name.trim(), email.trim(), (subject || "General").trim(), body.trim(), new Date().toISOString()]);
  return NextResponse.json({ ok: true });
}
