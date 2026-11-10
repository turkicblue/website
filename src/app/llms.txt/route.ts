import english from "../../../messages/en.json";
import { PROJECTS } from "@/content/projects";
import { localeInfo, translatedLocales } from "@/i18n/locales";
import { CONTACT_EMAIL, CONTENT_LICENSE_URL, FOUNDING_YEAR, SITE_NAME, SITE_URL, absoluteUrl, withoutPlaceholders } from "@/lib/site";

// /llms.txt (https://llmstxt.org): the foundation in brief, for language models and answer engines.
// Built from the English text, so it says what the site says. Placeholders are left out.
export const dynamic = "force-static";

const m = english;
const clean = (text: string) => withoutPlaceholders(text);
const faq = (items: { q: string; a: string }[]) =>
  items
    .map((item) => ({ q: item.q, a: clean(item.a) }))
    .filter((item) => item.a)
    .map((item) => `### ${item.q}\n\n${item.a}`)
    .join("\n\n");

export function GET() {
  const projects = PROJECTS.map((p) => {
    const item = m.Projects.items[p.slug];
    const status = m.Projects.status[p.status];
    const site = p.website ? ` Website: ${p.website}` : "";
    return `- [${item.name}](${absoluteUrl("en", `/projects/${p.slug}`)}): ${item.summary} Status: ${status}.${site}`;
  }).join("\n");

  const text = `# ${SITE_NAME}

> ${m.Meta.description}

${m.About.lede} ${m.Home.aboutText}

## Key facts

- Founded: ${FOUNDING_YEAR}
- Registration: international; no registered postal address
- Contact: ${CONTACT_EMAIL} (replies in English and Turkish)
- Content licence: ${m.Facts.licenceValue} (${CONTENT_LICENSE_URL}), unless stated otherwise
- Working languages: ${m.Facts.languagesValue}
- Website languages: ${translatedLocales.map((code) => `${localeInfo[code].englishName} (${absoluteUrl(code)})`).join(", ")}

## Projects

${projects}

## Governance

${clean(m.Governance.lede)} ${m.Governance.text}

## Pages

- [About the foundation](${absoluteUrl("en", "/about")}): ${m.About.lede}
- [Projects](${absoluteUrl("en", "/projects")}): ${m.Projects.lede}
- [Governance](${absoluteUrl("en", "/governance")}): ${clean(m.Governance.lede)}
- [Get involved](${absoluteUrl("en", "/get-involved")}): ${m.Involved.lede}
- [Privacy and legal notice](${absoluteUrl("en", "/legal")})

## Questions

${faq(m.About.faq)}

${faq(m.Governance.faq)}

## Optional

- [Turkipedia](https://turkipedia.org/llms.txt): the encyclopedia's own guide for language models
- [Sitemap](${SITE_URL}/sitemap.xml)
`;

  return new Response(text, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
