import PageHeader from "@/components/PageHeader";

export const metadata = { title: "Terms of Service - Nexavo AI" };

const sections = [
  ["Using the service", "By creating an account you agree to use Nexavo AI lawfully and not to share or resell your license keys."],
  ["Payments", "Prices are shown in Pakistani rupees (PKR). An order is completed once payment is confirmed via Safepay. Manual payments are confirmed by our team."],
  ["Refunds", "If a tool does not work as described, contact support within 7 days."],
  ["Changes", "We may update these terms; continued use means you accept the changes."],
];

export default function Page() {
  return (
    <>
      <PageHeader title="Terms of Service" subtitle="Last updated: November 2026" />
      <article className="section max-w-3xl space-y-8 pt-10">
        {sections.map(([h, t]) => <div key={h}><h2 className="text-2xl font-bold">{h}</h2><p className="mt-2 leading-relaxed text-muted">{t}</p></div>)}
      </article>
    </>
  );
}
