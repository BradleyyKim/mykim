"use client";

import { useEffect } from "react";
import { useBlogAnalytics } from "@/hooks/analytics";

/**
 * 외부 링크 클릭 추적 컴포넌트
 * 페이지 내의 모든 외부 링크 클릭을 자동으로 추적합니다.
 */
export default function ExternalLinkTracker() {
  const { trackExternalClick } = useBlogAnalytics();

  useEffect(() => {
    const handleLinkClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      // 클릭된 요소가 링크이거나 링크 내부의 요소인지 확인
      const link = target.closest("a") as HTMLAnchorElement;

      if (!link || !link.href) return;

      try {
        const linkUrl = new URL(link.href);
        const currentDomain = window.location.hostname;

        // 외부 링크인지 확인 (다른 도메인이거나 mailto:, tel: 등)
        const isExternal =
          linkUrl.hostname !== currentDomain ||
          linkUrl.protocol === "mailto:" ||
          linkUrl.protocol === "tel:" ||
          linkUrl.protocol === "sms:";

        if (isExternal) {
          const linkText = link.textContent?.trim() || link.getAttribute("aria-label") || "Unknown";
          trackExternalClick(link.href, linkText);
        }
      } catch {
        // URL 파싱 실패 시 무시
        console.debug("Failed to parse URL for analytics:", link.href);
      }
    };

    // 이벤트 리스너 등록
    document.addEventListener("click", handleLinkClick);

    return () => {
      document.removeEventListener("click", handleLinkClick);
    };
  }, [trackExternalClick]);

  return null; // 렌더링할 내용 없음
}
