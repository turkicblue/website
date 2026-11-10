# Turkic Blue Foundation website

```sh
pnpm install
pnpm dev
```

Open http://localhost:3000. See `CLAUDE.md` for how the site is organised.

`pnpm build` writes the whole site as static files to `out/`.

## Publishing on GitHub Pages

`.github/workflows/pages.yml` builds the site and publishes it on every push to `main`.

1. Push this repository to the GitHub account or organisation that will host it. On a free account
   the repository must be **public**: GitHub Pages for private repositories needs a paid plan.
2. In the repository: **Settings > Pages > Build and deployment > Source: GitHub Actions**.
3. Push to `main`, or run the workflow from the Actions tab. The address appears in
   **Settings > Pages** when the first run finishes.

Without a custom domain the site lives at `https://<owner>.github.io/<repo>/`. The workflow reads
that address and its subpath from the Pages settings, so no file needs editing.

### Custom domain (turkicblue.org)

Recommended: search engines only read `robots.txt` at the root of a domain, and the address is the
foundation's own.

1. **Settings > Pages > Custom domain**: enter `turkicblue.org`, save, then tick **Enforce HTTPS**
   once the certificate is ready.
2. At the domain registrar, point the domain at GitHub Pages:
   - `A` records for `turkicblue.org`: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`,
     `185.199.111.153`
   - `CNAME` record for `www`: `<owner>.github.io`
3. Run the workflow again so canonical links, the sitemap and share images use the new address.

### After the first deploy

- Submit `<address>/sitemap.xml` in Google Search Console and Bing Webmaster Tools.
- Check a page in the [Rich Results Test](https://search.google.com/test/rich-results) and a link in a
  social preview tool.

### What a static host can't do

There is no server, so: the root address and old links without a language (`/about/`) are sent to the
visitor's language by a small script; there is one bilingual 404 page; and no custom response headers
are sent.

## Building locally for another address

```sh
NEXT_PUBLIC_SITE_URL=https://turkicblue.org pnpm build
# or, for a project site:
NEXT_PUBLIC_SITE_URL=https://owner.github.io/repo NEXT_PUBLIC_BASE_PATH=/repo pnpm build
```

## What search engines and AI assistants get

- Per-page titles, descriptions, canonical and hreflang links, Open Graph and Twitter tags.
- A share image for every page, drawn at build time as `/og/<language>/<page>.png`
  (`src/lib/og-image.tsx`).
- Schema.org data (JSON-LD): the foundation as an NGO, the website, each page with its breadcrumbs,
  and the questions on About and Governance as FAQPage (`src/lib/structured-data.ts`).
- `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest` and `/llms.txt`, a plain-text summary of
  the foundation for language models, built from the English text.
- Only translated languages (English and Turkish for now) are listed in the sitemap and hreflang
  links. Pages in the other languages show English, are marked `lang="en"` and point their canonical
  link at the English page. Set `translated: true` in `src/i18n/locales.ts` when a translation is done.
