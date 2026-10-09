import type { Project } from "@/content/projects";

/** Line icons for the projects, drawn in the current text colour. */
export function ProjectIcon({ slug, className }: { slug: Project["slug"]; className?: string }) {
  const common = { viewBox: "0 0 40 40", fill: "none", stroke: "currentColor", strokeWidth: 1.6, className, "aria-hidden": true } as const;
  switch (slug) {
    case "turkipedia":
      return (
        <svg {...common}>
          <path d="M20 10c-4-2.5-9-3-13-2v22c4-1 9-.5 13 2 4-2.5 9-3 13-2V8c-4-1-9-.5-13 2z" />
          <path d="M20 10v22" />
        </svg>
      );
    case "turquoise-news":
      return (
        <svg {...common}>
          <rect x="6" y="9" width="28" height="22" rx="2" />
          <path d="M11 15h12M11 20h18M11 25h18" />
          <circle cx="29" cy="15" r="2" />
        </svg>
      );
    case "research-network":
      return (
        <svg {...common}>
          <circle cx="20" cy="12" r="3.5" />
          <circle cx="9" cy="28" r="3.5" />
          <circle cx="31" cy="28" r="3.5" />
          <path d="M18 15l-7 10M22 15l7 10M12.5 28h15" />
        </svg>
      );
    case "dao":
      return (
        <svg {...common}>
          <circle cx="20" cy="20" r="12" />
          <circle cx="20" cy="20" r="3" />
          <path d="M20 8v3M20 29v3M8 20h3M29 20h3M11.5 11.5l2 2M26.5 26.5l2 2M28.5 11.5l-2 2M13.5 26.5l-2 2" />
        </svg>
      );
  }
}
