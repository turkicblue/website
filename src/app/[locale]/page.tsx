import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { SeatCircle } from "@/components/seat-circle";
import { JsonLd } from "@/components/json-ld";
import { FactsList, GovernanceSteps, NameTable, Newsletter, ProjectList, WaysGrid, WorkList } from "@/components/sections";
import { Sky, type SkyStage } from "@/components/sky";
import { btnLight, btnOutlineLight, sectionLede, sectionTitle, wrap } from "@/components/ui";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { pageMetadata } from "@/lib/site";
import { pageGraph } from "@/lib/structured-data";

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "Meta" });
  return { title: { absolute: t("homeTitle") }, ...(await pageMetadata(locale, "", { description: t("description") })) };
}

const more = "mt-6 inline-block font-medium text-turquoise-ink";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const sky = await getTranslations("Sky");
  const t = await getTranslations("Home");
  const name = await getTranslations("Name");
  const gov = await getTranslations("Governance");
  const meta = await getTranslations("Meta");

  return (
    <>
      <JsonLd data={pageGraph({ locale, path: "", name: meta("homeTitle"), description: meta("description") })} />
      <Sky
        label={sky("label")}
        stages={sky.raw("stages") as SkyStage[]}
        intro={
          <>
            <h1 className="max-w-[15ch] font-display text-[clamp(38px,5.6vw,84px)] font-light leading-[1.05] tracking-[-0.015em]">{sky("title")}</h1>
            <div>
              <p className="max-w-[46ch] text-[clamp(16px,1.3vw,18px)] text-mist">{sky("text")}</p>
              <div className="mt-[22px] flex flex-wrap gap-3">
                <Link className={btnLight} href="/projects">{sky("primary")}</Link>
                <Link className={btnOutlineLight} href="/get-involved">{sky("secondary")}</Link>
              </div>
              <p className="mt-[22px] flex items-center gap-2.5 text-[13px] text-mist">
                <i className="scroll-drip inline-block h-[30px] w-px bg-gradient-to-b from-mist to-transparent" />
                {sky("scroll")}
              </p>
            </div>
          </>
        }
      />

      <section className="py-[clamp(80px,9vw,128px)]" aria-labelledby="about-title">
        <div className={wrap}>
          <div className="grid grid-cols-1 items-start gap-[clamp(40px,6vw,96px)] lg:grid-cols-[1.2fr_1fr]">
            <div>
              <h2 id="about-title" className={sectionTitle} data-reveal>{t("aboutTitle")}</h2>
              <p className={sectionLede} data-reveal>{t("aboutLede")}</p>
              <p className="mt-3.5 max-w-[60ch] text-gray" data-reveal>{t("aboutText")}</p>
              <Link href="/about" className={more}>{t("aboutMore")}</Link>
            </div>
            <FactsList />
          </div>
          <WorkList />
        </div>
      </section>

      <section className="bg-paper py-[clamp(80px,9vw,128px)]" aria-labelledby="projects-title">
        <div className={wrap}>
          <h2 id="projects-title" className={sectionTitle} data-reveal>{t("projectsTitle")}</h2>
          <p className={`${sectionLede} mb-10`} data-reveal>{t("projectsLede")}</p>
          <ProjectList />
        </div>
      </section>

      <section className="py-[clamp(80px,9vw,128px)]" aria-labelledby="name-title">
        <div className={`${wrap} grid grid-cols-1 items-start gap-[clamp(40px,6vw,96px)] lg:grid-cols-[1fr_1.2fr]`}>
          <div>
            <h2 id="name-title" className={sectionTitle} data-reveal>{name("title")}</h2>
            <p className={sectionLede} data-reveal>{name("lede")}</p>
            <p className="mt-3.5 max-w-[54ch] text-gray" data-reveal>{name("text")}</p>
          </div>
          <NameTable />
        </div>
      </section>

      <section className="bg-paper py-[clamp(80px,9vw,128px)]" aria-labelledby="gov-title">
        <div className={`${wrap} grid grid-cols-1 items-center gap-[clamp(40px,6vw,96px)] lg:grid-cols-[1.1fr_1fr]`}>
          <div>
            <h2 id="gov-title" className={sectionTitle} data-reveal>{t("governanceTitle")}</h2>
            <p className={sectionLede} data-reveal>{t("governanceLede")}</p>
            <GovernanceSteps />
            <Link href="/governance" className={more}>{t("governanceMore")}</Link>
          </div>
          <SeatCircle label={gov("circleLabel")} />
        </div>
      </section>

      <section className="py-[clamp(80px,9vw,128px)]" aria-labelledby="involved-title">
        <div className={wrap}>
          <h2 id="involved-title" className={sectionTitle} data-reveal>{t("involvedTitle")}</h2>
          <p className={sectionLede} data-reveal>{t("involvedLede")}</p>
          <WaysGrid />
          <Newsletter />
        </div>
      </section>
    </>
  );
}
