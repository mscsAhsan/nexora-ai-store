"use client";
import Link from "next/link";
import { useCart } from "./CartContext";
import { Icon, ToolTile } from "./Icons";
import { formatPKR } from "@/lib/format";

export default function CartDrawer() {
  const { items, remove, clear, total, open, setOpen } = useCart();

  return (
    <>
      <div onClick={() => setOpen(false)} className={`fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm transition ${open ? "opacity-100" : "pointer-events-none opacity-0"}`} />
      <aside className={`fixed right-0 top-0 z-[91] flex h-full w-full max-w-md flex-col border-l border-line bg-card shadow-2xl transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between border-b border-line p-5">
          <h3 className="text-xl font-bold">Your cart ({items.length})</h3>
          <button onClick={() => setOpen(false)} className="rounded-full p-2 hover:bg-black/5" aria-label="Close"><Icon name="close" /></button>
        </div>
        <div className="flex-1 space-y-3 overflow-y-auto p-4 sm:p-5">
          {items.length === 0 && <p className="mt-10 text-center text-muted">Your cart is empty. Add some AI tools!</p>}
          {items.map((i) => (
            <div key={i.slug} className="flex items-center gap-4 rounded-2xl border border-line bg-[#FAF7F0] p-3">
              <ToolTile tool={i} size={48} />
              <div className="min-w-0 flex-1"><p className="truncate font-semibold">{i.name}</p><p className="text-sm text-muted">{formatPKR(i.price)}/month</p></div>
              <button onClick={() => remove(i.slug)} className="rounded-full p-2 text-muted hover:bg-black/5 hover:text-pink-brand" aria-label="Remove"><Icon name="trash" size={18} /></button>
            </div>
          ))}
        </div>
        <div className="space-y-3 border-t border-line p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-5">
          <div className="flex justify-between text-lg"><span className="text-muted">Total</span><span className="font-bold">{formatPKR(total)}/month</span></div>
          {items.length > 0 ? <Link href="/checkout" onClick={() => setOpen(false)} className="btn-primary w-full">Checkout</Link> : <Link href="/tools" onClick={() => setOpen(false)} className="btn-primary w-full">Browse tools</Link>}
          {items.length > 0 && <Link href="/cart" onClick={() => setOpen(false)} className="block text-center text-sm text-cyan-brand hover:underline">View full cart</Link>}
          {items.length > 0 && <button onClick={clear} className="w-full text-sm text-muted hover:text-violet-brand">Clear cart</button>}
        </div>
      </aside>
    </>
  );
}
