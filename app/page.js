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

export const dynamic = "force-dynamic";

export default async function Home() {
  const tools = await getTools();
  return (
    <>
      <Hero tools={tools} />
      <Marquee />
      <section className="section pt-14"><CategoryChips /></section>
      <section id="tools" className="section scroll-mt-24 pt-16">
        <Reveal>
          <div className="mb-8 flex items-end justify-between">
            <div><h2 className="text-3xl font-bold sm:text-4xl">Trending AI tools</h2><p className="mt-1.5 text-muted">Most purchased this week</p></div>
            <Link href="/tools" className="text-[15px] font-bold text-cyan-brand hover:underline">View all &gt;</Link>
          </div>
        </Reveal>
        <ToolGrid tools={tools.slice(0, 6)} />
      </section>
      <Stats />
      <Pricing />
      <CTA />
    </>
  );
}
