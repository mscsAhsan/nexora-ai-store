import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";
import { requireUser } from "@/lib/auth";
import { q } from "@/lib/db";
import { fmtDate } from "@/lib/data";

export const metadata = { title: "My orders - Nexora AI" };

export default async function Orders() {
  const user = await requireUser();
  const orders = await q("SELECT * FROM orders WHERE user_id=? ORDER BY id DESC", [user.id]);
  if (!orders.length) return <div className="glass rounded-3xl p-10 text-center"><p className="text-muted">No orders yet.</p><Link href="/tools" className="btn-primary mt-6">Browse tools</Link></div>;
  return (
    <div className="overflow-x-auto rounded-3xl border border-line bg-card">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead className="border-b border-line text-muted"><tr>{["Order", "Date", "Method", "Total", "Status"].map((h) => <th key={h} className="px-5 py-4 font-medium">{h}</th>)}</tr></thead>
        <tbody>{orders.map((o) => (
          <tr key={o.id} className="border-b border-line last:border-0">
            <td className="px-5 py-4"><Link href={`/checkout/success?order=${o.id}`} className="text-cyan-brand hover:underline">#{o.id}</Link>{o.plan && <span className="ml-2 text-muted">{o.plan} plan</span>}</td>
            <td className="px-5 py-4 text-muted">{fmtDate(o.created_at)}</td><td className="px-5 py-4 capitalize">{o.method}</td><td className="px-5 py-4 font-semibold">${o.total}</td><td className="px-5 py-4"><StatusBadge status={o.status} /></td>
          </tr>))}</tbody>
      </table>
    </div>
  );
}
