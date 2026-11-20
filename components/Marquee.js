const names = ["ChatGPT", "Google Gemini", "Claude", "Canva", "CapCut", "Adobe", "Figma", "Spotify", "Zoom", "Notion", "Microsoft 365", "NordVPN", "Proton", "Coursera", "ElevenLabs", "Cursor", "DeepSeek", "Duolingo", "Safepay", "JazzCash", "Easypaisa", "Raast"];

export default function Marquee() {
  const row = [...names, ...names];
  return (
    <div className="relative overflow-hidden border-y border-line bg-card/30 py-5 [mask-image:linear-gradient(90deg,transparent,#000_15%,#000_85%,transparent)]">
      <div className="flex w-max animate-marquee gap-14">
        {row.map((n, i) => <span key={i} className="whitespace-nowrap text-xl font-bold tracking-wide text-slate-400">{n}</span>)}
      </div>
    </div>
  );
}
