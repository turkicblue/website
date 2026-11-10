import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { PageHero } from "@/components/page-hero";
import { ProjectIcon } from "@/components/project-icon";
import { StatusBadge } from "@/components/sections";
import { btnDark, sectionTitle, wrap } from "@/components/ui";
import { PROJECTS, projectBySlug } from "@/content/projects";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { pageMetadata } from "@/lib/site";
import { ORGANIZATION_ID, pageGraph } from "@/lib/structured-data";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => PROJECTS.map((p) => ({ locale, slug: p.slug })));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/[locale]/projects/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = projectBySlug(slug);
  if (!project || !hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: `Projects.items.${project.slug}` });
  return pageMetadata(locale, `/projects/${project.slug}`, { title: t("name"), description: t("summary") });
}

export default async function ProjectPage({ params }: PageProps<"/[locale]/projects/[slug]">) {
  const { locale, slug } = await params;
  const project = projectBySlug(slug);
  if (!project || !hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations("Projects");
  const nav = await getTranslations("Nav");
  const base = `items.${project.slug}`;
  const name = t(`${base}.name`);
  const summary = t(`${base}.summary`);
  const body = t.raw(`${base}.body`) as string[];
  const points = t.raw(`${base}.points`) as string[];
  // The status row comes from the project list, so it can't disagree with the badge.
  const facts = [{ label: t("statusLabel"), value: t(`status.${project.status}`) }, ...(t.raw(`${base}.facts`) as { label: string; value: string }[])];
  const others = PROJECTS.filter((p) => p.slug !== project.slug);
  const { href, external } = project.action;
  const path = `/projects/${project.slug}`;

  return (
    <>
      <JsonLd
        data={pageGraph({
          locale,
          path,
          name,
          description: summary,
          crumbs: [
            { name: nav("home"), path: "" },
            { name: nav("projects"), path: "/projects" },
            { name, path },
          ],
          about: project.website
            ? { "@type": "WebSite", name, url: project.website, description: summary, publisher: { "@id": ORGANIZATION_ID } }
            : undefined,
        })}
      />
      <PageHero
        title={name}
        lede={summary}
        label={
          <span className="flex items-center gap-3">
            <ProjectIcon slug={project.slug} className="size-8 text-turquoise" />
            <Link href="/projects" className="text-turquoise no-underline hover:underline">{t("title")}</Link>
          </span>
        }
      >
        <div className="mt-6"><StatusBadge status={project.status} /></div>
      </PageHero>

      <section className="py-[clamp(64px,8vw,104px)]">
        <div className={`${wrap} grid grid-cols-1 items-start gap-[clamp(40px,6vw,96px)] lg:grid-cols-[1.4fr_1fr]`}>
          <div>
            <div className="space-y-4">
              {body.map((p) => (
                <p key={p} className="max-w-[64ch] text-lg text-gray" data-reveal>{p}</p>
              ))}
            </div>
            <h2 className="mt-12 font-display text-[26px] font-normal" data-reveal>{t("whatItDoes")}</h2>
            <ul className="mt-4 grid gap-2.5 pl-0" data-reveal>
              {points.map((point) => (
                <li key={point} className="flex gap-3 text-gray">
                  <span className="mt-[11px] size-1.5 flex-none rounded-full bg-turquoise" />
                  {point}
                </li>
              ))}
            </ul>
            <h2 className="mt-12 font-display text-[26px] font-normal" data-reveal>{t("takePart")}</h2>
            <p className="mt-3 max-w-[60ch] text-gray" data-reveal>{t(`${base}.takePart`)}</p>
            <div className="mt-6" data-reveal>
              {external ? (
                <a className={btnDark} href={href}>{t(`${base}.action`)}</a>
              ) : (
                <Link className={btnDark} href={href}>{t(`${base}.action`)}</Link>
              )}
            </div>
          </div>
          <aside aria-labelledby="details-title" className="rounded-md border border-line bg-paper p-6" data-reveal>
            <h2 id="details-title" className="mb-2 text-[13px] font-semibold text-gray">{t("details")}</h2>
            <dl className="m-0">
              {facts.map((f) => (
                <div key={f.label} className="border-b border-line py-3 last:border-b-0">
                  <dt className="text-[13px] text-gray">{f.label}</dt>
                  <dd className={`mt-0.5 font-medium ${f.value.startsWith("[") ? "text-turquoise-ink" : ""}`}>{f.value}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </section>

      <section className="bg-paper py-[clamp(56px,7vw,88px)]" aria-labelledby="others-title">
        <div className={wrap}>
          <h2 id="others-title" className={sectionTitle}>{t("otherProjects")}</h2>
          <div className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-5">
            {others.map((p) => (
              <Link key={p.slug} href={`/projects/${p.slug}`} data-reveal className="flex flex-col gap-3 rounded-md border border-line bg-white p-6 text-ink no-underline transition-colors hover:border-turquoise-ink/50">
                <ProjectIcon slug={p.slug} className="size-8 text-turquoise-ink" />
                <b className="font-display text-[22px] font-medium">{t(`items.${p.slug}.name`)}</b>
                <span className="text-gray">{t(`items.${p.slug}.summary`)}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
