import PageHeader from "@/components/PageHeader";

export const metadata = { title: "Privacy Policy - Nexavo AI" };

const sections = [
  ["Information we collect", "We collect your name, email address and order history when you create an account or make a purchase. We never store full card numbers."],
  ["How we use it", "To create your account, process orders, deliver licenses and reply to support requests. We do not sell your personal data."],
  ["Cookies", "We use a single secure cookie to keep you signed in."],
  ["Your rights", "You can update your details in Settings or contact us to delete your account."],
];

export default function Page() {
  return (
    <>
      <PageHeader title="Privacy Policy" subtitle="Last updated: November 2026" />
      <article className="section max-w-3xl space-y-8 pt-10">
        {sections.map(([h, t]) => <div key={h}><h2 className="text-2xl font-bold">{h}</h2><p className="mt-2 leading-relaxed text-muted">{t}</p></div>)}
      </article>
    </>
  );
}
