import { format } from "date-fns";
import type { Locale } from "@/i18n";

/** Date only — frontmatter has no time, and adding HH:mm reintroduces a hydration mismatch. */
export function formatPostDate(date: string | Date, locale: Locale): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return locale === "en" ? format(d, "MMM d, yyyy") : format(d, "yyyy.MM.dd");
}

export function formatMinutes(minutes: number, locale: Locale): string {
  return locale === "en" ? `${minutes} min` : `${minutes}분`;
}

export function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}
