import Link from "next/link";
import Logo from "./Logo";
import NewsletterForm from "./NewsletterForm";
import FooterNav from "./FooterNav";
import { whatsappUrl, whatsappDisplay } from "@/lib/site";

const cols = [
  ["Shop", [["ChatGPT", "/tools?q=ChatGPT"], ["Google Gemini", "/tools?q=Gemini"], ["Canva", "/tools?q=Canva"], ["CapCut", "/tools?q=CapCut"], ["Adobe", "/tools?q=Adobe"], ["All tools", "/tools"]]],
  ["Product", [["All tools", "/tools"], ["Pricing", "/pricing"], ["Cart", "/cart"], ["Dashboard", "/dashboard"]]],
  ["Company", [["About", "/about"], ["Blog", "/blog"], ["Contact", "/contact"], ["Support", "/contact"]]],
  ["Legal", [["Privacy", "/privacy"], ["Terms", "/terms"]]],
];

export default function Footer() {
  return (
    <footer id="footer" className="section mt-14 border-t border-line py-10 sm:mt-24 sm:py-14">
      <div className="grid gap-3 md:grid-cols-[1.4fr_1fr_1fr_1fr_1fr] md:gap-10">
        <div className="mb-4 md:mb-0">
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">Discover, compare and buy premium AI tools and digital subscriptions in PKR — ChatGPT, Gemini, Canva, CapCut, Adobe, Figma, Spotify and more, with instant delivery in Pakistan.</p>
          <p className="mt-4 text-sm">Chat on WhatsApp: <a href={whatsappUrl()} target="_blank" rel="noreferrer" className="font-bold text-[#128C7E] hover:underline">WhatsApp {whatsappDisplay()}</a></p>
          <p className="mt-2 text-sm text-muted">Pay with Safepay — card, JazzCash, Easypaisa, Raast.</p>
          <NewsletterForm />
        </div>
        <FooterNav cols={cols} />
      </div>
      <p className="mt-8 border-t border-line pt-6 text-center text-xs leading-relaxed text-muted sm:mt-12 sm:text-sm">&copy; 2026 Nexavo AI. All rights reserved. Nexavo AI is not affiliated with, or endorsed by, any brand listed — these are third-party subscriptions resold as access plans.</p>
    </footer>
  );
}
