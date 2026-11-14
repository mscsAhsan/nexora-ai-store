import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { q, run } from "@/lib/db";
import { createSession } from "@/lib/auth";

export async function POST(req) {
  const { name, email, password } = await req.json().catch(() => ({}));
  const e = String(email || "").trim().toLowerCase();
  if (!name?.trim() || !/^\S+@\S+\.\S+$/.test(e)) return NextResponse.json({ error: "Enter your name and a valid email." }, { status: 400 });
  if (!password || password.length < 8) return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  if ((await q("SELECT id FROM users WHERE email=?", [e])).length) return NextResponse.json({ error: "This email is already registered. Please sign in." }, { status: 409 });
  const r = await run("INSERT INTO users (name,email,password_hash,created_at) VALUES (?,?,?,?)", [name.trim(), e, bcrypt.hashSync(password, 10), new Date().toISOString()]);
  await createSession({ id: r.id, role: "user" });
  return NextResponse.json({ ok: true });
}
