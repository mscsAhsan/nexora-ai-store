import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { q } from "@/lib/db";

export const metadata = { title: "Dashboard - Nexora AI" };

export default async function Dashboard() {
  const user = await requireUser();
  const items = await q(`SELECT oi.*, t.url, t.from_color, t.to_color, o.created_at FROM order_items oi JOIN orders o ON o.id=oi.order_id LEFT JOIN tools t ON t.slug=oi.tool_slug WHERE o.user_id=? AND o.status='paid' AND oi.tool_slug NOT LIKE 'plan:%' ORDER BY oi.id DESC`, [user.id]);
  if (!items.length) return <div className="glass rounded-3xl p-10 text-center"><p className="text-muted">You have not purchased any tools yet.</p><Link href="/tools" className="btn-primary mt-6">Browse tools</Link></div>;
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {items.map((i) => (
        <div key={i.id} className="rounded-3xl border border-line bg-card p-6">
          <div className="mb-4 h-2 rounded-full" style={{ background: `linear-gradient(90deg, ${i.from_color || "#7C5CFF"}, ${i.to_color || "#22D3EE"})` }} />
          <h3 className="text-xl font-bold">{i.name}</h3>
          <p className="mt-3 text-sm text-muted">License key</p>
          <code className="mt-1 block rounded-xl bg-midnight px-4 py-3 text-cyan-brand">{i.license_key}</code>
          <div className="mt-4 flex gap-3">
            {i.url && <a href={i.url} target="_blank" rel="noreferrer" className="btn-primary !py-2 text-sm">Launch tool</a>}
            <Link href={`/tools/${i.tool_slug}`} className="btn-ghost !py-2 text-sm">Details</Link>
          </div>
        </div>
      ))}
    </div>
  );
}
