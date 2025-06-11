"use client";

import { useEffect } from "react";
import { useBlogAnalytics } from "@/hooks/useGoogleAnalytics";

interface CategoryAnalyticsProps {
  categoryName: string;
}

/**
 * 카테고리 페이지 분석 컴포넌트
 * 카테고리 조회 이벤트를 자동으로 추적합니다.
 */
export default function CategoryAnalytics({ categoryName }: CategoryAnalyticsProps) {
  const { trackCategoryView } = useBlogAnalytics();

  useEffect(() => {
    if (categoryName) {
      trackCategoryView(categoryName);
    }
  }, [categoryName, trackCategoryView]);

  return null; // 렌더링할 내용 없음
}
