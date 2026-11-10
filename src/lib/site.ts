import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PROJECTS } from "@/content/projects";
import { type AppLocale, contentLocale, localeInfo, translatedLocales } from "@/i18n/locales";

/**
 * The public address, including any base path, for canonical links, the sitemap, structured data
 * and social previews. The GitHub Pages workflow sets it to the Pages URL.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
/** The subpath the site is served from ("" on its own domain). Matches basePath in next.config.ts. */
export const BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");
export const SITE_NAME = "Turkic Blue Foundation";
export const CONTACT_EMAIL = "esenlikler@turkicblue.org";
export const FOUNDING_YEAR = "2025";
export const CONTENT_LICENSE_URL = "https://creativecommons.org/licenses/by-sa/4.0/";

export const mailto = (subject?: string) => `mailto:${CONTACT_EMAIL}${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`;

/** Every page, as a path after the language prefix: for the sitemap and llms.txt. */
export const PAGE_PATHS = ["", "/about", "/projects", ...PROJECTS.map((p) => `/projects/${p.slug}`), "/governance", "/get-involved", "/legal"];

/** "/about" in a language -> "https://turkicblue.org/en/about/" (pages end in a slash: trailingSlash). */
export const absoluteUrl = (locale: string, path = "") => `${SITE_URL}/${locale}${path}/`;

/** A page's share image: "/projects/dao" -> /og/en/projects-dao.png ("" is "home"). */
export const ogImageFile = (path: string) => `${path.slice(1).replaceAll("/", "-") || "home"}.png`;
export const ogImageUrl = (locale: string, path: string) => `${SITE_URL}/og/${locale}/${ogImageFile(path)}`;

/**
 * Canonical and hreflang links. hreflang lists the translated languages only, with English as the
 * default. A page in a language that isn't translated yet shows the English text, so its canonical
 * link is the English page.
 */
export function alternates(locale: AppLocale, path = ""): Metadata["alternates"] {
  const canonical = absoluteUrl(contentLocale(locale), path);
  if (!localeInfo[locale].translated) return { canonical };
  return {
    canonical,
    languages: {
      ...Object.fromEntries(translatedLocales.map((code) => [code, absoluteUrl(code, path)])),
      "x-default": absoluteUrl("en", path),
    },
  };
}

/** Title, description, canonical and hreflang links and Open Graph tags for a page. */
export async function pageMetadata(locale: AppLocale, path: string, page: { title?: string; description: string }): Promise<Metadata> {
  const meta = await getTranslations({ locale, namespace: "Meta" });
  const lang = contentLocale(locale);
  return {
    ...(page.title ? { title: page.title } : {}),
    description: page.description,
    alternates: alternates(locale, path),
    robots: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    openGraph: {
      type: "website",
      siteName: meta("title"),
      locale: localeInfo[lang].ogLocale,
      alternateLocale: translatedLocales.filter((code) => code !== lang).map((code) => localeInfo[code].ogLocale),
      url: absoluteUrl(lang, path),
      title: page.title ?? meta("homeTitle"),
      description: page.description,
      images: [{ url: ogImageUrl(lang, path), width: 1200, height: 630, type: "image/png", alt: page.title ?? meta("title") }],
    },
  };
}

/** Removes "[to be decided]"-style placeholders, for text read by machines (JSON-LD, llms.txt). */
export const withoutPlaceholders = (text: string) => text.replace(/\s*\[[^\]]*\]\.?/g, "").trim();
