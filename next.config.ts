import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// A static site: `pnpm build` writes plain files to out/, published on GitHub Pages
// (.github/workflows/pages.yml). There is no server, so no proxy, redirects or response headers.
const nextConfig: NextConfig = {
  output: "export",
  // /en/about/ is written as en/about/index.html, which static hosts serve without configuration.
  trailingSlash: true,
  // Set when the site is served from a subpath, such as https://turkicblue.github.io/turkicbluefoundation.
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || undefined,
  experimental: {
    // The root layout is app/[locale]/layout.tsx, so addresses outside any language need their own
    // 404. It becomes out/404.html, which GitHub Pages serves for every missing address.
    globalNotFound: true,
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
