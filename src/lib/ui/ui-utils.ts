import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Tailwind CSS 클래스 결합을 위한 유틸리티 함수
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 첫 번째 이모지 또는 문자열 추출 (SSR 호환)
 */
export function getFirstEmojiOrString(text?: string): string | null {
  if (!text) return null;

  // 공백이 아닌 첫 번째 문자/문자열 추출
  const match = text.match(/^\S+/);
  if (!match) return null;

  const firstToken = match[0];

  // 더 안정적인 이모지 감지: 유니코드 이모지 범위 체크
  const firstChar = firstToken.charAt(0);
  const codePoint = firstChar.codePointAt(0);

  // 이모지 유니코드 범위 확인 (일반적인 이모지 블록들)
  const isLikelyEmoji =
    codePoint &&
    ((codePoint >= 0x1f600 && codePoint <= 0x1f64f) || // 감정 표현 이모지
      (codePoint >= 0x1f300 && codePoint <= 0x1f5ff) || // 기타 심볼 및 그림문자
      (codePoint >= 0x1f680 && codePoint <= 0x1f6ff) || // 교통 및 지도 심볼
      (codePoint >= 0x1f1e0 && codePoint <= 0x1f1ff) || // 국기
      (codePoint >= 0x2600 && codePoint <= 0x26ff) || // 기타 심볼
      (codePoint >= 0x2700 && codePoint <= 0x27bf) || // 장식 문자
      (codePoint >= 0xfe00 && codePoint <= 0xfe0f) || // 변형 선택자
      (codePoint >= 0x1f900 && codePoint <= 0x1f9ff) || // 추가 이모지 블록
      codePoint > 0x1f000); // 기타 높은 유니코드 범위

  // 이모지로 보이면 첫 문자만, 아니면 전체 토큰 반환
  return isLikelyEmoji ? firstChar : firstToken;
}
