import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageHero } from "@/components/page-hero";
import { SeatCircle } from "@/components/seat-circle";
import { GovernanceSteps, Principles } from "@/components/sections";
import { sectionTitle, wrap } from "@/components/ui";
import { alternates } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[locale]/governance">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations("Governance");
  return { title: t("title"), description: t("lede"), alternates: alternates(locale, "/governance") };
}

export default async function GovernancePage() {
  const t = await getTranslations("Governance");
  const faq = t.raw("faq") as { q: string; a: string }[];
  return (
    <>
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
          <div>
            {faq.map((item) => (
              <details key={item.q} className="group border-t border-line py-5 last:border-b" data-reveal>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium marker:hidden">
                  {item.q}
                  <span aria-hidden="true" className="text-2xl font-light text-turquoise-ink transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className={`mt-3 max-w-[64ch] ${item.a.startsWith("[") ? "text-turquoise-ink" : "text-gray"}`}>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
