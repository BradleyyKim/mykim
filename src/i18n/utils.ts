import { Locale, defaultLocale } from "./config";
import ko from "./locales/ko.json";
import en from "./locales/en.json";

const dictionaries: Record<Locale, typeof ko> = { ko, en };

export function getDictionary(locale: Locale) {
  return dictionaries[locale] || dictionaries[defaultLocale];
}

export function t(locale: Locale, key: string, params?: Record<string, string>): string {
  const dict = getDictionary(locale);
  const keys = key.split(".");
  let value: unknown = dict;
  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      return key;
    }
  }
  if (typeof value !== "string") return key;
  if (params) {
    return Object.entries(params).reduce(
      (str, [k, v]) => str.replace(`{${k}}`, v),
      value
    );
  }
  return value;
}

export function getLocalePath(locale: Locale, path: string): string {
  if (locale === defaultLocale) return path;
  return `/${locale}${path}`;
}

export function getLocaleFromPath(pathname: string): Locale {
  const segments = pathname.split("/").filter(Boolean);
  if (segments[0] === "en") return "en";
  return defaultLocale;
}

export function removeLocaleFromPath(pathname: string): string {
  if (pathname.startsWith("/en")) {
    return pathname.replace(/^\/en/, "") || "/";
  }
  return pathname;
}
