import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageHero } from "@/components/page-hero";
import { FactsList, NameTable, WorkList } from "@/components/sections";
import { sectionLede, sectionTitle, wrap } from "@/components/ui";
import { alternates } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[locale]/about">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations("About");
  return { title: t("title"), description: t("lede"), alternates: alternates(locale, "/about") };
}

export default async function AboutPage() {
  const t = await getTranslations("About");
  const work = await getTranslations("Work");
  const name = await getTranslations("Name");
  const intro = t.raw("intro") as string[];
  return (
    <>
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
          <div data-reveal>
            <h2 className={sectionTitle}>{t("contactTitle")}</h2>
            <p className={sectionLede}>{t("contactText")}</p>
          </div>
        </div>
      </section>
    </>
  );
}
