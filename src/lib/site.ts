import type { Metadata } from "next";
import { locales } from "@/i18n/locales";

/** The public address, for canonical links, the sitemap and social previews. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
export const SITE_NAME = "Turkic Blue Foundation";

export const absoluteUrl = (locale: string, path = "") => `${SITE_URL}/${locale}${path}`;

/** Canonical and hreflang links for a page that exists in every language. */
export function alternates(locale: string, path = ""): Metadata["alternates"] {
  return {
    canonical: absoluteUrl(locale, path),
    languages: {
      ...Object.fromEntries(locales.map((code) => [code, absoluteUrl(code, path)])),
      "x-default": `${SITE_URL}${path || "/"}`,
    },
  };
}
