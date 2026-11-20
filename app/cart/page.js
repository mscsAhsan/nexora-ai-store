"use client";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { useCart } from "@/components/CartContext";
import { Icon, ToolTile } from "@/components/Icons";
import { formatPKR } from "@/lib/format";

export default function CartPage() {
  const { items, remove, total } = useCart();
  return (
    <>
      <PageHeader title="Your cart" subtitle={items.length ? `${items.length} tool${items.length > 1 ? "s" : ""} ready to buy` : "Nothing here yet"} />
      <section className="section max-w-3xl pt-6">
        {items.length === 0 ? (
          <div className="glass rounded-3xl p-10 text-center"><p className="text-muted">Your cart is empty.</p><Link href="/tools" className="btn-primary mt-6">Browse tools</Link></div>
        ) : (
          <div className="space-y-4">
            {items.map((i) => (
              <div key={i.slug} className="glass flex items-center gap-4 rounded-2xl p-4">
                <ToolTile tool={i} size={52} />
                <div className="flex-1"><Link href={`/tools/${i.slug}`} className="font-semibold hover:text-cyan-brand">{i.name}</Link><p className="text-sm text-muted">{formatPKR(i.price)}/month</p></div>
                <button onClick={() => remove(i.slug)} className="rounded-full p-2 text-muted hover:bg-black/5 hover:text-pink-brand" aria-label="Remove"><Icon name="trash" size={18} /></button>
              </div>
            ))}
            <div className="glass flex items-center justify-between rounded-2xl p-6"><span className="text-lg text-muted">Total</span><span className="text-3xl font-bold">{formatPKR(total)}<span className="text-base text-muted">/month</span></span></div>
            <Link href="/checkout" className="btn-primary w-full text-lg">Proceed to checkout</Link>
          </div>
        )}
      </section>
    </>
  );
}
