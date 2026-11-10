import { serializeJsonLd } from "@/lib/structured-data";

/** Structured data for search engines and answer engines (src/lib/structured-data.ts). */
export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} />;
}
