import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getTranslations } from "next-intl/server";
import { ImageResponse } from "next/og";
import { projectBySlug } from "@/content/projects";
import { SITE_URL } from "./site";

// The picture shown when a page is shared: the night sky of the site's page headers, the mark and
// name, and the page's title. Written at build time as /og/<language>/<page>.png
// (app/og/[locale]/[image]/route.ts). Fonts are in src/assets/fonts (SIL Open Font License).

/** The title (and the line above it) on a page's image. `path` is one of PAGE_PATHS. */
export async function ogContent(locale: string, path: string): Promise<{ title: string; kicker?: string }> {
  const t = await getTranslations({ locale });
  const project = path.startsWith("/projects/") ? projectBySlug(path.slice("/projects/".length)) : undefined;
  if (project) return { title: t(`Projects.items.${project.slug}.name`), kicker: `${t("Nav.projects")} · ${t(`Projects.status.${project.status}`)}` };
  const titles: Record<string, string> = {
    "": t("Sky.title"),
    "/about": t("About.title"),
    "/projects": t("Projects.title"),
    "/governance": t("Governance.title"),
    "/get-involved": t("Involved.title"),
    "/legal": t("Legal.title"),
  };
  return { title: titles[path] ?? t("Meta.title") };
}

const font = (file: string) => readFile(join(process.cwd(), "src/assets/fonts", file));

// "Kök Türük" in Old Turkic runes, as in the home page's sky. The image renderer lays text out left
// to right, so the right-to-left runes are given in visual order.
const RUNES_VISUAL = Array.from("𐰜𐰇𐰚:𐱅𐰇𐰼𐰜").reverse().join("");

// A fixed scatter of stars.
const STARS = Array.from({ length: 70 }, (_, i) => {
  const x = (i * 467 + 113) % 1200;
  const y = (i * 263 + 59) % 630;
  return { x, y, r: i % 9 === 0 ? 2.4 : i % 3 === 0 ? 1.6 : 1.1, o: 0.25 + ((i * 37) % 50) / 100 };
});

export async function ogImage(locale: string, { title, kicker }: { title: string; kicker?: string }) {
  const brand = await getTranslations({ locale, namespace: "Brand" });
  const [light, regular, runes] = await Promise.all([font("Jost-Light.ttf"), font("Jost-Regular.ttf"), font("NotoSansOldTurkic-Regular.ttf")]);
  const host = SITE_URL.replace(/^https?:\/\//, "");
  const titleSize = title.length > 42 ? 64 : 80;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "68px 80px 60px",
          background: "linear-gradient(180deg, #04121b 0%, #082433 62%, #0e3a4a 100%)",
          color: "#f2f7f8",
          fontFamily: "Jost",
          position: "relative",
        }}
      >
        {STARS.map((s, i) => (
          <div key={i} style={{ position: "absolute", left: s.x, top: s.y, width: s.r * 2, height: s.r * 2, borderRadius: 9999, background: "#f2f7f8", opacity: s.o }} />
        ))}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg viewBox="0 0 26 26" width="60" height="60">
            <circle cx="13" cy="13" r="11.5" fill="none" stroke="#f2f7f8" strokeWidth="1.5" />
            <circle cx="13" cy="13" r="6.5" fill="none" stroke="#3bd1c2" strokeWidth="1.5" />
            <path d="M6.5 10.5h13M6.5 15.5h13M10.5 6.5v13M15.5 6.5v13" stroke="#f2f7f8" strokeWidth="1" opacity="0.7" />
          </svg>
          <div style={{ display: "flex", fontSize: 38, fontWeight: 400 }}>
            Turkic Blue<span style={{ marginLeft: 12, fontWeight: 300, opacity: 0.8 }}>{brand("suffix")}</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {kicker && <div style={{ fontSize: 30, color: "#3bd1c2", marginBottom: 18 }}>{kicker}</div>}
          <div style={{ display: "flex", fontSize: titleSize, fontWeight: 300, lineHeight: 1.08, letterSpacing: "-0.015em", maxWidth: 1000 }}>{title}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", fontSize: 28, color: "#a9bcc4" }}>
          <span>{host}</span>
          <span style={{ fontFamily: "Old Turkic", fontSize: 46, color: "#3bd1c2" }}>{RUNES_VISUAL}</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Jost", data: light, weight: 300, style: "normal" },
        { name: "Jost", data: regular, weight: 400, style: "normal" },
        { name: "Old Turkic", data: runes, weight: 400, style: "normal" },
      ],
    },
  );
}
