import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import Stats from "@/components/Stats";

export const metadata = { title: "About - Nexora AI" };

const values = [["Curated, not crowded", "Every tool is tested by our team before it is listed."], ["Fair pricing", "No hidden fees. See the full price before you pay."], ["Real support", "Talk to a human when something goes wrong."]];

export default function About() {
  return (
    <>
      <PageHeader title="About Nexora AI" subtitle="We help creators, teams and startups find AI tools that actually save time." />
      <section className="section max-w-3xl space-y-5 pt-6 text-center text-lg leading-relaxed text-muted">
        <p>New AI tools appear every day, and it is hard to know which ones are worth paying for. Nexora AI is a marketplace where every tool is hand-picked, tested and priced fairly, so you can buy with confidence.</p>
      </section>
      <section className="section grid gap-6 pt-12 md:grid-cols-3">
        {values.map(([t, d]) => <div key={t} className="glass rounded-3xl p-7"><h3 className="text-xl font-bold">{t}</h3><p className="mt-2 text-muted">{d}</p></div>)}
      </section>
      <Stats />
      <div className="mt-12 text-center"><Link href="/tools" className="btn-primary">Explore tools</Link></div>
    </>
  );
}
