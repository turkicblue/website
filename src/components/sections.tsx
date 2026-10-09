import { getTranslations } from "next-intl/server";
import { PROJECTS, type Project } from "@/content/projects";
import { LEXICON } from "@/content/lexicon";
import { Link } from "@/i18n/navigation";
import { NewsletterForm } from "./newsletter-form";
import { ProjectIcon } from "./project-icon";

type Item = { title: string; text: string };

/** Five short points: what the foundation does. */
export async function WorkList() {
  const t = await getTranslations("Work");
  const items = t.raw("items") as Item[];
  return (
    <ul aria-label={t("title")} className="mt-14 grid list-none grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-x-8 gap-y-7 p-0">
      {items.map((item) => (
        <li key={item.title} data-reveal className="border-t-2 border-turquoise pt-4">
          <b className="mb-1.5 block font-display text-[22px] font-medium">{item.title}</b>
          <span className="text-base text-gray">{item.text}</span>
        </li>
      ))}
    </ul>
  );
}

/** Founding facts. Values in [brackets] are still to be filled in. */
export async function FactsList() {
  const t = await getTranslations("Facts");
  const rows = [
    ["founded", "foundedValue"],
    ["registered", "registeredValue"],
    ["legalForm", "legalFormValue"],
    ["licence", "licenceValue"],
  ] as const;
  return (
    <dl aria-label={t("label")} className="m-0 grid grid-cols-2 border-t border-line" data-reveal>
      {rows.map(([label, value]) => (
        <div key={label} className="border-b border-line py-4 pr-4">
          <dt className="text-[13px] text-gray">{t(label)}</dt>
          <dd className={`mt-1 text-[17px] font-medium ${t(value).startsWith("[") ? "text-turquoise-ink" : ""}`}>{t(value)}</dd>
        </div>
      ))}
      <div className="col-span-2 border-b border-line py-4 pr-4">
        <dt className="text-[13px] text-gray">{t("languages")}</dt>
        <dd className="mt-1 text-[17px] font-medium">{t("languagesValue")}</dd>
      </div>
    </dl>
  );
}

