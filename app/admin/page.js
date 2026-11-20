import AdminDashboard from "@/components/AdminDashboard";
import { q } from "@/lib/db";

export default async function Admin() {
  const [s] = await q(`SELECT (SELECT COUNT(*) FROM users) users, (SELECT COUNT(*) FROM orders) orders, (SELECT COALESCE(SUM(total),0) FROM orders WHERE status='paid') revenue, (SELECT COUNT(*) FROM orders WHERE status='pending') pending, (SELECT COUNT(*) FROM messages) messages, (SELECT COUNT(*) FROM subscribers) subs`);
  const orders = await q("SELECT o.*, u.email FROM orders o JOIN users u ON u.id=o.user_id ORDER BY o.id DESC LIMIT 50");
  const daily = await q(`SELECT substr(created_at,1,10) AS day, COALESCE(SUM(CASE WHEN status='paid' THEN total ELSE 0 END),0) AS total FROM orders WHERE created_at >= date('now','-6 days') GROUP BY day ORDER BY day`);
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.now() - (6 - i) * 86400000).toISOString().slice(0, 10);
    const row = daily.find((r) => r.day === d);
    return { day: d, total: Number(row?.total || 0) };
  });
  const methods = await q("SELECT method, COUNT(*) AS count, COALESCE(SUM(total),0) AS total FROM orders GROUP BY method ORDER BY count DESC");
  const topTools = await q("SELECT oi.tool_slug, oi.name, COUNT(*) AS sold FROM order_items oi JOIN orders o ON o.id=oi.order_id WHERE o.status='paid' AND oi.tool_slug NOT LIKE 'plan:%' GROUP BY oi.tool_slug, oi.name ORDER BY sold DESC LIMIT 5");
    // libsql returns integers as BigInt — client components can only receive
  // plain JSON, so coerce everything to Number/String first.
  const stats = { revenue: Number(s.revenue || 0), orders: Number(s.orders || 0), pending: Number(s.pending || 0), users: Number(s.users || 0), messages: Number(s.messages || 0), subs: Number(s.subs || 0) };
  const safeOrders = orders.map((o) => ({ ...o, id: Number(o.id), user_id: Number(o.user_id), total: Number(o.total) }));
  const safeMethods = methods.map((m) => ({ method: m.method, count: Number(m.count), total: Number(m.total || 0) }));
  const safeTop = topTools.map((x) => ({ ...x, sold: Number(x.sold) }));
  return <AdminDashboard stats={stats} orders={safeOrders} daily={last7} methods={safeMethods} topTools={safeTop} />;
}
