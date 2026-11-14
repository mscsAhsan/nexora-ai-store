import PageHeader from "@/components/PageHeader";
import Pricing from "@/components/Pricing";

export const metadata = { title: "Pricing - Nexora AI" };

const faqs = [
  ["Can I cancel anytime?", "Yes. Plans are billed per month and you can stop whenever you like."],
  ["What payment methods do you accept?", "Card payments (when enabled), and manual payment by bank transfer / mobile wallet with admin approval."],
  ["Do I get a refund?", "If a tool does not work as described, contact support within 7 days and we will make it right."],
];

export default function PricingPage() {
  return (
    <>
      <PageHeader title="Simple, transparent pricing" subtitle="Pick a plan that fits. Upgrade or cancel whenever you want." />
      <Pricing heading={false} />
      <section className="section max-w-3xl pt-24">
        <h2 className="mb-6 text-center text-3xl font-bold">Billing questions</h2>
        <div className="space-y-3">
          {faqs.map(([q, a]) => (
            <details key={q} className="glass group rounded-2xl p-5"><summary className="cursor-pointer list-none font-semibold">{q}</summary><p className="mt-3 text-muted">{a}</p></details>
          ))}
        </div>
      </section>
    </>
  );
}
