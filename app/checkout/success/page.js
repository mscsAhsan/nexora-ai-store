import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import { requireUser } from "@/lib/auth";
import { q } from "@/lib/db";
import { verifyStripe } from "@/lib/orders";

export const dynamic = "force-dynamic";

export default async function Success({ searchParams }) {
  const user = await requireUser("/dashboard");
  let [order] = await q("SELECT * FROM orders WHERE id=? AND user_id=?", [searchParams.order || 0, user.id]);
  if (!order) notFound();
  if (order.method === "stripe" && order.status === "pending" && searchParams.session_id) {
    await verifyStripe(searchParams.session_id, order.id);
    [order] = await q("SELECT * FROM orders WHERE id=?", [order.id]);
  }
  const items = await q("SELECT * FROM order_items WHERE order_id=?", [order.id]);
  const paid = order.status === "paid";
  return (
    <>
      <PageHeader title={paid ? "Payment successful" : order.status === "pending" ? "Order received" : "Order cancelled"} subtitle={`Order #${order.id}`} />
      <section className="section max-w-2xl space-y-6 pt-4">
        <div className="glass rounded-3xl p-6">
          <div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-bold">Your items</h2><StatusBadge status={order.status} /></div>
          {items.map((i) => (
            <div key={i.id} className="flex items-center justify-between border-b border-line py-3 last:border-0">
              <span>{i.name}</span>
              {i.license_key ? <code className="rounded-lg bg-midnight px-3 py-1 text-sm text-cyan-brand">{i.license_key}</code> : <span className="text-muted">${i.price}</span>}
            </div>
          ))}
          <p className="mt-4 text-sm text-muted">{paid ? "Your license keys are also saved in your dashboard." : order.status === "pending" ? "We are checking your payment. Your license keys will appear in your dashboard once it is approved." : ""}</p>
        </div>
        <div className="flex gap-3"><Link href="/dashboard" className="btn-primary flex-1">Go to dashboard</Link><Link href="/tools" className="btn-ghost flex-1">Keep shopping</Link></div>
      </section>
    </>
  );
}
