import type { ReactNode } from "react";
import { wrap } from "./ui";

/** The night-sky band that opens every inner page: an optional label, the title and a short lede. */
export function PageHero({ label, title, lede, children }: { label?: ReactNode; title: string; lede?: string; children?: ReactNode }) {
  return (
    <section data-dark-hero className="night-sky text-star">
      <div className={`${wrap} pb-16 pt-36 md:pb-20 md:pt-44`}>
        {label && <div className="mb-4 text-sm text-turquoise">{label}</div>}
        <h1 className="max-w-[20ch] font-display text-[clamp(38px,5vw,68px)] font-light leading-[1.05] tracking-[-0.015em]">{title}</h1>
        {lede && <p className="mt-5 max-w-[60ch] text-lg text-mist">{lede}</p>}
        {children}
      </div>
    </section>
  );
}
