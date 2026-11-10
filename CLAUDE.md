# Turkic Blue Foundation website

The website of Turkic Blue Foundation: who the foundation is, its projects (Turkipedia, Turquoise News,
TurkicBlue Research Network, TurkicBlue DAO), how it is governed and how to take part. Turkipedia itself
is a separate repository (`../turkic.blue`); this site links to it.

## Stack

Next.js 16 (App Router), TypeScript, Tailwind 4, next-intl. The home page's sky is three.js; scrolling
and reveals are Lenis and GSAP ScrollTrigger. No database and no server: `output: "export"` writes the
site to `out/`, published on GitHub Pages by `.github/workflows/pages.yml` (see README).

`pnpm dev`, `pnpm build`, `pnpm typecheck`, `pnpm lint`.

## Layout

- `messages/*.json`: all text. English (`en.json`) and Turkish (`tr.json`) are complete; the other five
  languages fall back to English until translated (`src/i18n/request.ts`). Values in [brackets] are
  facts the foundation still has to supply (legal form, board, DAO membership model, launch dates...).
  Settled facts: founded 2025, registered internationally, no registered postal address, contact
  esenlikler@turkicblue.org (`src/lib/site.ts`). The DAO is not established yet; Turquoise News and
  the DAO are "In development".
- `src/i18n/locales.ts`: the languages. `translated: true` puts a language in the sitemap and hreflang
  links; until then its pages are marked English with a canonical link to the English page.
- `src/lib/site.ts` (URLs, contact, page metadata), `src/lib/structured-data.ts` (JSON-LD),
  `src/lib/og-image.tsx` (share images, written as `/og/<lang>/<page>.png` by `src/app/og/`), and
  `src/app/llms.txt/route.ts` (a summary for language models, built from `en.json`).
- Static-host stand-ins: `src/app/index.html/route.ts` (the root page) and `src/app/global-not-found.tsx`
  (`out/404.html`) run `src/lib/language-redirect.ts`, which sends addresses without a language to the
  visitor's language. Route handlers and metadata routes need `dynamic = "force-static"`; dynamic
  segments need `generateStaticParams` and `dynamicParams = false`.
- `src/content/`: the project list (slugs, status, links) and the kök word table. A project's status
  row on its page comes from here, not from the messages.
- `src/components/sky.tsx`: the home page's night sky. Stars gather into the Old Turkic "Kök Türük",
  then "Turkic Blue", then the shangyrak, one caption per shape. The runes are attested spellings from
  the Orkhon inscriptions; don't change them without a source.
- `src/components/sections.tsx`: sections shared by the home page and the inner pages.
- `src/components/motion.tsx`: smooth scrolling and `data-reveal` reveals; both respect reduced motion.
- `src/app/[locale]/`: pages. Inner pages open with `PageHero` (a static night band, `data-dark-hero`,
  which the header reads to stay transparent over it).

## Rules

- Colours are tokens in `src/app/globals.css`: night blues, turquoise, white and grays. No yellow or gold.
- Copy is plain and factual: short sentences, no slogans. Don't invent facts; use a [bracketed]
  placeholder for anything the foundation hasn't decided.
- Absolute URLs come from `NEXT_PUBLIC_SITE_URL` (and `NEXT_PUBLIC_BASE_PATH` on a subpath); the
  Pages workflow sets both. Page URLs end in a slash (`trailingSlash`): build them with `absoluteUrl`.
- No proxy, redirects, rewrites, response headers or cookies: the host only serves files.
- There is no mailing service: "subscribe" is a mailto link to the contact address.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
