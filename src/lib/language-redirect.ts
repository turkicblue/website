import { locales, translatedLocales } from "@/i18n/locales";
import { BASE_PATH, PAGE_PATHS } from "./site";

/**
 * Sends a visitor whose address has no language, such as / or /about/, to that page in their
 * browser's language, or English. A static host has no server to do this, so it is a script, run by
 * the root page (app/index.html) and the 404 page. Addresses that aren't pages are left alone.
 */
export function languageRedirectScript() {
  const config = JSON.stringify({ base: BASE_PATH, locales, translated: translatedLocales, pages: PAGE_PATHS });
  return `(function (c) {
  var p = location.pathname;
  if (c.base && p.indexOf(c.base) === 0) p = p.slice(c.base.length);
  p = ("/" + p).replace(/\\/+/g, "/").replace(/\\/$/, "");
  if (c.locales.indexOf(p.split("/")[1]) !== -1 || c.pages.indexOf(p) === -1) return;
  var wanted = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ""];
  var lang = "en";
  for (var i = 0; i < wanted.length; i++) {
    var code = String(wanted[i]).toLowerCase().split("-")[0];
    if (c.translated.indexOf(code) !== -1) { lang = code; break; }
  }
  location.replace(c.base + "/" + lang + p + "/" + location.search + location.hash);
})(${config});`;
}
