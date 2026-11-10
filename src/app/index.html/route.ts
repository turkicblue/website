import { languageRedirectScript } from "@/lib/language-redirect";
import { BASE_PATH, SITE_NAME, absoluteUrl } from "@/lib/site";

// The site's root, written to out/index.html: it forwards to the home page in the visitor's language.
// The links are for browsers without JavaScript.
export const dynamic = "force-static";

export function GET() {
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${SITE_NAME}</title>
<link rel="canonical" href="${absoluteUrl("en")}">
<link rel="icon" href="${BASE_PATH}/icon.svg" type="image/svg+xml">
<meta name="theme-color" content="#04121b">
<script>${languageRedirectScript()}</script>
<noscript><meta http-equiv="refresh" content="0; url=${BASE_PATH}/en/"></noscript>
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#04121b;color:#f2f7f8;font:17px/1.6 system-ui,sans-serif}a{color:#3bd1c2;margin:0 .5em}</style>
</head>
<body>
<p><a href="${BASE_PATH}/en/">English</a><a href="${BASE_PATH}/tr/" lang="tr">Türkçe</a></p>
</body>
</html>
`;
  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}
