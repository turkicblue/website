import { translatedLocales } from "@/i18n/locales";
import { ogContent, ogImage } from "@/lib/og-image";
import { PAGE_PATHS, ogImageFile } from "@/lib/site";

// Every page's share image as a real .png file (out/og/en/about.png), so static hosts send it with
// an image content type. Untranslated languages share the English images.
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return translatedLocales.flatMap((locale) => PAGE_PATHS.map((path) => ({ locale, image: ogImageFile(path) })));
}

export async function GET(_request: Request, { params }: RouteContext<"/og/[locale]/[image]">) {
  const { locale, image } = await params;
  const path = PAGE_PATHS.find((p) => ogImageFile(p) === image) ?? "";
  return ogImage(locale, await ogContent(locale, path));
}
