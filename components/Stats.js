"use client";
import { useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";

const data = [["81", "", "Premium tools listed"], ["2800", "+", "Creators & pros"], ["4.8", "/5", "Average rating"], ["60", "s", "Instant delivery"]];

function Count({ to, suffix }) {
  const ref = useRef(null);
  const [v, setV] = useState(0);
  useEffect(() => {
    const el = ref.current;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const end = parseFloat(to), t0 = performance.now();
      const step = (t) => {
        const p = Math.min((t - t0) / 1400, 1);
        setV(end * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
    io.observe(el);
    return () => io.disconnect();
  }, [to]);
  const shown = to.includes(".") ? v.toFixed(1) : Math.round(v).toLocaleString("en-PK");
  return <span ref={ref}>{shown}{suffix}</span>;
}

export default function Stats() {
  return (
    <section className="section pt-24">
      <Reveal>
        <div className="glass relative overflow-hidden rounded-3xl py-10">
          <div className="absolute -left-10 top-0 h-40 w-40 rounded-full bg-violet-brand/20 blur-3xl" />
          <div className="absolute -right-10 bottom-0 h-40 w-40 rounded-full bg-cyan-brand/20 blur-3xl" />
          <div className="relative grid grid-cols-2 gap-y-8 md:grid-cols-4">
            {data.map(([n, s, l], i) => (
              <div key={l} className="text-center">
                <p className={`text-4xl font-extrabold sm:text-5xl ${i % 2 ? "text-violet-brand" : "text-cyan-brand"}`}><Count to={n} suffix={s} /></p>
                <p className="mt-1 text-[15px] text-muted">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
