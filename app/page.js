import Link from "next/link";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import ToolGrid from "@/components/ToolGrid";
import Reveal from "@/components/Reveal";
import Stats from "@/components/Stats";
import Pricing from "@/components/Pricing";
import CTA from "@/components/CTA";
import { getTools } from "@/lib/data";

export const dynamic = "force-dynamic";

// Homepage in the sample's exact section order (aitoolspro.org),
// rebranded Nexavo AI, prices in PKR, Safepay instead of Binance/Crypto.
const BRANDS = [
  ["ChatGPT", 66], ["Codex", 49], ["Google Veo", 37], ["Grok", 36],
  ["YouTube", 36], ["Google Gemini", 33], ["Claude", 31], ["KLING", 30],
  ["CapCut", 27], ["Adobe", 22],
];

const STEPS = [
  ["01", "Select Your Tool", "Browse ChatGPT, Claude, Gemini, Canva, Microsoft, Adobe and 349 digital subscriptions. Check the duration, access type and warranty on the listing."],
  ["02", "Secure Checkout", "Pay with Safepay — card, JazzCash, Easypaisa or Raast — or by manual JazzCash / Easypaisa / bank transfer. All prices in PKR, verified instantly."],
  ["03", "Instant Delivery", "Receive automated account credentials or a license key directly in your dashboard and by email in under 60 seconds."],
  ["04", "Full Warranty", "Every account is protected with the full-term replacement warranty shown on its listing, with 24/7 support."],
];

const INSTANT_STEPS = [
  ["01", "Select Your Plan & Pay", "Choose your subscription duration and pay using Safepay (card, JazzCash, Easypaisa, Raast) or manual transfer."],
  ["02", "Automated Provisioning", "Our system generates your private account credentials or official invite link instantly after payment."],
  ["03", "Instant Panel Delivery", "Access details appear directly in your secure customer order dashboard (/dashboard) for immediate use."],
  ["04", "Full Duration Warranty", "Your plan is active. Warranty terms are on the listing, and support is open in your panel."],
];

const TESTIMONIALS = [
  ["Got my ChatGPT Plus account within 30 seconds of payment. Worked flawlessly and renewed easily for month two. Best prices anywhere.", "Hamza K.", "Verified Buyer"],
  ["Claude Pro and Canva Pro team invite working with 100% private workspace. Support answered on WhatsApp in under 3 minutes!", "Sarah M.", "Verified Buyer"],
  ["Saved over Rs 50,000 this month on my AI developer stack. Transparent pricing, instant delivery, and zero downtime.", "Bilal A.", "Verified Buyer"],
];

const TESTED = [
  "Access type (private, invite or shared) stated on every listing",
  "Direct invitation integrity for Canva Pro and workspace tools",
  "Product-specific duration and warranty terms shown before purchase",
  "Automated API provisioning and instant credential delivery",
  "Order details and support history kept in your panel",
  "Replacement support only where the listing says it applies",
];

const RATES = [
  ["Direct API & bulk licensing", "Volume purchasing lets us list many plans below typical retail prices. Always compare with the vendor's current price."],
  ["Account type (Private vs Shared)", "Private standalone accounts command dedicated resources and personal profile isolation."],
  ["Plan duration & commitment", "Longer periods (6-month, 18-month, or 3-year invites) substantially lower the monthly effective cost."],
  ["Immediate automated delivery", "Automated provisioning gives you your access credentials right inside your panel immediately after payment."],
  ["Renewal terms shown up front", "Each listing shows the price for the period you select. Renewal is your choice unless the listing says otherwise."],
];

const CHOOSE = [
  ["01", "Official plan or reseller access?", "An official plan from the vendor comes with that vendor's own support and terms. Reseller and shared access can cost less, but it depends on the provider's terms, can be interrupted, and support comes from the seller. Compare both before you choose."],
  ["02", "What \"private\", \"invite\" and \"shared\" mean", "Every listing states its access type. A private account is for one user. An invite adds your email to a team or workspace. A shared plan is used by more than one person. Pick the type that matches how you will use it."],
  ["03", "Check the duration and renewal", "Longer periods usually lower the monthly cost. Read whether the plan renews automatically and what happens when the period ends, before you pay."],
  ["04", "Check the warranty before you pay", "Replacement and warranty terms differ by product. The listing shows them. If a listing does not mention a warranty, ask support before you buy."],
];

const FAQ = [
  ["How fast is delivery?", "In-stock automated products can arrive within moments. If a product needs a manual invite or review, the listing should say so. Delivery details remain attached to the order in your customer panel."],
  ["What happens if a subscription stops working?", "Warranty and replacement eligibility depend on the specific product. Check the product listing and replacement policy before purchase."],
  ["How do I pay?", "Pay with Safepay (card, JazzCash, Easypaisa, Raast) when it is connected, or by manual JazzCash / Easypaisa / bank transfer — paste your transaction ID at checkout and our team approves it."],
  ["Do I need an account to buy?", "Yes. Your account keeps order history, delivery details and support records in one place."],
  ["Which subscriptions do you sell?", "ChatGPT, Gemini, Claude, Codex, Veo, Grok, Canva, CapCut, Adobe, Figma, Spotify, Zoom, Notion, Microsoft 365, VPNs and 349 premium tools in total — all third-party subscriptions, listed on /tools. Nexavo AI is not affiliated with any of those brands."],
];

