import type { MetadataRoute } from "next";
import { translatedLocales } from "@/i18n/locales";
import { PAGE_PATHS, absoluteUrl, alternates } from "@/lib/site";

export const dynamic = "force-static";

// Translated languages only: the others show English text and point their canonical link at it.
export default function sitemap(): MetadataRoute.Sitemap {
  return translatedLocales.flatMap((locale) =>
    PAGE_PATHS.map((path) => ({
      url: absoluteUrl(locale, path),
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : path.startsWith("/projects") ? 0.8 : path === "/legal" ? 0.3 : 0.6,
      alternates: { languages: alternates(locale, path)?.languages as Record<string, string> },
    })),
  );
}
