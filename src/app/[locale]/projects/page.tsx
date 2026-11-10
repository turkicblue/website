import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { ProjectList } from "@/components/sections";
import { wrap } from "@/components/ui";
import { routing } from "@/i18n/routing";
import { pageMetadata } from "@/lib/site";
import { pageGraph } from "@/lib/structured-data";

export async function generateMetadata({ params }: PageProps<"/[locale]/projects">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "Projects" });
  return pageMetadata(locale, "/projects", { title: t("title"), description: t("lede") });
}

export default async function ProjectsPage({ params }: PageProps<"/[locale]/projects">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations("Projects");
  const nav = await getTranslations("Nav");
  return (
    <>
      <JsonLd
        data={pageGraph({
          locale,
          path: "/projects",
          type: "CollectionPage",
          name: t("title"),
          description: t("lede"),
          crumbs: [{ name: nav("home"), path: "" }, { name: nav("projects"), path: "/projects" }],
        })}
      />
      <PageHero title={t("title")} lede={t("lede")} />
      <section className="py-[clamp(56px,7vw,96px)]">
        <div className={wrap}>
          <ProjectList />
        </div>
      </section>
    </>
  );
}
