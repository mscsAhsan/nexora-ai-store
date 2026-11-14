import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { run } from "@/lib/db";

const slugify = (s) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

async function guard() { const u = await getUser(); return u?.role === "admin"; }

export async function POST(req) {
  if (!(await guard())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const b = await req.json().catch(() => ({}));
  if (!b.name?.trim() || !b.category || !(Number(b.price) >= 0) || !b.description?.trim()) return NextResponse.json({ error: "Name, category, price and description are required." }, { status: 400 });
  const slug = slugify(b.slug || b.name);
  const features = JSON.stringify(String(b.features || "").split("\n").map((s) => s.trim()).filter(Boolean));
  const vals = [b.name.trim(), b.category, b.icon || "sparkle", Number(b.price), Number(b.rating) || 4.5, Number(b.reviews) || 0, b.from || "#7C5CFF", b.to || "#22D3EE", b.description.trim(), features, b.url || "", b.active === false ? 0 : 1];
  try {
    if (b.id) await run("UPDATE tools SET name=?,category=?,icon=?,price=?,rating=?,reviews=?,from_color=?,to_color=?,description=?,features=?,url=?,active=?,slug=? WHERE id=?", [...vals, slug, b.id]);
    else await run("INSERT INTO tools (name,category,icon,price,rating,reviews,from_color,to_color,description,features,url,active,slug) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)", [...vals, slug]);
  } catch (e) { return NextResponse.json({ error: "Could not save (is the slug already used?)" }, { status: 400 }); }
  return NextResponse.json({ ok: true });
}

export async function DELETE(req) {
  if (!(await guard())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const id = req.nextUrl.searchParams.get("id");
  await run("DELETE FROM tools WHERE id=?", [id]);
  return NextResponse.json({ ok: true });
}
