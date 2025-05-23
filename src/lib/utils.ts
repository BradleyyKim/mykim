import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Tailwind CSS 클래스 결합을 위한 유틸리티 함수
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Strapi 관계 타입 정의 (이런 타입들은 별도의 types.ts 파일로 분리해도 좋음)
interface StrapiAttribute {
  name?: string;
  slug?: string;
  [key: string]: unknown;
}

interface StrapiData {
  id?: number | string;
  attributes?: StrapiAttribute;
  name?: string;
  slug?: string;
  [key: string]: unknown;
}

interface StrapiRelation {
  data?: StrapiData | null;
  [key: string]: unknown;
}

/**
 * Strapi CMS 카테고리 객체에서 slug 정보를 추출하는 유틸리티 함수
 * 카테고리 정보가 다양한 형태로 올 수 있어서 여러 케이스를 처리함
 */
export function getCategorySlug(category: unknown): string | null {
  if (!category) return null;

  if (typeof category === "object" && category !== null) {
    // Strapi v4 형식: category.data.attributes
    if ("data" in category) {
      const relation = category as StrapiRelation;
      if (relation.data && typeof relation.data === "object") {
        const data = relation.data;
        if (data.attributes) {
          return data.attributes.slug || null;
        }
        return data.slug || null;
      }
      return null;
    }

    // 일반 객체 형식
    const categoryObj = category as Record<string, unknown>;
    if (categoryObj.attributes && typeof categoryObj.attributes === "object") {
      const attributes = categoryObj.attributes as StrapiAttribute;
      return attributes.slug || null;
    }
    if (typeof categoryObj.slug === "string") {
      return categoryObj.slug;
    }
    return null;
  }

  return null;
}

/**
 * Strapi CMS 카테고리 객체에서 이름 정보를 추출하는 유틸리티 함수
 * 카테고리 정보가 다양한 형태로 올 수 있어서 여러 케이스를 처리함
 */
export function getCategoryName(category: unknown): string | null {
  if (!category) return null;

  if (typeof category === "object" && category !== null) {
    // Strapi v4 형식: category.data.attributes
    if ("data" in category) {
      const relation = category as StrapiRelation;
      if (relation.data && typeof relation.data === "object") {
        const data = relation.data;
        if (data.attributes) {
          return data.attributes.name || data.attributes.slug || null;
        }
        return data.name || data.slug || null;
      }
      return null;
    }

    // 일반 객체 형식
    const categoryObj = category as Record<string, unknown>;
    if (categoryObj.attributes && typeof categoryObj.attributes === "object") {
      const attributes = categoryObj.attributes as StrapiAttribute;
      return attributes.name || attributes.slug || JSON.stringify(category);
    }
    if (typeof categoryObj.name === "string") {
      return categoryObj.name;
    }
    if (typeof categoryObj.slug === "string") {
      return categoryObj.slug;
    }

    // 이름이나 슬러그가 없고 객체만 있는 경우 fallback
    return JSON.stringify(category);
  }

  // 문자열로 제공되는 경우 (id나 slug)
  if (typeof category === "string") {
    return category;
  }

  return null;
}

export function getFirstEmojiOrString(text?: string): string | null {
  if (!text) return null;
  // Match first emoji or word (space as delimiter)
  const match = text.match(/^(\p{Emoji}|\S+)/u);
  return match ? match[0] : null;
}

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
