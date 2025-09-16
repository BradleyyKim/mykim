/**
 * 🎯 새로운 도메인 기반 라이브러리 구조
 *
 * 이 파일은 기존 import 호환성을 위해 유지됩니다.
 * 새로운 코드에서는 구체적인 도메인을 직접 import 하는 것을 권장합니다.
 *
 * 예시:
 * - import { apiClient } from '@/lib/api'
 * - import { useAuth } from '@/lib/auth'
 * - import { trackEvent } from '@/lib/analytics'
 */

// API 관련 exports
export * from "./api";

// 인증 관련 exports
export * from "./auth";

// 분석 및 추적 exports
export * from "./analytics";

// CMS 관련 exports
export { getCategorySlug, getCategoryName, getPDFFromStrapi } from "./cms";
export * from "./cms/post-service";

// 콘텐츠 처리 exports
export { renderTiptapContent, extractPlainText, extractFirstImageFromTiptapContent } from "./content/editor";
export { containsKorean, generateSlugFromText, suggestSlugFromTitle } from "./content/slug-utils";

// 미디어 처리 exports
export * from "./media";

// 캐시 관리 exports
export * from "./cache";

// 데이터 페칭 exports
export * from "./query";

// UI 유틸리티 exports
export { cn, getFirstEmojiOrString } from "./ui";

// 전역 상수
export * from "./constants";

// 범용 유틸리티
export * from "./utils";
