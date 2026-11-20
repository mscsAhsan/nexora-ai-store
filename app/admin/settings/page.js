import { headers } from "next/headers";
import { safepayConfigured, safepayEnv } from "@/lib/safepay";
import { cohereConfigured, cohereModel } from "@/lib/chat";

export const dynamic = "force-dynamic";
export const metadata = { title: "Settings - Nexavo AI Admin" };

export default async function AdminSettings() {
  const h = headers();
  const origin = `${h.get("x-forwarded-proto") || "https"}://${h.get("host") || "localhost:3000"}`;
  const sp = safepayConfigured();
  const env = safepayEnv();
  const ai = cohereConfigured();
  const steps = [
    ["1. Create a Safepay merchant account", "At getsafepay.com — you need CNIC + NTN + a Pakistani bank account. Approval first, keys after."],
    ["2. Use sandbox keys first", "Copy the sandbox SAFEPAY_API_KEY and SAFEPAY_SECRET_KEY, keep SAFEPAY_ENV=sandbox, and test with Safepay's test cards."],
    ["3. Add the keys to Vercel", "Vercel dashboard → your project → Settings → Environment Variables: SAFEPAY_API_KEY, SAFEPAY_SECRET_KEY, SAFEPAY_WEBHOOK_SECRET, SAFEPAY_ENV. Never put a real key in code, chat or a commit."],
    ["4. Redeploy", "Redeploy the project so the new env vars take effect. The Safepay option then appears automatically at checkout."],
    ["5. Test, then go live", "Place a small demo order, confirm the webhook marks it paid and the delivery email arrives, then switch SAFEPAY_ENV=production with live keys."],
  ];
  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-line bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold">Safepay — Pakistan payments</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-[#FAF7F0] p-4"><p className="text-sm text-muted">Status</p><p className="mt-1 text-lg font-bold">{sp ? "● Connected" : "○ Not connected"}</p><p className="text-sm text-muted">{sp ? "Checkout shows the Safepay option." : "Checkout shows the 'not set up yet' banner; manual + test payment still work."}</p></div>
          <div className="rounded-2xl bg-[#FAF7F0] p-4"><p className="text-sm text-muted">Environment</p><p className="mt-1 text-lg font-bold capitalize">{env}</p><p className="text-sm text-muted">From SAFEPAY_ENV (sandbox by default).</p></div>
          <div className="rounded-2xl bg-[#FAF7F0] p-4"><p className="text-sm text-muted">Webhook URL</p><p className="mt-1 break-all text-sm font-bold">{origin}/api/webhooks/safepay</p><p className="text-sm text-muted">Paste this in Safepay → Developers → Webhooks, with the signing secret.</p></div>
        </div>
        <p className="mt-4 text-sm text-muted">Keys are never shown here — only whether they are set. If a key is missing, the store does not invent one.</p>
        <h3 className="mt-6 font-bold">Safepay fees (standard plan)</h3>
        <table className="mt-3 w-full max-w-xl text-left text-sm">
          <tbody>
            {[["Local cards", "2.9% + Rs 30 per successful charge"], ["International cards", "2.9% + Rs 30 + 0.3%"], ["JazzCash / Easypaisa wallets", "1.5% per successful charge"], ["Raast", "1.5% per successful charge"], ["Disputes", "Rs 3,000 each"], ["Instant payouts", "1.5% of volume"]].map(([a, b]) => (
              <tr key={a} className="border-b border-line last:border-0"><td className="py-2.5 pr-4 font-semibold">{a}</td><td className="py-2.5 text-muted">{b}</td></tr>
            ))}
          </tbody>
        </table>
        <h3 className="mt-8 font-bold">Connect later — checklist</h3>
        <ol className="mt-3 space-y-3">
          {steps.map(([t, d]) => <li key={t} className="rounded-2xl bg-[#FAF7F0] p-4"><b>{t}</b><p className="text-sm text-muted">{d}</p></li>)}
        </ol>
      </section>
      <section className="rounded-3xl border border-line bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold">AI Chatbot (Cohere)</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-[#FAF7F0] p-4"><p className="text-sm text-muted">Status</p><p className="mt-1 text-lg font-bold">{ai ? "● Connected" : "○ Not connected"}</p><p className="text-sm text-muted">{ai ? "The chatbot answers with Cohere, grounded in the live catalogue." : "The chatbot answers from the store FAQ + live catalogue instead."}</p></div>
          <div className="rounded-2xl bg-[#FAF7F0] p-4"><p className="text-sm text-muted">Model</p><p className="mt-1 text-lg font-bold">{cohereModel()}</p><p className="text-sm text-muted">From COHERE_MODEL (default command-r-plus).</p></div>
          <div className="rounded-2xl bg-[#FAF7F0] p-4"><p className="text-sm text-muted">Where to add the key</p><p className="mt-1 text-sm font-bold">Vercel → Settings → Environment Variables → COHERE_API_KEY</p><p className="text-sm text-muted">Get one at dashboard.cohere.com/api-keys. Server only — never in the browser.</p></div>
        </div>
        <p className="mt-4 text-sm text-muted">The chatbot only answers about this store, using live prices from the database. It never invents prices or tools, and never asks customers for passwords, card numbers or OTPs.</p>
      </section>
      <section className="rounded-3xl border border-line bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold">Other settings</h2>
        <p className="mt-2 text-sm text-muted">Store name, admin account and database are controlled by environment variables (see .env.example): ADMIN_EMAIL / ADMIN_PASSWORD, TURSO_DATABASE_URL / TURSO_AUTH_TOKEN, RESEND_API_KEY / EMAIL_FROM, PAYMENT_INSTRUCTIONS, DISABLE_DEMO_PAYMENT. Change them in Vercel and redeploy — do not edit them in code.</p>
      </section>
    </div>
  );
}
