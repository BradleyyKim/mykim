import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Tailwind CSS 클래스 결합을 위한 유틸리티 함수
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 첫 번째 이모지 또는 문자열 추출 (ES2017 호환)
 */
export function getFirstEmojiOrString(text?: string): string | null {
  if (!text) return null;

  // 공백이 아닌 첫 번째 문자/문자열 추출
  const match = text.match(/^\S+/);
  if (!match) return null;

  const firstToken = match[0];

  // 간단한 이모지 감지: 첫 문자가 ASCII 범위를 벗어나면 이모지로 간주
  const firstChar = firstToken.charAt(0);
  const isLikelyEmoji = firstChar.charCodeAt(0) > 127;

  // 이모지로 보이면 첫 문자만, 아니면 전체 토큰 반환
  return isLikelyEmoji ? firstChar : firstToken;
}
