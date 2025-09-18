import { track } from "@vercel/analytics";

/**
 * Vercel Analytics 커스텀 이벤트 추적
 */

// 포스트 조회 추적
export function trackPostView(postSlug: string, postTitle: string) {
  track("post_view", {
    post_slug: postSlug,
    post_title: postTitle
  });
}

// 태그 클릭 추적
export function trackTagClick(tagName: string) {
  track("tag_click", {
    tag_name: tagName
  });
}

// 카테고리 클릭 추적
export function trackCategoryClick(categoryName: string) {
  track("category_click", {
    category_name: categoryName
  });
}

// 검색 추적
export function trackSearch(query: string, resultsCount: number) {
  track("search", {
    query,
    results_count: resultsCount
  });
}

// 포스트 작성/수정 추적
export function trackPostAction(action: "create" | "update", postSlug: string) {
  track("post_action", {
    action,
    post_slug: postSlug
  });
}

// 외부 링크 클릭 추적
export function trackExternalLink(url: string, linkText: string) {
  track("external_link_click", {
    url,
    link_text: linkText
  });
}
