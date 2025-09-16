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
