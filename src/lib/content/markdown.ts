/**
 * MDX 본문에서 SEO용 텍스트와 대표 이미지를 뽑아내는 유틸.
 * 콘텐츠 소스는 `content/blog/{ko,en}/*.mdx` 이고, 여기 들어오는 값은 마크다운 문자열이다.
 */

/**
 * Extract plain text from markdown content for SEO descriptions
 */
export function extractPlainText(content: string | object, maxLength: number = 160): string {
  try {
    const text = typeof content === "string" ? content : String(content);

    const plainText = text
      // Remove markdown headings
      .replace(/^#{1,6}\s+/gm, "")
      // Remove markdown bold/italic
      .replace(/\*{1,3}(.*?)\*{1,3}/g, "$1")
      // Remove markdown links
      .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
      // Remove markdown images
      .replace(/!\[([^\]]*)\]\([^)]*\)/g, "")
      // Remove code blocks
      .replace(/```[\s\S]*?```/g, "")
      // Remove inline code
      .replace(/`([^`]*)`/g, "$1")
      // Remove HTML tags
      .replace(/<[^>]*>/g, "")
      // Remove frontmatter (if accidentally included)
      .replace(/^---[\s\S]*?---/m, "")
      // Collapse whitespace
      .replace(/\s+/g, " ")
      .trim();

    return plainText.length > maxLength
      ? plainText.substring(0, maxLength) + "..."
      : plainText;
  } catch {
    return typeof content === "string" ? content.substring(0, maxLength) : "";
  }
}

/**
 * Extract first image URL from markdown content
 */
export function extractFirstImageFromContent(content: string | object): string | null {
  try {
    const text = typeof content === "string" ? content : String(content);

    // Match markdown image syntax: ![alt](url)
    const mdImageRegex = /!\[[^\]]*\]\(([^)]+)\)/;
    const match = text.match(mdImageRegex);
    if (match?.[1]) return match[1];

    // Match HTML img tags
    const htmlImageRegex = /<img[^>]+src="([^">]+)"/;
    const htmlMatch = text.match(htmlImageRegex);
    if (htmlMatch?.[1]) return htmlMatch[1];

    return null;
  } catch {
    return null;
  }
}
