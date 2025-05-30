import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Tailwind CSS 클래스 결합을 위한 유틸리티 함수
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 첫 번째 이모지 또는 문자열 추출
 */
export function getFirstEmojiOrString(text?: string): string | null {
  if (!text) return null;
  // Match first emoji or word (space as delimiter)
  const match = text.match(/^(\p{Emoji}|\S+)/u);
  return match ? match[0] : null;
}
