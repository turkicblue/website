import type { MetadataRoute } from "next";
import { PROJECTS } from "@/content/projects";
import { locales } from "@/i18n/locales";
import { absoluteUrl, alternates } from "@/lib/site";

const PATHS = ["", "/about", "/projects", ...PROJECTS.map((p) => `/projects/${p.slug}`), "/governance", "/get-involved", "/legal"];

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.flatMap((locale) =>
    PATHS.map((path) => ({
      url: absoluteUrl(locale, path),
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.6,
      alternates: { languages: alternates(locale, path)?.languages as Record<string, string> },
    })),
  );
}
