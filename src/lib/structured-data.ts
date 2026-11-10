import { type AppLocale, contentLocale, locales, translatedLocales } from "@/i18n/locales";
import { CONTACT_EMAIL, FOUNDING_YEAR, SITE_NAME, SITE_URL, absoluteUrl, withoutPlaceholders } from "./site";

// Schema.org data (JSON-LD) for search engines and answer engines. The organisation and the website
// are described once, in the layout; pages refer to them by @id.

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/** A JSON-LD <script> payload, with `<` escaped so no text can close the tag. */
export const serializeJsonLd = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c");

/** The foundation and its website. `description` and `localName` are in the page's language. */
export function siteGraph({ description, localName }: { description: string; localName: string }) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "NGO",
        "@id": ORGANIZATION_ID,
        name: SITE_NAME,
        alternateName: [...new Set([localName, "Turkic Blue Vakfı", "TurkicBlue"])].filter((name) => name !== SITE_NAME),
        url: SITE_URL,
        logo: { "@type": "ImageObject", url: `${SITE_URL}/icon-512.png`, width: 512, height: 512 },
        description,
        foundingDate: FOUNDING_YEAR,
        email: CONTACT_EMAIL,
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "general enquiries",
          email: CONTACT_EMAIL,
          availableLanguage: ["en", "tr"],
        },
        knowsLanguage: [...locales],
        knowsAbout: ["Turkic peoples", "Turkic languages", "History of the Turkic peoples", "Turkic culture", "Turkology", "Old Turkic script"],
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: SITE_URL,
        name: SITE_NAME,
        inLanguage: [...translatedLocales],
        publisher: { "@id": ORGANIZATION_ID },
      },
    ],
  };
}

type Crumb = { name: string; path: string };

/** A page: what it is, where it sits in the site, and (optionally) what it is about. */
export function pageGraph({
  locale,
  path,
  name,
  description,
  type = "WebPage",
  crumbs = [],
  about,
  faq = [],
}: {
  locale: AppLocale;
  path: string;
  name: string;
  description: string;
  type?: "WebPage" | "AboutPage" | "CollectionPage" | "ContactPage";
  crumbs?: Crumb[];
  about?: Record<string, unknown>;
  faq?: { q: string; a: string }[];
}) {
  const lang = contentLocale(locale);
  const url = absoluteUrl(lang, path);
  const answered = faq.map((item) => ({ q: item.q, a: withoutPlaceholders(item.a) })).filter((item) => item.a);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": type,
        "@id": `${url}#webpage`,
        url,
        name,
        description,
        inLanguage: lang,
        isPartOf: { "@id": WEBSITE_ID },
        publisher: { "@id": ORGANIZATION_ID },
        about: about ?? { "@id": ORGANIZATION_ID },
        ...(crumbs.length > 1 && {
          breadcrumb: {
            "@type": "BreadcrumbList",
            itemListElement: crumbs.map((crumb, i) => ({ "@type": "ListItem", position: i + 1, name: crumb.name, item: absoluteUrl(lang, crumb.path) })),
          },
        }),
      },
      ...(answered.length
        ? [
            {
              "@type": "FAQPage",
              "@id": `${url}#faq`,
              url,
              inLanguage: lang,
              isPartOf: { "@id": `${url}#webpage` },
              mainEntity: answered.map((item) => ({
                "@type": "Question",
                name: item.q,
                acceptedAnswer: { "@type": "Answer", text: item.a },
              })),
            },
          ]
        : []),
    ],
  };
}
