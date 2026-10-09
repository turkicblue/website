import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageHero } from "@/components/page-hero";
import { wrap } from "@/components/ui";
import { alternates } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[locale]/legal">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations("Legal");
  return { title: t("title"), alternates: alternates(locale, "/legal") };
}

export default async function LegalPage() {
  const t = await getTranslations("Legal");
  const section = (title: string, paragraphs: string[]) => (
    <section className="border-t border-line py-10 first:border-t-0">
      <h2 className="font-display text-[28px] font-normal">{title}</h2>
      <div className="mt-4 space-y-3">
        {paragraphs.map((p) => (
          <p key={p} className={`max-w-[66ch] ${p.startsWith("[") ? "text-turquoise-ink" : "text-gray"}`}>{p}</p>
        ))}
      </div>
    </section>
  );
  return (
    <>
      <PageHero title={t("title")} lede={t("lede")} />
      <div className={`${wrap} py-12`}>
        {section(t("privacyTitle"), t.raw("privacy") as string[])}
        {section(t("noticeTitle"), t.raw("notice") as string[])}
      </div>
    </>
  );
}
