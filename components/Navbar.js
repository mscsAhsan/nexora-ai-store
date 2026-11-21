"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import { Icon } from "./Icons";
import { useCart } from "./CartContext";
import { categories, categoryColors } from "@/lib/tools";

const links = [["Shop", "/tools"], ["Pricing", "/pricing"], ["Blog", "/blog"], ["Support", "/contact"]];
const mobileLinks = [["Home", "/", "home"], ["Shop", "/tools", "bag"], ["Pricing", "/pricing", "bolt"], ["Blog", "/blog", "pen"], ["Support", "/contact", "chat"]];

export default function Navbar({ user }) {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");
  const { items, setOpen } = useCart();
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on(); window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  // close menu / search whenever the page changes
  useEffect(() => { setMenu(false); setSearchOpen(false); }, [path]);

  // lock page scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menu]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setMenu(false); router.push("/"); router.refresh();
  }
  const search = (e) => {
    e.preventDefault();
    setSearchOpen(false);
    router.push(`/tools?q=${encodeURIComponent(q)}`);
  };

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-40 px-3 pt-2 transition md:p-0 ${scrolled ? "md:border-b md:border-line md:bg-white/85 md:backdrop-blur-xl" : ""}`}>
        {/* Mobile = floating rounded pill, desktop = normal full-width bar */}
        <div className="section flex h-14 items-center gap-2 rounded-2xl border border-line bg-white/90 !px-3 shadow-[0_6px_24px_rgba(60,40,10,.08)] backdrop-blur-xl md:h-[76px] md:gap-6 md:rounded-none md:border-0 md:bg-transparent md:!px-5 md:shadow-none md:backdrop-blur-none">
          <Logo />
          <nav className="hidden items-center gap-9 md:flex">
            {links.map(([l, h]) => <Link key={l} href={h} className="text-[15px] text-muted transition hover:text-violet-brand">{l}</Link>)}
          </nav>
          <form onSubmit={search} className="hidden min-w-0 max-w-xs flex-1 items-center gap-2 rounded-full border border-line bg-white px-4 py-2 lg:flex">
            <Icon name="search" className="shrink-0 text-muted" size={16} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search tools..." aria-label="Search tools" className="w-full bg-transparent text-sm outline-none placeholder:text-[#857D8E]" />
          </form>
          <div className="ml-auto flex items-center gap-2 md:gap-3">
            <button onClick={() => setSearchOpen((v) => !v)} className="grid h-10 w-10 place-items-center rounded-full border border-line bg-white md:hidden" aria-label="Search">
              <Icon name={searchOpen ? "close" : "search"} size={18} />
            </button>
            <button onClick={() => setOpen(true)} className="relative grid h-10 w-10 place-items-center rounded-full border border-line bg-white hover:border-violet-brand md:h-auto md:w-auto md:p-2.5" aria-label="Cart">
              <Icon name="cart" size={19} />
              {items.length > 0 && <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-pink-brand text-[11px] font-bold text-white">{items.length}</span>}
            </button>
            {user ? (
              <>
                {user.role === "admin" && <Link href="/admin" className="btn-ghost hidden !py-2.5 text-sm lg:inline-flex">Admin</Link>}
                <Link href="/dashboard" className="btn-ghost hidden !py-2.5 text-sm md:inline-flex">Dashboard</Link>
                <button onClick={logout} className="btn-primary hidden !py-2.5 text-sm md:inline-flex">Log out</button>
              </>
            ) : (
              <>
                <Link href="/login" className="btn-ghost hidden !py-2.5 text-sm md:inline-flex">Sign in</Link>
                <Link href="/register" className="btn-primary hidden !py-2.5 text-sm md:inline-flex">Get started</Link>
              </>
            )}
            <button onClick={() => setMenu(true)} className="grid h-10 w-10 place-items-center rounded-xl bg-[#F3A620] text-white shadow-[0_4px_12px_rgba(243,166,32,.4)] active:scale-95 md:hidden" aria-label="Open menu">
              <Icon name="menu" size={22} />
            </button>
          </div>
        </div>
        {searchOpen && (
          <form onSubmit={search} className="mt-2 flex items-center gap-2 rounded-2xl border border-[#FFB466] bg-white p-1.5 pl-4 shadow-lg md:hidden">
            <Icon name="search" size={17} className="shrink-0 text-muted" />
            <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search ChatGPT, Canva..." aria-label="Search tools" className="min-w-0 flex-1 bg-transparent py-2 outline-none placeholder:text-[#857D8E]" />
            <button className="btn-primary !rounded-xl !px-4 !py-2 text-sm" aria-label="Search"><Icon name="arrow" size={16} /></button>
          </form>
        )}
      </header>

      {/* Mobile full-screen menu */}
      {menu && (
        <div className="fixed inset-0 z-[75] flex flex-col bg-[#FBF9F5] md:hidden">
          <div className="flex items-center justify-between px-4 pb-2 pt-3">
            <Logo />
            <button onClick={() => setMenu(false)} className="grid h-10 w-10 place-items-center rounded-xl bg-[#FFF1D6] text-[#AD5A00] active:scale-95" aria-label="Close menu"><Icon name="close" size={20} /></button>
          </div>
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            <nav className="mt-2 space-y-1">
              {mobileLinks.map(([l, h, ic]) => (
                <Link key={l} href={h} onClick={() => setMenu(false)} className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-[16px] font-semibold ${path === h ? "bg-white shadow-sm" : ""}`}>
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#FFF1D6] text-[#AD5A00]"><Icon name={ic} size={18} /></span>{l}
                </Link>
              ))}
            </nav>
            <p className="mb-3 mt-6 px-1 text-[11px] font-extrabold tracking-[.18em] text-muted">CATEGORIES</p>
            <div className="grid grid-cols-2 gap-2">
              {categories.filter((c) => c !== "All").map((c) => (
                <Link key={c} href={`/tools?category=${encodeURIComponent(c)}`} onClick={() => setMenu(false)} className="flex items-center gap-2 rounded-2xl border border-line bg-white px-3 py-3 text-sm font-semibold shadow-sm">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: categoryColors[c] }} /><span className="truncate">{c}</span>
                </Link>
              ))}
            </div>
          </div>
          <div className="space-y-3 border-t border-line bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <Link href="/tools" onClick={() => setMenu(false)} className="btn-primary w-full !rounded-2xl !py-3.5 text-base">Browse all tools</Link>
            <div className="grid grid-cols-2 gap-3">
              {user
                ? <Link href="/dashboard" onClick={() => setMenu(false)} className="btn-ghost !rounded-2xl !px-3 !py-3 text-sm"><Icon name="user" size={17} /> Dashboard</Link>
                : <Link href="/login" onClick={() => setMenu(false)} className="btn-ghost !rounded-2xl !px-3 !py-3 text-sm"><Icon name="user" size={17} /> Login</Link>}
              <button onClick={() => { setMenu(false); setOpen(true); }} className="btn-ghost !rounded-2xl !px-3 !py-3 text-sm"><Icon name="cart" size={17} /> Cart{items.length > 0 ? ` (${items.length})` : ""}</button>
            </div>
            {user
              ? <button onClick={logout} className="w-full text-center text-sm font-semibold text-muted">Log out</button>
              : <Link href="/register" onClick={() => setMenu(false)} className="block text-center text-sm font-semibold text-[#AD5A00]">New here? Create a free account</Link>}
          </div>
        </div>
      )}
    </>
  );
}
