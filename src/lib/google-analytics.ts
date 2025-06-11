// Google Analytics 설정 및 유틸리티 함수

// gtag 타입 정의
declare global {
  interface Window {
    gtag: (command: "config" | "event", targetId: string, config?: Record<string, string | number | boolean>) => void;
  }
}

// 환경변수에서 GA 측정 ID 가져오기
export function getGAMeasurementId(): string | undefined {
  // 개발 환경에서는 개발용 ID 사용 (있는 경우), 없으면 운영용 ID 사용
  if (process.env.NODE_ENV === "development") {
    return process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID_DEV || process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  }

  // 운영 환경에서는 운영용 ID 사용
  return process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
}

// GA가 활성화되어야 하는지 확인
export function isGAEnabled(): boolean {
  const measurementId = getGAMeasurementId();

  // 측정 ID가 없으면 비활성화
  if (!measurementId) {
    return false;
  }

  // 개발 환경에서 GA 비활성화 (선택사항)
  if (process.env.NODE_ENV === "development" && !process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID_DEV) {
    console.log("🔍 GA disabled in development mode");
    return false;
  }

  return true;
}

// 페이지 조회 이벤트 전송
export function trackPageView(url: string): void {
  if (typeof window !== "undefined" && window.gtag && isGAEnabled()) {
    window.gtag("config", getGAMeasurementId()!, {
      page_location: url
    });
  } else if (process.env.NODE_ENV === "development") {
    console.log("📊 GA Page View:", url);
  }
}

// 커스텀 이벤트 전송
export function trackEvent(action: string, parameters?: Record<string, string | number | boolean>): void {
  if (typeof window !== "undefined" && window.gtag && isGAEnabled()) {
    window.gtag("event", action, parameters);
  } else if (process.env.NODE_ENV === "development") {
    console.log("📊 GA Event:", action, parameters);
  }
}

// 블로그 특화 이벤트들
export const blogEvents = {
  // 포스트 조회
  viewPost: (postId: string, category?: string, title?: string) => {
    trackEvent("view_post", {
      post_id: postId,
      ...(category && { category }),
      ...(title && { post_title: title }),
      content_type: "blog_post"
    });
  },

  // 포스트 읽기 완료 (스크롤 기반)
  completeReading: (postId: string, readingTime?: number) => {
    trackEvent("complete_reading", {
      post_id: postId,
      ...(readingTime && { reading_time: readingTime }),
      engagement_type: "full_read"
    });
  },

  // 카테고리 탐색
  viewCategory: (category: string) => {
    trackEvent("view_category", {
      category: category,
      content_type: "category_page"
    });
  },

  // 검색 사용
  search: (searchTerm: string, resultsCount?: number) => {
    trackEvent("search", {
      search_term: searchTerm,
      ...(resultsCount && { results_count: resultsCount })
    });
  },

  // 공유 이벤트
  sharePost: (postId: string, method: string) => {
    trackEvent("share", {
      content_type: "blog_post",
      content_id: postId,
      method: method
    });
  },

  // 테마 변경
  changeTheme: (theme: string) => {
    trackEvent("change_theme", {
      theme: theme,
      customization_type: "theme"
    });
  },

  // 외부 링크 클릭
  clickExternalLink: (url: string, linkText?: string) => {
    trackEvent("click", {
      link_url: url,
      ...(linkText && { link_text: linkText }),
      link_type: "external"
    });
  }
};

// 스크롤 깊이 추적
export function trackScrollDepth(postId: string, depth: number): void {
  const depths = [25, 50, 75, 90, 100];
  const nearestDepth = depths.find(d => Math.abs(d - depth) <= 5);

  if (nearestDepth) {
    trackEvent("scroll", {
      post_id: postId,
      scroll_depth: nearestDepth,
      engagement_type: "scroll_depth"
    });
  }
}

// 읽기 시간 추적
export function trackReadingTime(postId: string, seconds: number): void {
  // 30초, 1분, 2분, 5분 단위로 추적
  const milestones = [30, 60, 120, 300];
  const milestone = milestones.find(m => Math.abs(m - seconds) <= 5);

  if (milestone) {
    trackEvent("reading_time", {
      post_id: postId,
      time_spent: milestone,
      engagement_type: "time_milestone"
    });
  }
}
