"use client";

import "./globals.css";

// The last resort, when the layout itself fails: no translations or fonts are available here, so
// it is short and bilingual.
export default function GlobalError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <html lang="en">
      <body className="night-sky grid min-h-svh place-items-center px-4 text-star">
        <main className="max-w-[46ch]">
          <h1 className="text-4xl font-light">Something went wrong</h1>
          <p className="mt-3 text-mist" lang="tr">Bir sorun oluştu.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={() => retry()} className="min-h-[46px] rounded bg-white px-[22px] font-medium text-ink">
              Try again
            </button>
            {/* A full page load on purpose: the app around this page has failed. */}
            <a href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/`} className="inline-flex min-h-[46px] items-center rounded border border-star/55 px-[22px] font-medium text-star no-underline">
              Home
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
