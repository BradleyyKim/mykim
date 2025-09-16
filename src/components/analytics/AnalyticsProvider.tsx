"use client";

import { usePageTracking } from "@/hooks/analytics";
import { useState, useEffect } from "react";
import ExternalLinkTracker from "./ExternalLinkTracker";

/**
 * 전역 Google Analytics 추적 제공자
 * 모든 페이지 변경과 외부 링크 클릭을 자동으로 추적합니다.
 */
export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);

  // 클라이언트 측에서만 실행되도록 보장
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 클라이언트에서만 페이지 추적 활성화
  usePageTracking();

  return (
    <>
      {/* 클라이언트에서만 외부 링크 클릭 추적 활성화 */}
      {isClient && <ExternalLinkTracker />}
      {children}
    </>
  );
}
