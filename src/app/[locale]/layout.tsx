import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Sans_Arabic, Jost, Noto_Naskh_Arabic, Noto_Sans_Old_Turkic } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Motion } from "@/components/motion";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { localeInfo } from "@/i18n/locales";
import { routing } from "@/i18n/routing";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "../globals.css";

// Display: Jost, light and geometric. Text: IBM Plex Sans (the face Turkipedia uses), with its
// Arabic-script companion for Uyghur. Old Turkic runes for the sky.
const jost = Jost({ subsets: ["latin", "latin-ext", "cyrillic"], weight: ["300", "400", "500"], variable: "--font-jost" });
const plex = IBM_Plex_Sans({ subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"], weight: ["400", "500", "600"], variable: "--font-plex" });
const plexArabic = IBM_Plex_Sans_Arabic({ subsets: ["arabic"], weight: ["400", "500", "600"], variable: "--font-plex-arabic" });
const naskh = Noto_Naskh_Arabic({ subsets: ["arabic"], weight: ["500"], variable: "--font-naskh" });
const oldTurkic = Noto_Sans_Old_Turkic({ subsets: ["old-turkic"], weight: "400", variable: "--font-old-turkic" });

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations("Meta");
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t("title"), template: `%s – ${t("title")}` },
    description: t("description"),
    applicationName: SITE_NAME,
    openGraph: { siteName: t("title"), type: "website", locale, title: t("title"), description: t("description") },
    twitter: { card: "summary" },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations("Nav");

  return (
    <html
      lang={locale}
      dir={localeInfo[locale].dir}
      className={`${jost.variable} ${plex.variable} ${plexArabic.variable} ${naskh.variable} ${oldTurkic.variable} antialiased`}
    >
      <body>
        <NextIntlClientProvider>
          <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-4 focus:py-2">
            {t("skip")}
          </a>
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
          <Motion />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
