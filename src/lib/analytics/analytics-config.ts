/**
 * Analytics 설정
 */

export function isAnalyticsEnabled(): boolean {
  // 프로덕션 환경에서만 Analytics 활성화
  return process.env.NODE_ENV === "production";
}

export function isVercelAnalyticsEnabled(): boolean {
  // Vercel Analytics는 항상 활성화 (가벼움)
  return true;
}

export function isGoogleAnalyticsEnabled(): boolean {
  // Google Analytics는 환경 변수로 제어
  return process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID !== undefined;
}
