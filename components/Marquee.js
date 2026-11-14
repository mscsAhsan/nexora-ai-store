const names = ["Notion", "Slack", "Figma", "Shopify", "Canva", "Zapier", "Webflow", "Stripe", "Discord", "GitHub"];

export default function Marquee() {
  const row = [...names, ...names];
  return (
    <div className="relative overflow-hidden border-y border-line bg-card/30 py-5 [mask-image:linear-gradient(90deg,transparent,#000_15%,#000_85%,transparent)]">
      <div className="flex w-max animate-marquee gap-14">
        {row.map((n, i) => <span key={i} className="whitespace-nowrap text-xl font-bold tracking-wide text-white/25">{n}</span>)}
      </div>
    </div>
  );
}