/** The word kök across Turkic languages. */
export async function NameTable() {
  const t = await getTranslations("Name");
  return (
    <div className="overflow-x-auto" data-reveal>
      <table className="w-full border-collapse text-base">
        <caption className="sr-only">{t("caption")}</caption>
        <thead>
          <tr>
            <th scope="col" className="border-b border-line py-2.5 pr-3 text-left text-[13px] font-medium text-gray">{t("word")}</th>
            <th scope="col" className="border-b border-line py-2.5 pr-3 text-left text-[13px] font-medium text-gray">{t("language")}</th>
          </tr>
        </thead>
        <tbody>
          {LEXICON.map((row) => (
            <tr key={row.lang}>
              <td
                lang={row.lang}
                dir={row.lang === "ug" ? "rtl" : undefined}
                className={`border-b border-line py-2.5 pr-3 text-left text-[22px] ${row.lang === "otk" ? "font-rune text-turquoise-ink" : row.lang === "ug" ? "" : "font-display"}`}
              >
                {row.word}
              </td>
              <td className="border-b border-line py-2.5 pr-3 text-gray">{t(`languages.${row.lang}`)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export async function StatusBadge({ status }: { status: Project["status"] }) {
  const t = await getTranslations("Projects.status");
  const live = status === "live";
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border bg-white px-2.5 py-1 text-sm ${live ? "border-turquoise-ink/35 text-turquoise-ink" : "border-line text-gray"}`}>
      <span className={`size-[7px] rounded-full ${live ? "bg-turquoise" : "bg-[#9aa8af]"}`} />
      {t(status)}
    </span>
  );
}

/** A project in the list: name and status on the left, summary, points and key facts on the right. */
export async function ProjectRow({ project }: { project: Project }) {
  const t = await getTranslations("Projects");
  const base = `items.${project.slug}`;
  const points = t.raw(`${base}.points`) as string[];
  return (
    <article data-reveal className="grid grid-cols-1 gap-x-[clamp(32px,5vw,80px)] gap-y-6 border-t border-line py-10 last:border-b md:grid-cols-[0.9fr_1.4fr]">
      <div className="flex flex-col items-start gap-3">
        <ProjectIcon slug={project.slug} className="size-10 text-turquoise-ink" />
        <h3 className="font-display text-[clamp(26px,2.4vw,34px)] font-normal leading-tight">{t(`${base}.name`)}</h3>
        <StatusBadge status={project.status} />
      </div>
      <div>
        <p className="max-w-[62ch] text-gray">{t(`${base}.summary`)}</p>
        <ul className="mt-4 pl-5 text-gray">
          {points.map((point) => (
            <li key={point} className="mt-1 first:mt-0">{point}</li>
          ))}
        </ul>
        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 font-medium">
          <Link href={`/projects/${project.slug}`} className="text-turquoise-ink">{t("readMore")}</Link>
          {project.website && (
            <a href={project.website} className="text-turquoise-ink">{project.website.replace("https://", "")}</a>
          )}
        </div>
      </div>
    </article>
  );
}

export async function ProjectList() {
  return (
    <div>
      {PROJECTS.map((p) => (
        <ProjectRow key={p.slug} project={p} />
      ))}
    </div>
  );
}

/** Proposal, discussion, vote, implementation. A real sequence, so it's numbered. */
export async function GovernanceSteps() {
  const t = await getTranslations("Governance");
  const steps = t.raw("steps") as Item[];
  return (
    <ol className="mt-8 grid list-none grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-x-7 p-0">
      {steps.map((step, i) => (
        <li key={step.title} data-reveal className="border-t border-line py-4 text-[15px] text-gray">
          <span className="mb-2.5 grid size-[26px] place-items-center rounded-full bg-ink text-[13px] font-semibold text-white">{i + 1}</span>
          <b className="block text-base font-semibold text-ink">{step.title}</b>
          {step.text}
        </li>
      ))}
    </ol>
  );
}

export async function Principles() {
  const t = await getTranslations("Governance");
  const items = t.raw("principles") as Item[];
  return (
    <div className="mt-14 grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-6">
      {items.map((p) => (
        <div key={p.title} data-reveal className="rounded-md border border-line bg-white p-[22px]">
          <b className="mb-1.5 block font-semibold">{p.title}</b>
          <span className="text-[15px] text-gray">{p.text}</span>
        </div>
      ))}
    </div>
  );
}

const WAY_LINKS = ["https://turkipedia.org", "/get-involved#contact", "/get-involved#contact", "/get-involved#contact", "/get-involved#contact"];

export async function WaysGrid() {
  const t = await getTranslations("Involved");
  const ways = t.raw("ways") as (Item & { action: string })[];
  return (
    <div className="mt-10 grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-5">
      {ways.map((way, i) => (
        <div key={way.title} data-reveal className="flex flex-col gap-2.5 rounded-md border border-line bg-white p-[26px]">
          <b className="font-display text-[22px] font-medium">{way.title}</b>
          <span className="text-base text-gray">{way.text}</span>
          {WAY_LINKS[i].startsWith("http") ? (
            <a href={WAY_LINKS[i]} className="mt-auto font-medium text-turquoise-ink no-underline hover:underline">{way.action}</a>
          ) : (
            <Link href={WAY_LINKS[i]} className="mt-auto font-medium text-turquoise-ink no-underline hover:underline">{way.action}</Link>
          )}
        </div>
      ))}
    </div>
  );
}

export async function Newsletter() {
  const t = await getTranslations("Newsletter");
  return (
    <div data-reveal className="mt-16 grid grid-cols-1 items-end gap-x-16 gap-y-6 rounded-lg bg-ink p-9 text-white md:grid-cols-2">
      <div>
        <h3 className="font-display text-[28px] font-normal">{t("title")}</h3>
        <p className="mt-2 text-mist">{t("text")}</p>
      </div>
      <NewsletterForm label={t("label")} button={t("button")} notConnected={t("notConnected")} />
    </div>
  );
}
