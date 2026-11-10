import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { EmailLink, FactsList, FaqList, NameTable, WorkList } from "@/components/sections";
import { sectionLede, sectionTitle, wrap } from "@/components/ui";
import { routing } from "@/i18n/routing";
import { pageMetadata } from "@/lib/site";
import { pageGraph } from "@/lib/structured-data";

export async function generateMetadata({ params }: PageProps<"/[locale]/about">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "About" });
  return pageMetadata(locale, "/about", { title: t("title"), description: t("lede") });
}

export default async function AboutPage({ params }: PageProps<"/[locale]/about">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations("About");
  const nav = await getTranslations("Nav");
  const work = await getTranslations("Work");
  const name = await getTranslations("Name");
  const intro = t.raw("intro") as string[];
  const faq = t.raw("faq") as { q: string; a: string }[];
  return (
    <>
      <JsonLd
        data={pageGraph({
          locale,
          path: "/about",
          type: "AboutPage",
          name: t("title"),
          description: t("lede"),
          crumbs: [{ name: nav("home"), path: "" }, { name: t("title"), path: "/about" }],
          faq,
        })}
      />
      <PageHero title={t("title")} lede={t("lede")} />
      <section className="py-[clamp(72px,8vw,112px)]">
        <div className={`${wrap} grid grid-cols-1 items-start gap-[clamp(40px,6vw,96px)] lg:grid-cols-[1.2fr_1fr]`}>
          <div className="space-y-3.5">
            {intro.map((p) => (
              <p key={p} className="max-w-[62ch] text-lg text-gray" data-reveal>{p}</p>
            ))}
          </div>
          <FactsList />
        </div>
      </section>
      <section className="bg-paper py-[clamp(72px,8vw,112px)]" aria-labelledby="work-title">
        <div className={wrap}>
          <h2 id="work-title" className={sectionTitle} data-reveal>{work("title")}</h2>
          <WorkList />
        </div>
      </section>
      <section id="name" className="py-[clamp(72px,8vw,112px)]" aria-labelledby="name-title">
        <div className={`${wrap} grid grid-cols-1 items-start gap-[clamp(40px,6vw,96px)] lg:grid-cols-[1fr_1.2fr]`}>
          <div>
            <h2 id="name-title" className={sectionTitle} data-reveal>{name("title")}</h2>
            <p className={sectionLede} data-reveal>{name("lede")}</p>
            <p className="mt-3.5 max-w-[54ch] text-gray" data-reveal>{name("text")}</p>
          </div>
          <NameTable />
        </div>
      </section>
      <section className="bg-paper py-[clamp(72px,8vw,112px)]">
        <div className={`${wrap} grid grid-cols-1 gap-12 md:grid-cols-2`}>
          <div data-reveal>
            <h2 className={sectionTitle}>{t("peopleTitle")}</h2>
            <p className={sectionLede}>{t("peopleText")}</p>
          </div>
          <div id="contact" className="scroll-mt-24" data-reveal>
            <h2 className={sectionTitle}>{t("contactTitle")}</h2>
            <p className={sectionLede}>{t("contactText")}</p>
            <p className="mt-4 font-display text-[clamp(22px,2.2vw,28px)]">
              <EmailLink className="text-turquoise-ink" />
            </p>
          </div>
        </div>
      </section>
      <section className="py-[clamp(72px,8vw,112px)]" aria-labelledby="faq-title">
        <div className={`${wrap} grid grid-cols-1 gap-[clamp(32px,5vw,80px)] lg:grid-cols-[1fr_2fr]`}>
          <h2 id="faq-title" className={sectionTitle} data-reveal>{t("faqTitle")}</h2>
          <FaqList items={faq} />
        </div>
      </section>
    </>
  );
}
