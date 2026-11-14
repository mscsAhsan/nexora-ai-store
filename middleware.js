import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.AUTH_SECRET || "dev-secret-change-me-in-production-please");

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("nx_session")?.value;
  let payload = null;
  if (token) { try { payload = (await jwtVerify(token, secret)).payload; } catch {} }
  if (!payload) {
    const url = new URL("/login", req.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  if (pathname.startsWith("/admin") && payload.role !== "admin") return NextResponse.redirect(new URL("/dashboard", req.url));
  return NextResponse.next();
}
export const config = { matcher: ["/dashboard/:path*", "/admin/:path*", "/checkout/:path*"] };
