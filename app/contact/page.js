import PageHeader from "@/components/PageHeader";
import ContactForm from "@/components/ContactForm";

export const metadata = { title: "Contact & Support - Nexavo AI" };

const faqs = [
  ["How do I get my tool after paying?", "Open your Dashboard. Your license key and access link appear as soon as the order is paid."],
  ["My manual payment is still pending.", "Manual payments are approved by our team, usually within a few hours. Make sure you entered the correct transaction ID."],
  ["Can I change my plan?", "Yes, choose another plan on the Pricing page at any time."],
];

export default function Contact() {
  return (
    <>
      <PageHeader title="Contact & Support" subtitle="Questions? Send us a message and we will reply by email." />
      <section className="section grid max-w-5xl gap-8 pt-10 lg:grid-cols-2">
        <ContactForm />
        <div>
          <h2 className="mb-4 text-2xl font-bold">Quick answers</h2>
          <div className="space-y-3">
            {faqs.map(([q, a]) => <details key={q} className="glass rounded-2xl p-5"><summary className="cursor-pointer list-none font-semibold">{q}</summary><p className="mt-3 text-muted">{a}</p></details>)}
          </div>
          <p className="mt-6 text-sm text-muted">Email: {process.env.SUPPORT_EMAIL || "support@yourdomain.com"}</p>
        </div>
      </section>
    </>
  );
}
