const P = {
  pen: <><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" /></>,
  image: <><rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="8.5" cy="8.5" r="1.6" /><path d="M21 15l-5-5L5 21" /></>,
  video: <><rect x="2" y="5" width="14" height="14" rx="3" /><path d="M22 8l-6 4 6 4z" /></>,
  code: <><path d="M16 18l6-6-6-6" /><path d="M8 6l-6 6 6 6" /></>,
  mic: <><rect x="9" y="2" width="6" height="12" rx="3" /><path d="M5 10v2a7 7 0 0 0 14 0v-2" /><path d="M12 19v3" /></>,
  megaphone: <><path d="M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1z" /><path d="M15.5 8.5a5 5 0 0 1 0 7" /><path d="M18.5 5.5a9 9 0 0 1 0 13" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></>,
  cart: <><circle cx="9" cy="20" r="1.4" /><circle cx="18" cy="20" r="1.4" /><path d="M2 3h3l2.7 12.4a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.5L21 8H6" /></>,
  check: <path d="M20 6L9 17l-5-5" />,
  arrow: <><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></>,
  sparkle: <path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8z" />,
  menu: <><path d="M3 6h18" /><path d="M3 12h18" /><path d="M3 18h18" /></>,
  close: <><path d="M18 6L6 18" /><path d="M6 6l12 12" /></>,
  trash: <><path d="M3 6h18" /><path d="M8 6V4h8v2" /><path d="M19 6l-1 14H6L5 6" /></>,
  shield: <path d="M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5z" />,
  bolt: <path d="M13 2L4 14h7l-1 8 9-12h-7z" />,
};

export function Icon({ name, size = 20, className = "", stroke = 2 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {P[name]}
    </svg>
  );
}

export function Star({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#FBBF24" aria-hidden="true">
      <path d="M12 2l3 6.9 7.5.7-5.7 5 1.7 7.4L12 18l-6.5 4 1.7-7.4-5.7-5 7.5-.7z" />
    </svg>
  );
}

export function ToolTile({ tool, size = 56 }) {
  return (
    <div className="relative grid place-items-center rounded-2xl text-white shadow-lg"
      style={{ width: size, height: size, background: `linear-gradient(135deg, ${tool.from}, ${tool.to})`, boxShadow: `0 10px 30px -8px ${tool.from}88` }}>
      <Icon name={tool.icon} size={size * 0.46} />
      <span className="absolute inset-0 rounded-2xl ring-1 ring-white/20" />
    </div>
  );
}
