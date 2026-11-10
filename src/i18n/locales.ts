// The site's languages: the same seven as Turkipedia. Strings missing in a language fall back to
// English (src/i18n/request.ts).
export const locales = ["en", "tr", "az", "kk", "uz", "ug", "fr"] as const;

export type AppLocale = (typeof locales)[number];

/**
 * `translated`: the language's messages file is complete. Until it is, its pages show English, so
 * they are marked as English, point their canonical link at the English page and stay out of the
 * sitemap and hreflang links. Set it to true when a translation is finished.
 * `ogLocale`: the Open Graph form of the language (language_TERRITORY where there is one).
 */
export const localeInfo: Record<AppLocale, { nativeName: string; englishName: string; dir: "ltr" | "rtl"; translated: boolean; ogLocale: string }> = {
  en: { nativeName: "English", englishName: "English", dir: "ltr", translated: true, ogLocale: "en_GB" },
  tr: { nativeName: "Türkçe", englishName: "Turkish", dir: "ltr", translated: true, ogLocale: "tr_TR" },
  az: { nativeName: "Azərbaycanca", englishName: "Azerbaijani", dir: "ltr", translated: false, ogLocale: "az_AZ" },
  kk: { nativeName: "Қазақша", englishName: "Kazakh", dir: "ltr", translated: false, ogLocale: "kk_KZ" },
  uz: { nativeName: "Oʻzbekcha", englishName: "Uzbek", dir: "ltr", translated: false, ogLocale: "uz_UZ" },
  ug: { nativeName: "ئۇيغۇرچە", englishName: "Uyghur", dir: "rtl", translated: false, ogLocale: "ug" },
  fr: { nativeName: "Français", englishName: "French", dir: "ltr", translated: false, ogLocale: "fr_FR" },
};

/** Languages whose pages are complete translations: the ones search engines are told about. */
export const translatedLocales = locales.filter((locale) => localeInfo[locale].translated);

/** The language a page's text is actually in: its own once translated, English until then. */
export const contentLocale = (locale: AppLocale): AppLocale => (localeInfo[locale].translated ? locale : "en");
