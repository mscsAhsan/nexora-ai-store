import Link from "next/link";
import OrdersTable from "@/components/OrdersTable";
import { requireUser } from "@/lib/auth";
import { q } from "@/lib/db";

export const metadata = { title: "My orders - Nexavo AI" };

export default async function Orders() {
  const user = await requireUser();
  const orders = await q("SELECT * FROM orders WHERE user_id=? ORDER BY id DESC", [user.id]);
  if (!orders.length) return <div className="glass rounded-3xl p-10 text-center"><p className="text-muted">No orders yet.</p><Link href="/tools" className="btn-primary mt-6">Browse tools</Link></div>;
  return <OrdersTable orders={orders.map((o) => ({ ...o, id: Number(o.id), user_id: Number(o.user_id), total: Number(o.total) }))} />;
}
