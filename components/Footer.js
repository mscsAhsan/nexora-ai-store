import Link from "next/link";
import Logo from "./Logo";
import NewsletterForm from "./NewsletterForm";

const cols = [
  ["Product", [["All tools", "/tools"], ["Pricing", "/pricing"], ["Cart", "/cart"], ["Dashboard", "/dashboard"]]],
  ["Company", [["About", "/about"], ["Blog", "/blog"], ["Contact", "/contact"], ["Support", "/contact"]]],
  ["Legal", [["Privacy", "/privacy"], ["Terms", "/terms"]]],
];

export default function Footer() {
  return (
    <footer id="footer" className="section mt-24 border-t border-line py-14">
      <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">Discover, compare and buy the best AI tools for writing, design, video and coding.</p>
          <NewsletterForm />
        </div>
        {cols.map(([t, ls]) => (
          <div key={t}>
            <h4 className="mb-4 font-semibold">{t}</h4>
            <ul className="space-y-2.5 text-sm text-muted">
              {ls.map(([l, h]) => <li key={l}><Link href={h} className="hover:text-white">{l}</Link></li>)}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-12 border-t border-line pt-6 text-center text-sm text-muted">&copy; 2026 Nexora AI. All rights reserved.</p>
    </footer>
  );
}
