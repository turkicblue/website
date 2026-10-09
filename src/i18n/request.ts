import { notFound } from "next/navigation";
import * as rootParams from "next/root-params";
import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import english from "../../messages/en.json";
import { routing } from "./routing";

type Messages = Record<string, unknown>;

const isObject = (value: unknown): value is Messages => Boolean(value) && typeof value === "object" && !Array.isArray(value);

// English is the fallback for strings not yet translated into a language. Lists (paragraphs,
// points) are replaced whole: a translation's list is never merged item by item with English.
function withFallback(fallback: Messages, messages: Messages): Messages {
  const merged: Messages = { ...fallback };
  for (const [key, value] of Object.entries(messages)) {
    const base = fallback[key];
    merged[key] = isObject(value) && isObject(base) ? withFallback(base, value) : value;
  }
  return merged;
}

export default getRequestConfig(async ({ locale }) => {
  if (!locale) {
    const paramValue = await rootParams.locale();
    if (!hasLocale(routing.locales, paramValue)) notFound();
    locale = paramValue;
  }

  const messages =
    locale === "en" ? english : withFallback(english, (await import(`../../messages/${locale}.json`)).default);
  return { locale, messages };
});
