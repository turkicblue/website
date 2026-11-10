import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { EmailLink } from "@/components/sections";
import { wrap } from "@/components/ui";
import { routing } from "@/i18n/routing";
import { pageMetadata } from "@/lib/site";
import { pageGraph } from "@/lib/structured-data";

export async function generateMetadata({ params }: PageProps<"/[locale]/legal">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "Legal" });
  return pageMetadata(locale, "/legal", { title: t("title"), description: t("lede") });
}

export default async function LegalPage({ params }: PageProps<"/[locale]/legal">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations("Legal");
  const nav = await getTranslations("Nav");
  const section = (title: string, paragraphs: string[], extra?: ReactNode) => (
    <section className="border-t border-line py-10 first:border-t-0">
      <h2 className="font-display text-[28px] font-normal">{title}</h2>
      <div className="mt-4 space-y-3">
        {paragraphs.map((p) => (
          <p key={p} className={`max-w-[66ch] ${p.startsWith("[") ? "text-turquoise-ink" : "text-gray"}`}>{p}</p>
        ))}
        {extra}
      </div>
    </section>
  );
  return (
    <>
      <JsonLd
        data={pageGraph({
          locale,
          path: "/legal",
          name: t("title"),
          description: t("lede"),
          crumbs: [{ name: nav("home"), path: "" }, { name: t("title"), path: "/legal" }],
        })}
      />
      <PageHero title={t("title")} lede={t("lede")} />
      <div className={`${wrap} py-12`}>
        {section(t("privacyTitle"), t.raw("privacy") as string[])}
        {section(
          t("noticeTitle"),
          t.raw("notice") as string[],
          <p className="max-w-[66ch] text-gray">
            {t("contactLabel")}: <EmailLink className="text-turquoise-ink" />
          </p>,
        )}
      </div>
    </>
  );
}
