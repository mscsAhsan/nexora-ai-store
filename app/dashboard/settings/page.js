import SettingsForm from "@/components/SettingsForm";
import { requireUser } from "@/lib/auth";

export const metadata = { title: "Settings - Nexavo AI" };

export default async function Settings() { const user = await requireUser(); return <SettingsForm user={user} />; }
