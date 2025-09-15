// Strapi 관계 타입 정의
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

export async function getPDFFromStrapi(language: string): Promise<{ url: string; id: number; name: string } | null> {
  try {
    const STRAPI_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337/api";
    // Strapi v5에서는 /api/upload/files 대신 /api/upload/files 사용
    const response = await fetch(`${STRAPI_URL}/upload/files`, {
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`
      }
    });

    const files = await response.json();

    console.log(`[getPDFFromStrapi] 검색 중인 언어: ${language}`);
    console.log(`[getPDFFromStrapi] Strapi API 응답 구조:`, JSON.stringify(files, null, 2));
    console.log(`[getPDFFromStrapi] files.data 존재 여부:`, !!files.data);
    console.log(`[getPDFFromStrapi] files.data 타입:`, typeof files.data);
    console.log(`[getPDFFromStrapi] files.data 길이:`, files.data?.length || "undefined");

    // Strapi v5 응답 구조에 맞게 수정
    // v5에서는 { data: [...] } 구조 또는 직접 배열 구조
    let fileList = [];

    if (files.data && Array.isArray(files.data)) {
      // Strapi v5 표준 구조: { data: [...] }
      fileList = files.data;
    } else if (Array.isArray(files)) {
      // 직접 배열 구조: [...]
      fileList = files;
    } else if (files.results && Array.isArray(files.results)) {
      // 일부 버전에서 사용하는 구조: { results: [...] }
      fileList = files.results;
    }

    console.log(`[getPDFFromStrapi] 파일 목록:`, fileList.map((file: { name: string }) => file.name) || []);

    // 최신 PDF 파일 찾기 (createdAt 기준으로 정렬)
    const pdfFiles = fileList.filter((file: { name: string; createdAt?: string }) =>
      file.name.includes(`career-portfolio-${language}`)
    );
    const pdfFile =
      pdfFiles.length > 0
        ? pdfFiles.sort(
            (a: { createdAt: string }, b: { createdAt: string }) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )[0]
        : null;

    console.log(`[getPDFFromStrapi] 찾은 PDF 파일:`, pdfFile ? pdfFile.name : "없음");

    return pdfFile ? { url: pdfFile.url, id: pdfFile.id, name: pdfFile.name } : null;
  } catch (error) {
    console.error("Strapi에서 PDF 가져오기 실패:", error);
    return null;
  }
}
