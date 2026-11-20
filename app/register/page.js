import PageHeader from "@/components/PageHeader";
import AuthForm from "@/components/AuthForm";
import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = { title: "Create account - Nexavo AI" };

export default async function Register() {
  if (await getUser()) redirect("/dashboard");
  return (<><PageHeader title="Create your account" subtitle="Start buying and using AI tools in minutes." /><section className="section pt-4"><AuthForm mode="register" /></section></>);
}
