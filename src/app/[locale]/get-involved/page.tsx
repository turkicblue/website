import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageHero } from "@/components/page-hero";
import { Newsletter, WaysGrid } from "@/components/sections";
import { sectionLede, sectionTitle, wrap } from "@/components/ui";
import { alternates } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[locale]/get-involved">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations("Involved");
  return { title: t("title"), description: t("lede"), alternates: alternates(locale, "/get-involved") };
}

export default async function GetInvolvedPage() {
  const t = await getTranslations("Involved");
  return (
    <>
      <PageHero title={t("title")} lede={t("lede")} />
      <section className="py-[clamp(56px,7vw,96px)]">
        <div className={wrap}>
          <WaysGrid />
          <div id="contact" className="mt-20 grid scroll-mt-24 grid-cols-1 gap-6 border-t border-line pt-14 md:grid-cols-2" data-reveal>
            <div>
              <h2 className={sectionTitle}>{t("contactTitle")}</h2>
              <p className={sectionLede}>{t("contactText")}</p>
            </div>
            <p className="self-end font-display text-[clamp(24px,2.6vw,34px)] text-turquoise-ink">{t("email")}</p>
          </div>
          <Newsletter />
        </div>
      </section>
    </>
  );
}
