"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "./Icons";
import { useCart } from "./CartContext";

// App-style bottom bar for phones only (hidden from md up).
export default function MobileBottomNav({ user }) {
  const path = usePathname();
  const { items, setOpen } = useCart();
  const tab = (active) => `relative flex flex-col items-center gap-0.5 py-2 text-[11px] font-semibold transition ${active ? "text-[#AD5A00]" : "text-muted"}`;
  const Pill = ({ active }) => active ? <span className="absolute inset-x-5 top-0 h-[3px] rounded-b-full bg-[#F3A620]" /> : null;
  const accountHref = user ? "/dashboard" : "/login";
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-6px_24px_rgba(60,40,10,.06)] backdrop-blur-xl md:hidden" aria-label="Mobile navigation">
      <div className="mx-auto grid max-w-md grid-cols-5">
        <Link href="/" className={tab(path === "/")}><Pill active={path === "/"} /><Icon name="home" size={21} />Home</Link>
        <Link href="/tools" className={tab(path.startsWith("/tools"))}><Pill active={path.startsWith("/tools")} /><Icon name="bag" size={21} />Shop</Link>
        <button onClick={() => setOpen(true)} className={tab(path === "/cart" || path === "/checkout")}>
          <span className="relative"><Icon name="cart" size={21} />{items.length > 0 && <span className="absolute -right-2 -top-1.5 grid h-4 min-w-[16px] place-items-center rounded-full bg-pink-brand px-1 text-[10px] font-bold text-white">{items.length}</span>}</span>Cart
        </button>
        <Link href={accountHref} className={tab(path.startsWith("/dashboard") || path === "/login")}><Pill active={path.startsWith("/dashboard") || path === "/login"} /><Icon name="user" size={21} />Account</Link>
        <Link href="/contact" className={tab(path === "/contact")}><Pill active={path === "/contact"} /><Icon name="chat" size={21} />Support</Link>
      </div>
    </nav>
  );
}
