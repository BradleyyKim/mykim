/**
 * HTML 태그 제거 함수
 * 마크다운 등의 콘텐츠에서 텍스트만 추출할 때 사용
 */
export const stripHtml = (html: string) => {
  return html
    .replace(/<[^>]*>/g, "") // HTML 태그 제거
    .replace(/&nbsp;/g, " ") // 특수 HTML 엔티티 처리
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .trim();
};

/**
 * 글 내용 기반으로 예상 읽기 시간 계산 (분 단위)
 * @param content 콘텐츠 텍스트 (HTML 태그 제거된 상태)
 * @param wordsPerMinute 분당 읽는 단어 수 (기본값: 250)
 * @returns 읽기 시간 (분)
 */
export function calculateReadingTime(content: string, wordsPerMinute = 250): number {
  const plainContent = stripHtml(content);
  const wordCount = plainContent.split(/\s+/).length;
  return Math.max(1, Math.round(wordCount / wordsPerMinute));
}
