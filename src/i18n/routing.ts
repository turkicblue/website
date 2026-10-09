import { defineRouting } from "next-intl/routing";
import { locales } from "./locales";

export const routing = defineRouting({
  locales,
  // Fallback when the browser's languages match none of ours.
  defaultLocale: "en",
  // Pages set hreflang links in their metadata (src/lib/site.ts).
  alternateLinks: false,
});
