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
          return data.attributes.name || null;
        }
        return data.name || null;
      }
      return null;
    }

    // 일반 객체 형식
    const categoryObj = category as Record<string, unknown>;
    if (categoryObj.attributes && typeof categoryObj.attributes === "object") {
      const attributes = categoryObj.attributes as StrapiAttribute;
      return attributes.name || null;
    }
    if (typeof categoryObj.name === "string") {
      return categoryObj.name;
    }
    return null;
  }

  return null;
}
