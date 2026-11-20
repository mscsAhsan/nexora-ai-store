import { q } from "./db";

const parse = (r) =>
  r && {
    id: r.id, slug: r.slug, name: r.name, brand: r.brand || "", category: r.category, icon: r.icon, price: r.price,
    rating: r.rating, reviews: r.reviews, from: r.from_color, to: r.to_color, desc: r.description,
    features: JSON.parse(r.features || "[]"), url: r.url, file_url: r.file_url || "", active: r.active,
    duration: r.duration || "", accessType: r.access_type || "", warranty: r.warranty || "", delivery: r.delivery || "",
  };

export async function getTools({ search = "", category = "", all = false } = {}) {
  let sql = "SELECT * FROM tools WHERE 1=1";
  const args = [];
  if (!all) sql += " AND active=1";
  if (category && category !== "All") { sql += " AND category=?"; args.push(category); }
  if (search) { sql += " AND (name LIKE ? OR description LIKE ? OR category LIKE ? OR brand LIKE ?)"; const s = `%${search}%`; args.push(s, s, s, s); }
  sql += " ORDER BY rating DESC, id ASC";
  return (await q(sql, args)).map(parse);
}

export async function getTool(slug) {
  const rows = await q("SELECT * FROM tools WHERE slug=?", [slug]);
  return parse(rows[0]);
}

export const fmtDate = (s) => (s ? new Date(s).toISOString().slice(0, 16).replace("T", " ") : "");
