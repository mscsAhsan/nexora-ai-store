import Link from "next/link";
import MyTools from "@/components/MyTools";
import { requireUser } from "@/lib/auth";
import { q } from "@/lib/db";

export const metadata = { title: "Dashboard - Nexavo AI" };

export default async function Dashboard() {
  const user = await requireUser();
  const items = await q(`SELECT oi.*, t.url, t.from_color, t.to_color, t.warranty, t.delivery, o.created_at, dt.token AS download_token, dt.expires_at AS download_expires FROM order_items oi JOIN orders o ON o.id=oi.order_id LEFT JOIN tools t ON t.slug=oi.tool_slug LEFT JOIN download_tokens dt ON dt.order_id=oi.order_id AND dt.tool_slug=oi.tool_slug WHERE o.user_id=? AND o.status='paid' AND oi.tool_slug NOT LIKE 'plan:%' ORDER BY oi.id DESC`, [user.id]);
  if (!items.length) return <div className="glass rounded-3xl p-10 text-center"><p className="text-muted">You have not purchased any tools yet.</p><Link href="/tools" className="btn-primary mt-6">Browse tools</Link></div>;
  return <MyTools items={items.map((i) => ({ ...i, id: Number(i.id), order_id: Number(i.order_id), price: Number(i.price) }))} />;
}
