"use client";

import { useLocale } from "next-intl";
import { localeInfo, locales } from "@/i18n/locales";
import { Link, usePathname } from "@/i18n/navigation";

/** The current page in each language. */
export function LanguageSwitcher({ label }: { label: string }) {
  const pathname = usePathname();
  const current = useLocale();
  return (
    <nav aria-label={label} className="flex flex-wrap gap-x-4 gap-y-1.5">
      {locales.map((locale) => (
        <Link
          key={locale}
          href={pathname}
          locale={locale}
          lang={locale}
          dir={localeInfo[locale].dir}
          aria-current={locale === current ? "page" : undefined}
          className="text-mist no-underline hover:text-star aria-[current=page]:text-star aria-[current=page]:underline"
        >
          {localeInfo[locale].nativeName}
        </Link>
      ))}
    </nav>
  );
}
