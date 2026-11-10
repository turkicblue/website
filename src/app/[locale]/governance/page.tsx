import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { SeatCircle } from "@/components/seat-circle";
import { FaqList, GovernanceSteps, Principles } from "@/components/sections";
import { sectionTitle, wrap } from "@/components/ui";
import { routing } from "@/i18n/routing";
import { pageMetadata } from "@/lib/site";
import { pageGraph } from "@/lib/structured-data";

export async function generateMetadata({ params }: PageProps<"/[locale]/governance">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "Governance" });
  return pageMetadata(locale, "/governance", { title: t("title"), description: t("lede") });
}

export default async function GovernancePage({ params }: PageProps<"/[locale]/governance">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations("Governance");
  const nav = await getTranslations("Nav");
  const faq = t.raw("faq") as { q: string; a: string }[];
  return (
    <>
      <JsonLd
        data={pageGraph({
          locale,
          path: "/governance",
          name: t("title"),
          description: t("lede"),
          crumbs: [{ name: nav("home"), path: "" }, { name: t("title"), path: "/governance" }],
          faq,
        })}
      />
      <PageHero title={t("title")} lede={t("lede")} />
      <section className="py-[clamp(64px,8vw,104px)]">
        <div className={`${wrap} grid grid-cols-1 items-center gap-[clamp(40px,6vw,96px)] lg:grid-cols-[1.1fr_1fr]`}>
          <div>
            <p className="max-w-[60ch] text-lg text-gray" data-reveal>{t("text")}</p>
            <h2 className="mt-12 font-display text-[26px] font-normal" data-reveal>{t("stepsTitle")}</h2>
            <GovernanceSteps />
          </div>
          <SeatCircle label={t("circleLabel")} />
        </div>
      </section>
      <section className="bg-paper py-[clamp(64px,8vw,104px)]" aria-labelledby="principles-title">
        <div className={wrap}>
          <h2 id="principles-title" className={sectionTitle} data-reveal>{t("principlesTitle")}</h2>
          <Principles />
        </div>
      </section>
      <section className="py-[clamp(64px,8vw,104px)]" aria-labelledby="faq-title">
        <div className={`${wrap} grid grid-cols-1 gap-[clamp(32px,5vw,80px)] lg:grid-cols-[1fr_2fr]`}>
          <h2 id="faq-title" className={sectionTitle} data-reveal>{t("faqTitle")}</h2>
          <FaqList items={faq} />
        </div>
      </section>
    </>
  );
}
