import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { q } from "@/lib/db";
import { createSession } from "@/lib/auth";

export async function POST(req) {
  const { email, password } = await req.json().catch(() => ({}));
  const [u] = await q("SELECT * FROM users WHERE email=?", [String(email || "").trim().toLowerCase()]);
  if (!u || !bcrypt.compareSync(String(password || ""), u.password_hash)) return NextResponse.json({ error: "Wrong email or password." }, { status: 401 });
  await createSession(u);
  return NextResponse.json({ ok: true, role: u.role });
}
