/**
 * 중앙화된 revalidate 설정
 * 모든 페이지에서 일관된 캐시 정책을 적용하기 위한 설정
 */

/**
 * 개발 환경과 프로덕션 환경에 따른 revalidate 시간 설정
 */
export const REVALIDATE_CONFIG = {
  // 개발 환경: 캐시 비활성화 (0초)
  DEVELOPMENT: 0,

  // 프로덕션 환경: 5분 캐시
  PRODUCTION: 300,

  // 현재 환경에 따른 revalidate 값
  get CURRENT() {
    return process.env.NODE_ENV === "development" ? this.DEVELOPMENT : this.PRODUCTION;
  }
} as const;

/**
 * 페이지별 revalidate 설정 (정적 값)
 */
export const PAGE_REVALIDATE = {
  // 홈페이지
  HOME: 300,

  // 카테고리 페이지
  CATEGORY: 300,

  // 태그 페이지
  TAGS: 300,

  // 태그 상세 페이지
  TAG_DETAIL: 300,

  // 포스트 상세 페이지
  POST_DETAIL: 300,

  // 기타 페이지
  DEFAULT: 300
} as const;

/**
 * 특정 페이지의 revalidate 값을 가져오는 헬퍼 함수
 */
export function getRevalidateTime(page: keyof typeof PAGE_REVALIDATE = "DEFAULT"): number {
  return PAGE_REVALIDATE[page];
}

/**
 * 개발 환경인지 확인하는 헬퍼 함수
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === "development";
}

/**
 * 프로덕션 환경인지 확인하는 헬퍼 함수
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}