function SectionHead({ title, sub, link }) {
  return (
    <Reveal>
      <div className="mb-5 flex items-end justify-between gap-4 sm:mb-8">
        <div><h2 className="text-[1.65rem] font-bold leading-tight sm:text-4xl">{title}</h2>{sub && <p className="mt-1.5 text-muted">{sub}</p>}</div>
        {link && <Link href="/tools" className="shrink-0 text-[15px] font-bold text-[#AD5A00] hover:underline">View all &gt;</Link>}
      </div>
    </Reveal>
  );
}

export default async function Home() {
  const tools = await getTools();
  const featured = tools.filter((t) => t.rating >= 4.9).slice(0, 6);
  return (
    <>
      <Hero tools={tools} />
      <Marquee />

      {/* Find the Right Tool Faster — sample brand grid with sample counts */}
      <section className="section pt-10 sm:pt-16">
        <Reveal>
          <h2 className="text-center text-[1.65rem] font-bold leading-tight sm:text-4xl">Find the Right Tool Faster.</h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-muted">Browse by brand — 349 premium tools in stock, all in PKR.</p>
        </Reveal>
        <div className="hide-scrollbar -mx-4 mt-6 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:mt-8 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:px-0 lg:grid-cols-5">
          {BRANDS.map(([b, n]) => (
            <Link key={b} href={`/tools?q=${encodeURIComponent(b)}`} className="clay group min-w-[150px] shrink-0 snap-start p-4 transition hover:-translate-y-1 sm:min-w-0 sm:p-5">
              <p className="font-bold group-hover:text-[#AD5A00]">{b}</p>
              <p className="mt-1 text-sm text-muted">{n} products</p>
              <p className="mt-2 text-sm font-semibold text-[#AD5A00]">Browse →</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Subscriptions available right now */}
      <section id="tools" className="section scroll-mt-24 pt-10 sm:pt-16">
        <SectionHead title="Subscriptions available right now." sub="In stock — instant delivery after payment" link />
        <ToolGrid tools={tools.slice(0, 12)} />
      </section>

      {/* How It Works in 4 Simple Steps */}
      <section className="section pt-12 sm:pt-20">
        <Reveal>
          <h2 className="text-center text-[1.65rem] font-bold leading-tight sm:text-4xl">How It Works in 4 Simple Steps</h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-muted">Get access to world-class AI models and premium creative tools in under 60 seconds.</p>
        </Reveal>
        <div className="mt-6 grid gap-3 sm:mt-10 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(([n, t, d], i) => (
            <Reveal key={n} delay={i * 90}>
              <div className="clay h-full p-5 sm:p-6">
                <p className="text-3xl font-extrabold text-[#F3A620]">{n}</p>
                <h3 className="mt-3 text-lg font-bold">{t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Trusted by 2,800+ Creators & Pros + WELCOME10 */}
      <section className="section pt-12 sm:pt-20">
        <Reveal><h2 className="text-center text-[1.65rem] font-bold leading-tight sm:text-4xl">Trusted by 2,800+ Creators &amp; Pros</h2></Reveal>
        <div className="hide-scrollbar -mx-4 mt-6 flex snap-x gap-3 overflow-x-auto px-4 pb-3 sm:mt-10 md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 md:pb-0">
          {TESTIMONIALS.map(([q, name, role]) => (
            <Reveal key={name} className="min-w-[85%] shrink-0 snap-start md:min-w-0">
              <div className="clay h-full p-5 sm:p-6">
                <p className="text-base leading-relaxed sm:text-lg">“{q}”</p>
                <p className="mt-4 font-bold">{name}</p>
                <p className="text-sm text-muted">{role}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <div className="mt-6 rounded-[20px] p-6 text-center text-white shadow-lg sm:mt-10 sm:rounded-[24px] sm:p-8" style={{ background: "linear-gradient(135deg,#F3A620,#DB2777)" }}>
            <h3 className="text-2xl font-bold">Get 10% Off Your First AI Tool</h3>
            <p className="mt-2 opacity-90">Use code <b className="rounded-lg bg-white/20 px-3 py-1">WELCOME10</b> at checkout. Join 15,000+ digital professionals receiving weekly AI discounts &amp; stock alerts.</p>
          </div>
        </Reveal>
      </section>

      {/* Featured this week */}
      <section className="section pt-12 sm:pt-20">
        <SectionHead title="Featured this week." sub="Highest-rated plans, tested before delivery" link />
        <ToolGrid tools={featured.length ? featured : tools.slice(0, 6)} />
      </section>

      <Stats />

      {/* Tested before delivery to your panel */}
      <section className="section pt-12 sm:pt-20">
        <div className="grid gap-10 lg:grid-cols-2">
          <Reveal>
            <h2 className="text-[1.65rem] font-bold leading-tight sm:text-4xl">Tested before delivery to your panel.</h2>
            <p className="mt-3 leading-relaxed text-muted">Every order is guaranteed with the checks below — read the listing before you pay, and your delivery details stay attached to the order in your panel.</p>
            <Link href="/tools" className="btn-primary mt-5 w-full sm:mt-6 sm:w-auto">Browse all tools</Link>
          </Reveal>
          <div className="space-y-3">
            {TESTED.map((x) => (
              <Reveal key={x}><div className="clay flex items-start gap-3 p-4"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#FFF8EF] font-bold text-[#AD5A00]">✓</span><p className="text-[15px] font-medium">{x}</p></div></Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Instant Access to Your Tools in Four Simple Steps */}
      <section className="section pt-12 sm:pt-20">
        <Reveal>
          <h2 className="text-center text-[1.65rem] font-bold leading-tight sm:text-4xl">Instant Access to Your Tools in Four Simple Steps.</h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-muted">Instant-delivery products arrive in your panel right after payment. Products that need manual review say so on the listing.</p>
        </Reveal>
        <div className="mt-6 grid gap-3 sm:mt-10 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
          {INSTANT_STEPS.map(([n, t, d], i) => (
            <Reveal key={n} delay={i * 90}>
              <div className="clay h-full p-5 sm:p-6">
                <p className="text-3xl font-extrabold text-[#F3A620]">{n}</p>
                <h3 className="mt-3 text-lg font-bold">{t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* What actually sets our reseller rates */}
      <section className="section pt-12 sm:pt-20">
        <Reveal>
          <h2 className="text-center text-[1.65rem] font-bold leading-tight sm:text-4xl">What actually sets our reseller rates.</h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-muted">Direct supplier integration and volume licensing enable enterprise rates without the retail markup.</p>
        </Reveal>
        <div className="mx-auto mt-6 grid max-w-4xl gap-3 sm:mt-10 sm:gap-4 md:grid-cols-2">
          {RATES.map(([t, d]) => (
            <Reveal key={t}><div className="clay h-full p-5 sm:p-6"><h3 className="font-bold">{t}</h3><p className="mt-2 text-sm leading-relaxed text-muted">{d}</p></div></Reveal>
          ))}
        </div>
      </section>

      {/* How to choose an AI tool plan */}
      <section className="section pt-12 sm:pt-20">
        <Reveal>
          <h2 className="text-center text-[1.65rem] font-bold leading-tight sm:text-4xl">How to choose an AI tool plan that fits how you work.</h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-muted">Four checks before you buy, and a quick guide to which tool suits which job.</p>
        </Reveal>
        <div className="mt-6 grid gap-3 sm:mt-10 sm:gap-6 md:grid-cols-2">
          {CHOOSE.map(([n, t, d]) => (
            <Reveal key={n}>
              <div className="clay h-full p-5 sm:p-6">
                <p className="text-2xl font-extrabold text-[#F3A620]">{n}</p>
                <h3 className="mt-2 text-lg font-bold">{t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{d}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {[["Writing & research", "AI Chat"], ["Design & social posts", "Design"], ["Video editing", "Video Editing"]].map(([l, c]) => (
              <Link key={l} href={`/tools?category=${encodeURIComponent(c)}`} className="rounded-full border border-line bg-white px-5 py-2.5 text-sm font-semibold hover:border-[#F3A620]">{l} →</Link>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Questions Buyers Ask Us First */}
      <section className="section pt-12 sm:pt-20">
        <Reveal><h2 className="text-center text-[1.65rem] font-bold leading-tight sm:text-4xl">Questions Buyers Ask Us First.</h2></Reveal>
        <div className="mx-auto mt-6 max-w-3xl space-y-3 sm:mt-10 sm:space-y-4">
          {FAQ.map(([q, a]) => (
            <Reveal key={q}>
              <details className="clay group p-4 sm:p-6">
                <summary className="cursor-pointer list-none font-bold">{q}<span className="float-right text-[#F3A620] transition group-open:rotate-45">+</span></summary>
                <p className="mt-3 text-sm leading-relaxed text-muted">{a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Know the plan before you pay */}
      <section className="section pt-12 sm:pt-20">
        <Reveal>
          <div className="clay p-6 text-center sm:p-12">
            <h2 className="text-[1.65rem] font-bold leading-tight sm:text-4xl">Know the plan before you pay. Then order the one that fits.</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted">Browse the live catalog, compare the access type and term, and check the delivery and warranty notes on the product page before you place the order.</p>
            <Link href="/tools" className="btn-primary mt-5 w-full sm:mt-6 sm:w-auto">Browse the live catalog</Link>
          </div>
        </Reveal>
      </section>

      <Pricing />
      <CTA />
    </>
  );
}
