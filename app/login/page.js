import PageHeader from "@/components/PageHeader";
import AuthForm from "@/components/AuthForm";
import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = { title: "Sign in - Nexora AI" };

export default async function Login({ searchParams }) {
  if (await getUser()) redirect("/dashboard");
  const next = searchParams.next?.startsWith("/") ? searchParams.next : "/dashboard";
  return (<><PageHeader title="Welcome back" subtitle="Sign in to access your tools and orders." /><section className="section pt-4"><AuthForm mode="login" next={next} /></section></>);
}
