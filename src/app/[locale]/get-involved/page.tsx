import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { EmailLink, Newsletter, WaysGrid } from "@/components/sections";
import { sectionLede, sectionTitle, wrap } from "@/components/ui";
import { routing } from "@/i18n/routing";
import { pageMetadata } from "@/lib/site";
import { pageGraph } from "@/lib/structured-data";

export async function generateMetadata({ params }: PageProps<"/[locale]/get-involved">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "Involved" });
  return pageMetadata(locale, "/get-involved", { title: t("title"), description: t("lede") });
}

export default async function GetInvolvedPage({ params }: PageProps<"/[locale]/get-involved">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations("Involved");
  const nav = await getTranslations("Nav");
  return (
    <>
      <JsonLd
        data={pageGraph({
          locale,
          path: "/get-involved",
          type: "ContactPage",
          name: t("title"),
          description: t("lede"),
          crumbs: [{ name: nav("home"), path: "" }, { name: t("title"), path: "/get-involved" }],
        })}
      />
      <PageHero title={t("title")} lede={t("lede")} />
      <section className="py-[clamp(56px,7vw,96px)]">
        <div className={wrap}>
          <WaysGrid />
          <div id="contact" className="mt-20 grid scroll-mt-24 grid-cols-1 gap-6 border-t border-line pt-14 md:grid-cols-2" data-reveal>
            <div>
              <h2 className={sectionTitle}>{t("contactTitle")}</h2>
              <p className={sectionLede}>{t("contactText")}</p>
            </div>
            <p className="self-end break-all font-display text-[clamp(24px,2.6vw,34px)]">
              <EmailLink className="text-turquoise-ink" />
            </p>
          </div>
          <Newsletter />
        </div>
      </section>
    </>
  );
}
