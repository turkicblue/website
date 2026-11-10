import type { Metadata } from "next";
import Link from "next/link";
import { languageRedirectScript } from "@/lib/language-redirect";
import "./globals.css";

// For every address that isn't a page; it becomes out/404.html. An address without a language, such
// as an old link to /about/, is first forwarded to that page in the visitor's language.
export const metadata: Metadata = {
  title: "Page not found – Turkic Blue Foundation",
};

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body className="night-sky grid min-h-svh place-items-center px-4 text-star">
        <script dangerouslySetInnerHTML={{ __html: languageRedirectScript() }} />
        <main className="max-w-[46ch]">
          <h1 className="text-4xl font-light">Page not found</h1>
          <p className="mt-3 text-mist">The page you were looking for doesn&apos;t exist or has moved.</p>
          <p className="mt-1 text-mist" lang="tr">Aradığınız sayfa yok ya da taşınmış.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/en" className="inline-flex min-h-[46px] items-center rounded bg-white px-[22px] font-medium text-ink no-underline">
              English
            </Link>
            <Link href="/tr" lang="tr" className="inline-flex min-h-[46px] items-center rounded border border-star/55 px-[22px] font-medium text-star no-underline">
              Türkçe
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
