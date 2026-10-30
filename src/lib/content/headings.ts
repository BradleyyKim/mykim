/**
 * Heading extraction + slugs for the table of contents.
 *
 * Ids come from `github-slugger` here (server, raw markdown) and from `rehype-slug` in
 * the renderer, which uses the same slugger on the rendered heading text. Both start a
 * fresh slugger per document, so duplicates get the same `-1`, `-2` suffixes on each side.
 */
import GithubSlugger from "github-slugger";

export interface Heading {
  id: string;
  text: string;
  /** 1 = `#` (post section), 2 = `##`, 3 = `###` */
  level: 1 | 2 | 3;
}

export class Slugger {
  private inner = new GithubSlugger();

  slug(text: string): string {
    return this.inner.slug(text) || "section";
  }
}

/** Strip inline markdown so the TOC shows plain text. */
export function plainHeadingText(raw: string): string {
  return raw
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/<[^>]+>/g, "")
    .trim();
}

export function extractHeadings(markdown: string): Heading[] {
  const slugger = new Slugger();
  const out: Heading[] = [];
  let inFence = false;

  for (const line of markdown.split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const m = /^(#{1,3})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!m) continue;
    const level = m[1].length as 1 | 2 | 3;
    const text = plainHeadingText(m[2]);
    if (!text) continue;
    out.push({ id: slugger.slug(text), text, level });
  }
  return out;
}
