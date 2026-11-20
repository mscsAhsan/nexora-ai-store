import Link from "next/link";
import { notFound } from "next/navigation";
import { categoryColors } from "@/lib/tools";
import { getTool, getTools } from "@/lib/data";
import { Icon, Star, ToolTile } from "@/components/Icons";
import AddToCart from "@/components/AddToCart";
import ToolGrid from "@/components/ToolGrid";

export const dynamic = "force-dynamic";
export async function generateMetadata({ params }) {
  const t = await getTool(params.slug);
  return { title: t ? `${t.name} - Nexavo AI` : "Not found" };
}

export default async function ToolPage({ params }) {
  const t = await getTool(params.slug);
  if (!t || !t.active) notFound();
  const related = (await getTools({ category: t.category })).filter((x) => x.slug !== t.slug).slice(0, 3);
  return (
    <>
      <section className="relative isolate overflow-hidden pb-10 pt-36">
        <div className="grid-bg absolute inset-0 -z-10" />
        <div className="absolute left-1/4 top-10 -z-10 h-[420px] w-[420px] animate-blob rounded-full blur-[120px]" style={{ background: t.from + "55" }} />
        <div className="absolute right-1/4 top-40 -z-10 h-[380px] w-[380px] animate-blob rounded-full blur-[120px]" style={{ background: t.to + "40", animationDelay: "-6s" }} />
        <div className="section">
          <Link href="/tools" className="text-sm text-muted hover:text-violet-brand">&larr; Back to tools</Link>
          <div className="mt-8 grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="rounded-full bg-amber-50 px-4 py-1.5 text-xs font-bold" style={{ color: categoryColors[t.category] }}>{t.category}</span>
              <h1 className="mt-5 text-5xl font-extrabold tracking-tight sm:text-6xl">{t.name}</h1>
              <p className="mt-4 max-w-md text-lg text-muted">{t.desc}</p>
              <div className="mt-5 flex flex-wrap gap-2">{t.brand && <span className="rounded-full bg-white border border-line px-3 py-1.5 text-xs font-bold">Brand: {t.brand}</span>}{t.duration && <span className="rounded-full bg-white border border-line px-3 py-1.5 text-xs font-bold">Duration: {t.duration}</span>}{t.accessType && <span className="rounded-full bg-white border border-line px-3 py-1.5 text-xs font-bold">Access: {t.accessType}</span>}{t.warranty && <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700">Warranty: {t.warranty}</span>}{t.delivery && <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-[#F3A620]">Delivery: {t.delivery}</span>}</div>
              <p className="mt-5 text-sm text-muted">Price in PKR only. Pay with Safepay (card / JazzCash / Easypaisa / Raast) when connected, or by manual JazzCash / Easypaisa / bank transfer. Instant-delivery items appear in your dashboard in under 60 seconds.</p>
              <div className="mt-5 flex items-center gap-2"><Star size={18} /><b>{t.rating}</b><span className="text-muted">({(t.reviews / 1000).toFixed(1)}k reviews)</span></div>
              <ul className="mt-8 space-y-3.5">
                {t.features.map((f) => <li key={f} className="flex items-center gap-3"><span className="grid h-6 w-6 place-items-center rounded-full bg-cyan-brand/20 text-cyan-brand"><Icon name="check" size={14} stroke={3} /></span>{f}</li>)}
              </ul>
              <div className="mt-10 flex flex-wrap items-center gap-4"><AddToCart tool={t} /><Link href="/pricing" className="btn-ghost text-lg">See plans</Link></div>
            </div>
            <div className="relative mx-auto grid aspect-square w-full max-w-md place-items-center">
              <div className="absolute inset-0 animate-spin-slow rounded-full border border-dashed" style={{ borderColor: t.from + "66" }} />
              <div className="absolute inset-10 animate-spin-slow rounded-full border border-dashed" style={{ borderColor: t.to + "66", animationDirection: "reverse" }} />
              <div className="animate-float"><ToolTile tool={t} size={160} /></div>
            </div>
          </div>
        </div>
      </section>
      {related.length > 0 && <section className="section pt-16"><h2 className="mb-6 text-2xl font-bold">More in {t.category}</h2><ToolGrid tools={related} /></section>}
    </>
  );
}
