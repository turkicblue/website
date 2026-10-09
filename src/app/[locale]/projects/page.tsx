import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageHero } from "@/components/page-hero";
import { ProjectList } from "@/components/sections";
import { wrap } from "@/components/ui";
import { alternates } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[locale]/projects">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations("Projects");
  return { title: t("title"), description: t("lede"), alternates: alternates(locale, "/projects") };
}

export default async function ProjectsPage() {
  const t = await getTranslations("Projects");
  return (
    <>
      <PageHero title={t("title")} lede={t("lede")} />
      <section className="py-[clamp(56px,7vw,96px)]">
        <div className={wrap}>
          <ProjectList />
        </div>
      </section>
    </>
  );
}
