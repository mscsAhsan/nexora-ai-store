const names = ["ChatGPT", "Codex", "Google Gemini", "Claude", "Google Veo", "Grok", "KLING", "CapCut", "Adobe", "Canva", "Figma", "Spotify", "Zoom", "Notion", "Microsoft 365", "NordVPN", "Proton", "Coursera", "ElevenLabs", "Cursor", "DeepSeek", "Duolingo"];

export default function Marquee() {
  const row = [...names, ...names];
  return (
    <div className="relative overflow-hidden border-y border-line bg-white py-5 [mask-image:linear-gradient(90deg,transparent,#000_15%,#000_85%,transparent)]">
      <div className="flex w-max animate-marquee gap-14">
        {row.map((n, i) => <span key={i} className="whitespace-nowrap text-xl font-bold tracking-wide text-[#625B6B]">{n}</span>)}
      </div>
    </div>
  );
}
