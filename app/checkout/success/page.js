import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import { requireUser } from "@/lib/auth";
import { q } from "@/lib/db";
import { verifySafepayTracker } from "@/lib/orders";
import { formatPKR } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function Success({ searchParams }) {
  const user = await requireUser("/dashboard");
  let [order] = await q("SELECT * FROM orders WHERE id=? AND user_id=?", [searchParams.order || 0, user.id]);
  if (!order) notFound();
  // Customer returned from Safepay. Verify the tracker with Safepay itself -
  // the redirect alone is NOT proof of payment. If the webhook already
  // fulfilled this order, verifySafepayTracker returns it straight away.
  // If Safepay has not confirmed yet, the page shows "checking" and the
  // webhook will fulfil it when it arrives - the customer should refresh
  // or check their email / dashboard.
  if (order.method === "safepay" && order.status === "pending" && searchParams.tracker) {
    const h = headers();
    const origin = `${h.get("x-forwarded-proto") || "https"}://${h.get("host") || "localhost:3000"}`;
    await verifySafepayTracker(searchParams.tracker, order.id, origin);
    [order] = await q("SELECT * FROM orders WHERE id=?", [order.id]);
  }
  const items = await q("SELECT * FROM order_items WHERE order_id=?", [order.id]);
  const tokens = await q("SELECT * FROM download_tokens WHERE order_id=?", [order.id]);
  const tokenBySlug = Object.fromEntries(tokens.map((t) => [t.tool_slug, t.token]));
  const paid = order.status === "paid";
  return (
    <>
      <PageHeader title={paid ? "Payment successful" : order.status === "pending" ? "Payment is being checked" : "Order cancelled"} subtitle={`Order #${order.id}`} />
      <section className="section max-w-2xl space-y-6 pt-4">
        <div className="glass rounded-3xl p-6">
          <div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-bold">Your items</h2><StatusBadge status={order.status} /></div>
          {items.map((i) => (
            <div key={i.id} className="flex items-center justify-between gap-3 border-b border-line py-3 last:border-0">
              <span>{i.name}</span>
              <span className="flex items-center gap-3">
                {tokenBySlug[i.tool_slug] && <a href={`/api/downloads/${tokenBySlug[i.tool_slug]}`} className="text-sm text-cyan-brand hover:underline">Download</a>}
                {i.license_key ? <code className="rounded-lg bg-[#FAF7F0] px-3 py-1 text-sm text-cyan-brand">{i.license_key}</code> : <span className="text-muted">{formatPKR(i.price)}</span>}
              </span>
            </div>
          ))}
          <p className="mt-4 text-sm text-muted">{paid ? "Your license keys and download links were also emailed to you, and are saved in your dashboard. Download links expire in 7 days." : order.status === "pending" ? "We are confirming your payment with Safepay. If you paid, your license keys will appear here and in your dashboard within a few minutes - you will also get an email. If this still shows pending after 10 minutes, email support with your order number." : ""}</p>
        </div>
        <div className="flex gap-3"><Link href="/dashboard" className="btn-primary flex-1">Go to dashboard</Link><Link href="/tools" className="btn-ghost flex-1">Keep shopping</Link></div>
      </section>
    </>
  );
}
