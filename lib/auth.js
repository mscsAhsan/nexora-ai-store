import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { q } from "./db";

export const COOKIE = "nx_session";
const secret = new TextEncoder().encode(process.env.AUTH_SECRET || "dev-secret-change-me-in-production-please");

export async function createSession(user) {
  const token = await new SignJWT({ uid: user.id, role: user.role }).setProtectedHeader({ alg: "HS256" }).setExpirationTime("7d").sign(secret);
  cookies().set(COOKIE, token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 7 });
}
export function destroySession() { cookies().delete(COOKIE); }

export async function getUser() {
  const t = cookies().get(COOKIE)?.value;
  if (!t) return null;
  try {
    const { payload } = await jwtVerify(t, secret);
    const rows = await q("SELECT id,name,email,role,plan FROM users WHERE id=?", [payload.uid]);
    return rows[0] || null;
  } catch { return null; }
}
export async function requireUser(next = "/dashboard") {
  const u = await getUser();
  if (!u) redirect(`/login?next=${encodeURIComponent(next)}`);
  return u;
}
export async function requireAdmin() {
  const u = await requireUser("/admin");
  if (u.role !== "admin") redirect("/dashboard");
  return u;
}
