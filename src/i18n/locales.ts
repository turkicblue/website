// The site's languages: the same seven as Turkipedia. Strings missing in a language fall back to
// English (src/i18n/request.ts).
export const locales = ["en", "tr", "az", "kk", "uz", "ug", "fr"] as const;

export type AppLocale = (typeof locales)[number];

export const localeInfo: Record<AppLocale, { nativeName: string; dir: "ltr" | "rtl" }> = {
  en: { nativeName: "English", dir: "ltr" },
  tr: { nativeName: "Türkçe", dir: "ltr" },
  az: { nativeName: "Azərbaycanca", dir: "ltr" },
  kk: { nativeName: "Қазақша", dir: "ltr" },
  uz: { nativeName: "Oʻzbekcha", dir: "ltr" },
  ug: { nativeName: "ئۇيغۇرچە", dir: "rtl" },
  fr: { nativeName: "Français", dir: "ltr" },
};
