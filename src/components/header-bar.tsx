"use client";

import { useEffect, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { LogoMark } from "./logo";
import { wrap } from "./ui";

type Item = { href: string; label: string };

/**
 * The top bar: transparent with light text over the night sky that opens every page
 * ([data-dark-hero]), white once that has scrolled away. On phones the links fold into a menu.
 */
export function HeaderBar({ items, labels }: { items: Item[]; labels: { main: string; menu: string; close: string; home: string; suffix: string } }) {
  const pathname = usePathname();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const update = () => {
      const hero = document.querySelector("[data-dark-hero]");
      setSolid(!hero || hero.getBoundingClientRect().bottom < 72);
    };
    update();
    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", update);
    return () => {
      removeEventListener("scroll", update);
      removeEventListener("resize", update);
    };
  }, [pathname]);

  const light = solid || open;
  const linkClass = (href: string) => {
    const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
    return `no-underline transition-colors ${light ? "text-gray hover:text-ink" : "text-mist hover:text-star"} ${active ? (light ? "!text-ink" : "!text-star") : ""}`;
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-30 pt-[env(safe-area-inset-top,0px)] transition-[background,box-shadow] duration-300 ${light ? "bg-white/95 shadow-[0_1px_0_var(--line)] backdrop-blur" : ""}`}
    >
      <div className={`${wrap} flex items-center justify-between gap-4 py-4`}>
        <Link href="/" aria-label={labels.home} className={`flex items-center gap-2.5 font-display text-[19px] font-medium no-underline ${light ? "text-ink" : "text-star"}`}>
          <LogoMark className="size-[26px]" />
          <span>
            Turkic Blue <span className="font-light opacity-80">{labels.suffix}</span>
          </span>
        </Link>
        <nav aria-label={labels.main} className="hidden gap-[26px] text-[15px] md:flex">
          {items.map((item) => (
            <Link key={item.href} href={item.href} className={linkClass(item.href)} aria-current={pathname === item.href ? "page" : undefined}>
              {item.label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          className={`min-h-11 rounded border px-3.5 text-sm md:hidden ${light ? "border-line text-ink" : "border-star/40 text-star"}`}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? labels.close : labels.menu}
        </button>
      </div>
      {open && (
        <nav id="mobile-menu" aria-label={labels.main} className={`${wrap} flex flex-col gap-1 border-t border-line bg-white pb-5 pt-3 md:hidden`}>
          {items.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="py-2 text-lg text-ink no-underline">
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
