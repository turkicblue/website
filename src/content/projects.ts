// The foundation's projects. Their text is in messages/*.json under Projects.items.<slug>.

export type ProjectStatus = "live" | "preparation" | "forming" | "planned";

export type Project = {
  slug: "turkipedia" | "turquoise-news" | "research-network" | "dao";
  status: ProjectStatus;
  /** Its own website, when it has one. */
  website?: string;
  /** Where the "how to take part" button goes: a page on this site or another site. */
  action: { href: string; external?: boolean };
};

export const PROJECTS: Project[] = [
  { slug: "turkipedia", status: "live", website: "https://turkipedia.org", action: { href: "https://turkipedia.org", external: true } },
  { slug: "turquoise-news", status: "preparation", action: { href: "/get-involved#contact" } },
  { slug: "research-network", status: "forming", action: { href: "/get-involved#contact" } },
  { slug: "dao", status: "planned", action: { href: "/governance" } },
];

export const projectBySlug = (slug: string) => PROJECTS.find((p) => p.slug === slug);

/** Turkipedia's article count, shown on project pages. Update when it changes significantly. */
export const TURKIPEDIA_ARTICLES = 14238;
