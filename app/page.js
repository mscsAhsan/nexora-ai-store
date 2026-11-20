import Link from "next/link";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import CategoryChips from "@/components/CategoryChips";
import ToolGrid from "@/components/ToolGrid";
import Reveal from "@/components/Reveal";
import Stats from "@/components/Stats";
import Pricing from "@/components/Pricing";
import CTA from "@/components/CTA";
import { getTools } from "@/lib/data";
import { categories } from "@/lib/tools";

export const dynamic = "force-dynamic";

const STEPS = [
  ["01", "Select your tool", "Browse ChatGPT, Claude, Gemini, Canva, Adobe and 80+ digital subscriptions. Check the duration, access type and warranty on the listing."],
  ["02", "Secure checkout", "Pay with Safepay — card, JazzCash, Easypaisa or Raast — or by manual JazzCash / Easypaisa / bank transfer. All prices in PKR."],
  ["03", "Instant delivery", "Automated products arrive in your dashboard and by email in under 60 seconds. Products needing manual review say so on the listing."],
  ["04", "Full warranty", "Every plan is protected by the warranty shown on its listing, with 24/7 support if a subscription stops working."],
];

const TESTIMONIALS = [
  ["Got my ChatGPT Plus account within 30 seconds of payment. Worked flawlessly and renewed easily for month two. Best prices anywhere.", "Hamza K.", "Verified Buyer"],
  ["Claude API and Canva Pro team invite working with 100% private workspace. Support answered on WhatsApp in under 3 minutes!", "Sarah M.", "Verified Buyer"],
  ["Saved over Rs 50,000 this month on my AI developer stack. Transparent pricing, instant delivery, and zero downtime.", "Bilal A.", "Verified Buyer"],
];

const FAQ = [
  ["How fast is delivery?", "In-stock automated products arrive within moments — access details appear in your customer dashboard and by email. If a product needs a manual invite or review, the listing says so."],
  ["What happens if a subscription stops working?", "Warranty and replacement eligibility depend on the specific product. Check the product listing and replacement policy before you buy, then contact support from /contact."],
  ["How do I pay?", "Pay with Safepay (card, JazzCash, Easypaisa, Raast) when it is connected, or by manual JazzCash / Easypaisa / bank transfer — paste your transaction ID at checkout and our team approves it."],
  ["Do I need an account to buy?", "Yes. Your account keeps order history, delivery details and support records in one place. Register in under a minute."],
  ["Are these official plans?", "These are third-party subscriptions resold as access plans (Private, Shared, Invite, CDK or Redeem Link — shown on each listing). Nexavo AI is not affiliated with, or endorsed by, ChatGPT, Google, Canva or any brand listed."],
];

export default async function Home() {
  const tools = await getTools();
  const featured = tools.filter((t) => t.rating >= 4.8).slice(0, 6);
  const counts = {};
  tools.forEach((t) => { counts[t.category] = (counts[t.category] || 0) + 1; });
  return (
    <>
      <Hero tools={tools} />
      <Marquee />
      <section className="section pt-14">
        <Reveal>
          <h2 className="text-center text-3xl font-bold sm:text-4xl">Find the right tool faster</h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-muted">Browse by brand and category — ChatGPT, Gemini, Canva, CapCut, Adobe and more.</p>
        </Reveal>
        <div className="mt-8"><CategoryChips /></div>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.slice(1).map((c) => (
            <Link key={c} href={`/tools?category=${encodeURIComponent(c)}`} className="group rounded-3xl border border-line bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#0E7A5F] hover:shadow-lg">
              <p className="font-bold group-hover:text-[#0E7A5F]">{c}</p>
              <p className="mt-1 text-sm text-muted">{counts[c] || 0} product{(counts[c] || 0) === 1 ? "" : "s"}</p>
            </Link>
          ))}
        </div>
      </section>
      <section id="tools" className="section scroll-mt-24 pt-16">
        <Reveal>
          <div className="mb-8 flex items-end justify-between">
            <div><h2 className="text-3xl font-bold sm:text-4xl">Subscriptions available right now</h2><p className="mt-1.5 text-muted">In stock — instant delivery after payment</p></div>
            <Link href="/tools" className="text-[15px] font-bold text-cyan-brand hover:underline">View all &gt;</Link>
          </div>
        </Reveal>
        <ToolGrid tools={tools.slice(0, 9)} />
      </section>
      <section className="section pt-20">
        <Reveal>
          <h2 className="text-center text-3xl font-bold sm:text-4xl">How it works in 4 simple steps</h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-muted">Get access to world-class AI models and premium creative tools in under 60 seconds.</p>
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(([n, t, d], i) => (
            <Reveal key={n} delay={i * 90}>
              <div className="h-full rounded-3xl border border-line bg-white p-6 shadow-sm">
                <p className="text-3xl font-extrabold text-[#0E7A5F]">{n}</p>
                <h3 className="mt-3 text-lg font-bold">{t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="section pt-20">
        <Reveal>
          <div className="mb-8 flex items-end justify-between">
            <div><h2 className="text-3xl font-bold sm:text-4xl">Featured this week</h2><p className="mt-1.5 text-muted">Highest-rated plans, tested before delivery</p></div>
            <Link href="/tools" className="text-[15px] font-bold text-cyan-brand hover:underline">View all &gt;</Link>
          </div>
        </Reveal>
        <ToolGrid tools={featured} />
      </section>
      <Stats />
      <section className="section pt-20">
        <Reveal>
          <h2 className="text-center text-3xl font-bold sm:text-4xl">Trusted by 2,800+ creators &amp; pros</h2>
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map(([q, name, role]) => (
            <Reveal key={name}>
              <div className="h-full rounded-3xl border border-line bg-white p-6 shadow-sm">
                <p className="text-lg leading-relaxed">“{q}”</p>
                <p className="mt-4 font-bold">{name}</p>
                <p className="text-sm text-muted">{role}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <div className="mt-10 rounded-3xl bg-gradient-to-r from-[#0E7A5F] to-[#0F766E] p-8 text-center text-white shadow-lg">
            <h3 className="text-2xl font-bold">Get 10% off your first AI tool</h3>
            <p className="mt-2 opacity-90">Use code <b className="rounded-lg bg-white/20 px-3 py-1">WELCOME10</b> at checkout. Join 15,000+ digital professionals receiving weekly AI discounts &amp; stock alerts.</p>
          </div>
        </Reveal>
      </section>
      <section className="section pt-20">
        <Reveal>
          <h2 className="text-center text-3xl font-bold sm:text-4xl">Questions buyers ask us first</h2>
        </Reveal>
        <div className="mx-auto mt-10 max-w-3xl space-y-4">
          {FAQ.map(([q, a]) => (
            <Reveal key={q}>
              <details className="group rounded-3xl border border-line bg-white p-6 shadow-sm">
                <summary className="cursor-pointer list-none font-bold">{q}<span className="float-right text-[#0E7A5F] transition group-open:rotate-45">+</span></summary>
                <p className="mt-3 text-sm leading-relaxed text-muted">{a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </section>
      <Pricing />
      <CTA />
    </>
  );
}
