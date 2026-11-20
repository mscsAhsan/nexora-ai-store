"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import { Icon } from "./Icons";
import { useCart } from "./CartContext";

const links = [["Shop", "/tools"], ["Pricing", "/pricing"], ["Blog", "/blog"], ["Support", "/contact"]];

export default function Navbar({ user }) {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [q, setQ] = useState("");
  const { items, setOpen } = useCart();
  const router = useRouter();

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on(); window.addEventListener("scroll", on);
    return () => window.removeEventListener("scroll", on);
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setMenu(false); router.push("/"); router.refresh();
  }

  return (
    <header className={`fixed inset-x-0 top-0 z-40 transition ${scrolled || menu ? "border-b border-line bg-white/85 backdrop-blur-xl" : ""}`}>
      <div className="section flex h-[76px] items-center gap-6">
        <Logo />
        <nav className="hidden items-center gap-9 md:flex">
          {links.map(([l, h]) => <Link key={l} href={h} className="text-[15px] text-muted transition hover:text-violet-brand">{l}</Link>)}
        </nav>
        <form onSubmit={(e) => { e.preventDefault(); router.push(`/tools?q=${encodeURIComponent(q)}`); }} className="hidden min-w-0 flex-1 max-w-xs items-center gap-2 rounded-full border border-line bg-white px-4 py-2 lg:flex">
          <Icon name="search" className="shrink-0 text-muted" size={16} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search tools..." aria-label="Search tools" className="w-full bg-transparent text-sm outline-none placeholder:text-[#857D8E]" />
        </form>
        <div className="flex items-center gap-3">
          <button onClick={() => setOpen(true)} className="relative rounded-full border border-line bg-white p-2.5 hover:border-violet-brand" aria-label="Cart">
            <Icon name="cart" size={19} />
            {items.length > 0 && <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-pink-brand text-[11px] font-bold">{items.length}</span>}
          </button>
          {user ? (
            <>
              {user.role === "admin" && <Link href="/admin" className="btn-ghost hidden !py-2.5 text-sm lg:inline-flex">Admin</Link>}
              <Link href="/dashboard" className="btn-ghost hidden !py-2.5 text-sm sm:inline-flex">Dashboard</Link>
              <button onClick={logout} className="btn-primary hidden !py-2.5 text-sm sm:inline-flex">Log out</button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-ghost hidden !py-2.5 text-sm sm:inline-flex">Sign in</Link>
              <Link href="/register" className="btn-primary hidden !py-2.5 text-sm sm:inline-flex">Get started</Link>
            </>
          )}
          <button className="md:hidden" onClick={() => setMenu(!menu)} aria-label="Menu"><Icon name={menu ? "close" : "menu"} size={26} /></button>
        </div>
      </div>
      {menu && (
        <div className="glass mx-4 mb-3 space-y-1 rounded-2xl p-4 md:hidden">
          {links.map(([l, h]) => <Link key={l} href={h} onClick={() => setMenu(false)} className="block rounded-xl px-3 py-3 hover:bg-black/5">{l}</Link>)}
          {user ? (
            <>
              <Link href="/dashboard" onClick={() => setMenu(false)} className="block rounded-xl px-3 py-3 hover:bg-black/5">Dashboard</Link>
              {user.role === "admin" && <Link href="/admin" onClick={() => setMenu(false)} className="block rounded-xl px-3 py-3 hover:bg-black/5">Admin</Link>}
              <button onClick={logout} className="block w-full rounded-xl px-3 py-3 text-left hover:bg-black/5">Log out</button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setMenu(false)} className="block rounded-xl px-3 py-3 hover:bg-black/5">Sign in</Link>
              <Link href="/register" onClick={() => setMenu(false)} className="block rounded-xl px-3 py-3 font-semibold text-cyan-brand hover:bg-black/5">Get started</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
