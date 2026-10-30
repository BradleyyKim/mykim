import type { Locale } from "@/i18n";

/** Korean is read by syllable, English by word. Both are conservative averages. */
const KO_CHARS_PER_MIN = 500;
const EN_WORDS_PER_MIN = 220;

export interface ReadingStats {
  minutes: number;
  /** characters for ko, words for en */
  units: number;
}

export function readingTime(markdown: string, locale: Locale): ReadingStats {
  const text = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#>*_`~|-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (locale === "en") {
    const words = text ? text.split(" ").length : 0;
    return { minutes: Math.max(1, Math.round(words / EN_WORDS_PER_MIN)), units: words };
  }
  const chars = text.replace(/\s/g, "").length;
  return { minutes: Math.max(1, Math.round(chars / KO_CHARS_PER_MIN)), units: chars };
}
