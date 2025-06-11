import { useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import { trackPageView, blogEvents, trackScrollDepth, trackReadingTime } from "@/lib/google-analytics";

// 페이지 조회 추적 훅
export function usePageTracking() {
  const pathname = usePathname();

  useEffect(() => {
    // 클라이언트 측에서만 실행되도록 보장
    if (typeof window !== "undefined" && pathname) {
      trackPageView(window.location.href);
    }
  }, [pathname]);
}

// 스크롤 깊이 추적 훅
export function useScrollTracking(postId?: string) {
  const lastDepthRef = useRef<number>(0);

  useEffect(() => {
    if (!postId) return;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);

      // 스크롤 깊이가 5% 이상 증가했을 때만 추적
      if (scrollPercent > lastDepthRef.current + 5) {
        lastDepthRef.current = scrollPercent;
        trackScrollDepth(postId, scrollPercent);
      }
    };

    const throttledScroll = throttle(handleScroll, 1000); // 1초마다 최대 1회
    window.addEventListener("scroll", throttledScroll);

    return () => {
      window.removeEventListener("scroll", throttledScroll);
    };
  }, [postId]);
}

// 읽기 시간 추적 훅
export function useReadingTimeTracking(postId?: string) {
  const startTimeRef = useRef<number>(Date.now());
  const lastMilestoneRef = useRef<number>(0);

  useEffect(() => {
    if (!postId) return;

    const interval = setInterval(() => {
      const currentTime = Date.now();
      const secondsElapsed = Math.round((currentTime - startTimeRef.current) / 1000);

      // 30초 이상 차이날 때만 추적
      if (secondsElapsed > lastMilestoneRef.current + 30) {
        lastMilestoneRef.current = secondsElapsed;
        trackReadingTime(postId, secondsElapsed);
      }
    }, 10000); // 10초마다 체크

    return () => clearInterval(interval);
  }, [postId]);

  // 페이지 이탈 시 최종 읽기 시간 추적
  useEffect(() => {
    if (!postId) return;

    const handleBeforeUnload = () => {
      const totalTime = Math.round((Date.now() - startTimeRef.current) / 1000);
      if (totalTime > 30) {
        // 30초 이상 머문 경우만
        blogEvents.completeReading(postId, totalTime);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [postId]);
}

// 블로그 이벤트 추적 훅
export function useBlogAnalytics() {
  return {
    // 포스트 조회 추적
    trackPostView: useCallback((postId: string, category?: string, title?: string) => {
      blogEvents.viewPost(postId, category, title);
    }, []),

    // 카테고리 조회 추적
    trackCategoryView: useCallback((category: string) => {
      blogEvents.viewCategory(category);
    }, []),

    // 검색 추적
    trackSearch: useCallback((searchTerm: string, resultsCount?: number) => {
      blogEvents.search(searchTerm, resultsCount);
    }, []),

    // 공유 추적
    trackShare: useCallback((postId: string, method: string) => {
      blogEvents.sharePost(postId, method);
    }, []),

    // 테마 변경 추적
    trackThemeChange: useCallback((theme: string) => {
      blogEvents.changeTheme(theme);
    }, []),

    // 외부 링크 클릭 추적
    trackExternalClick: useCallback((url: string, linkText?: string) => {
      blogEvents.clickExternalLink(url, linkText);
    }, [])
  };
}

// 포스트 상세 페이지용 종합 훅
export function usePostAnalytics(postId?: string, category?: string, title?: string) {
  const analytics = useBlogAnalytics();

  // 페이지 진입 시 포스트 조회 추적
  useEffect(() => {
    if (postId) {
      analytics.trackPostView(postId, category, title);
    }
  }, [postId, category, title, analytics]);

  // 스크롤과 읽기 시간 추적
  useScrollTracking(postId);
  useReadingTimeTracking(postId);

  return analytics;
}

// 유틸리티: Throttle 함수
function throttle<T extends (...args: unknown[]) => void>(func: T, delay: number): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;
  let lastExecTime = 0;

  return (...args: Parameters<T>) => {
    const currentTime = Date.now();

    if (currentTime - lastExecTime > delay) {
      func(...args);
      lastExecTime = currentTime;
    } else {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(
        () => {
          func(...args);
          lastExecTime = Date.now();
          timeoutId = null;
        },
        delay - (currentTime - lastExecTime)
      );
    }
  };
}
