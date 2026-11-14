import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-brand-gradient shadow-lg shadow-violet-brand/40">
        <span className="h-4 w-4 rounded-full border-2 border-white" />
        <span className="absolute h-1.5 w-1.5 rounded-full bg-white" />
      </span>
      <span className="text-2xl font-bold tracking-tight">Nexora<span className="text-cyan-brand"> AI</span></span>
    </Link>
  );
}
