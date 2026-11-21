"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

// Small page-shift animation: every navigation fades + slides the new page
// up slightly (~300ms), with a thin emerald loading bar at the top.
export default function PageTransition({ children }) {
  const pathname = usePathname();
  const [bar, setBar] = useState(false);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) { first.current = false; return; }
    setBar(true);
    const t = setTimeout(() => setBar(false), 350);
    return () => clearTimeout(t);
  }, [pathname]);

  return (
    <>
      <div
        className={`fixed left-0 top-0 z-[95] h-[3px] bg-gradient-to-r from-[#F3A620] via-[#0EA5E9] to-[#F3A620] transition-all duration-300 ${bar ? "w-full opacity-100" : "w-0 opacity-0"}`}
        aria-hidden
      />
      <div key={pathname} className="page-transition">
        {children}
      </div>
    </>
  );
}
