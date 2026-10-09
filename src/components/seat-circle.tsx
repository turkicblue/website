"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

const SEATS = 40;
const seats = Array.from({ length: SEATS }, (_, i) => {
  const a = (i / SEATS) * Math.PI * 2 - Math.PI / 2;
  const ring = i % 2 ? 208 : 182;
  return { x: Math.round(Math.cos(a) * ring * 100) / 100, y: Math.round(Math.sin(a) * ring * 100) / 100, r: i % 2 ? 7 : 9 };
});

/** Members seated in a circle around a shared centre, like a kurultay. The seats fill as the reader scrolls. */
export function SeatCircle({ label }: { label: string }) {
  const svg = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = svg.current;
    if (!el) return;
    const dots = [...el.querySelectorAll<SVGCircleElement>("[data-seat]")];
    const rays = [...el.querySelectorAll<SVGLineElement>("[data-ray]")];
    const fill = (p: number) => {
      const n = Math.round(p * SEATS);
      dots.forEach((d, i) => d.setAttribute("fill", i < n ? "var(--turquoise)" : "#cbd5da"));
      rays.forEach((r, i) => r.setAttribute("opacity", i < n ? "0.28" : "0"));
    };
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      fill(1);
      return;
    }
    const trigger = ScrollTrigger.create({ trigger: el, start: "top 85%", end: "bottom 45%", scrub: true, onUpdate: (self) => fill(self.progress) });
    return () => trigger.kill();
  }, []);

  return (
    <svg ref={svg} viewBox="-250 -250 500 500" role="img" aria-label={label} className="mx-auto block aspect-square w-full max-w-[460px]">
      {seats.map((s, i) => (
        <line key={`r${i}`} data-ray x1={s.x} y1={s.y} x2={0} y2={0} stroke="var(--turquoise-ink)" strokeWidth={1} opacity={0} />
      ))}
      {seats.map((s, i) => (
        <circle key={`s${i}`} data-seat cx={s.x} cy={s.y} r={s.r} fill="#cbd5da" />
      ))}
      <circle r={34} fill="#fff" stroke="var(--turquoise-ink)" strokeWidth={1.5} />
      <circle r={9} fill="var(--turquoise)" />
    </svg>
  );
}
