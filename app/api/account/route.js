import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getUser } from "@/lib/auth";
import { q, run } from "@/lib/db";

export async function POST(req) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  const { name, currentPassword, newPassword } = await req.json().catch(() => ({}));
  if (name?.trim()) await run("UPDATE users SET name=? WHERE id=?", [name.trim(), user.id]);
  if (newPassword) {
    if (newPassword.length < 8) return NextResponse.json({ error: "New password must be at least 8 characters." }, { status: 400 });
    const [u] = await q("SELECT password_hash FROM users WHERE id=?", [user.id]);
    if (!bcrypt.compareSync(String(currentPassword || ""), u.password_hash)) return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
    await run("UPDATE users SET password_hash=? WHERE id=?", [bcrypt.hashSync(newPassword, 10), user.id]);
  }
  return NextResponse.json({ ok: true });
}
