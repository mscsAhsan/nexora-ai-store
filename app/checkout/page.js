import PageHeader from "@/components/PageHeader";
import CheckoutForm from "@/components/CheckoutForm";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata = { title: "Checkout - Nexora AI" };

export default async function Checkout({ searchParams }) {
  const user = await requireUser("/checkout");
  const options = {
    stripe: !!process.env.STRIPE_SECRET_KEY,
    demo: !process.env.DISABLE_DEMO_PAYMENT,
    instructions: process.env.PAYMENT_INSTRUCTIONS || "Send the amount via JazzCash / Easypaisa / Bank transfer to the account shown on your invoice, then paste the transaction ID below.",
  };
  return (<><PageHeader title="Checkout" subtitle={`Signed in as ${user.email}`} /><section className="section max-w-3xl pt-4"><CheckoutForm plan={searchParams.plan || ""} options={options} /></section></>);
}
