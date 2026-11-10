import type { MetadataRoute } from "next";
import english from "../../messages/en.json";
import { SITE_NAME } from "@/lib/site";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "Turkic Blue",
    description: english.Meta.description,
    lang: "en",
    // Relative to the manifest, so they hold under a base path too.
    start_url: "./",
    scope: "./",
    display: "browser",
    background_color: "#04121b",
    theme_color: "#04121b",
    icons: [
      { src: "icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
