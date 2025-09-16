/**
 * 한국어가 포함된 텍스트인지 확인
 */
export function containsKorean(text: string): boolean {
  const koreanRegex = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
  return koreanRegex.test(text);
}

/**
 * 텍스트를 slug로 변환 (패키지 없이 직접 구현)
 */
export function generateSlugFromText(text: string): string {
  if (!text || text.trim().length === 0) {
    return "";
  }

  return (
    text
      .toLowerCase() // 소문자 변환
      .replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, "") // 한글 제거
      .replace(/[^\w\s-]/g, "") // 특수문자 제거 (영문, 숫자, 공백, 하이픈만 남김)
      .trim() // 앞뒤 공백 제거
      .replace(/\s+/g, "-") // 공백을 하이픈으로 변환
      .replace(/-+/g, "-") // 연속된 하이픈을 하나로
      .replace(/^-+|-+$/g, "") // 시작과 끝의 하이픈 제거
      .substring(0, 60) || // 최대 60자로 제한
    "untitled-post"
  ); // 빈 문자열이면 기본값
}

/**
 * 제목에서 기본 slug 제안
 */
export function suggestSlugFromTitle(title: string): string {
  return generateSlugFromText(title);
}
