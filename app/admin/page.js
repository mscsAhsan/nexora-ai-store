import StatusBadge from "@/components/StatusBadge";
import OrderActions from "@/components/OrderActions";
import { q } from "@/lib/db";
import { fmtDate } from "@/lib/data";

export default async function Admin() {
  const [s] = await q(`SELECT (SELECT COUNT(*) FROM users) users, (SELECT COUNT(*) FROM orders) orders, (SELECT COALESCE(SUM(total),0) FROM orders WHERE status='paid') revenue, (SELECT COUNT(*) FROM orders WHERE status='pending') pending, (SELECT COUNT(*) FROM messages) messages, (SELECT COUNT(*) FROM subscribers) subs`);
  const orders = await q("SELECT o.*, u.email FROM orders o JOIN users u ON u.id=o.user_id ORDER BY o.id DESC LIMIT 50");
  const cards = [["Revenue", `$${s.revenue}`], ["Orders", s.orders], ["Pending", s.pending], ["Users", s.users], ["Messages", s.messages], ["Subscribers", s.subs]];
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-6">{cards.map(([l, v]) => <div key={l} className="glass rounded-2xl p-5"><p className="text-sm text-muted">{l}</p><p className="mt-1 text-2xl font-bold">{v}</p></div>)}</div>
      <div>
        <h2 className="mb-4 text-xl font-bold">Recent orders</h2>
        <div className="overflow-x-auto rounded-3xl border border-line bg-card">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-line text-muted"><tr>{["#", "Customer", "Date", "Method", "Reference", "Total", "Status", "Action"].map((h) => <th key={h} className="px-4 py-4 font-medium">{h}</th>)}</tr></thead>
            <tbody>{orders.map((o) => (
              <tr key={o.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3">#{o.id}</td><td className="px-4 py-3">{o.email}</td><td className="px-4 py-3 text-muted">{fmtDate(o.created_at)}</td><td className="px-4 py-3 capitalize">{o.method}</td><td className="px-4 py-3 text-muted">{o.reference || "-"}</td><td className="px-4 py-3 font-semibold">${o.total}</td><td className="px-4 py-3"><StatusBadge status={o.status} /></td><td className="px-4 py-3"><OrderActions id={o.id} status={o.status} /></td>
              </tr>))}</tbody>
          </table>
          {!orders.length && <p className="p-8 text-center text-muted">No orders yet.</p>}
        </div>
      </div>
    </div>
  );
}
