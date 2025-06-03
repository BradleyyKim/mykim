import { fetchPaginatedPosts, fetchPostsByCategory, fetchCategoryBySlug, Post, PaginationResult } from "@/lib/api";
import { REVALIDATE_TIME } from "@/lib/constants";

/**
 * 홈페이지 데이터 서비스
 * - 페이지네이션 처리된 포스트 목록 가져오기
 * - 카테고리별 필터링된 포스트 목록 가져오기
 * - 카테고리 정보 가져오기
 */
export async function getHomePageData(
  page: number = 1,
  categorySlug?: string
): Promise<{
  posts: Post[];
  pagination: PaginationResult<Post>["pagination"];
  pageTitle: string;
  categoryName: string;
}> {
  // 기본값 설정
  let categoryName = "";

  // 1. 카테고리 정보 가져오기 (필요한 경우)
  if (categorySlug) {
    const categoryInfo = await fetchCategoryBySlug(categorySlug);
    if (categoryInfo) {
      categoryName = categoryInfo.name;
    }
  }

  // 2. 포스트 데이터 가져오기
  const postsData = categorySlug ? await fetchPostsByCategory(categorySlug, page) : await fetchPaginatedPosts(page);

  // 3. 페이지 제목 생성
  const pageTitle = categoryName
    ? categoryName
    : categorySlug
      ? `${categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1)} Posts` // 이름이 없을 때 fallback
      : "Posts";

  return {
    posts: postsData.data,
    pagination: postsData.pagination,
    pageTitle,
    categoryName
  };
}

/**
 * 슬러그로 포스트 가져오기
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const STRAPI_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337/api";

  try {
    const res = await fetch(`${STRAPI_URL}/posts?filters[slug][$eq]=${slug}&populate=*`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
      next: {
        revalidate: REVALIDATE_TIME,
        tags: [`post-${slug}`]
      }
    });

    if (!res.ok) {
      console.error("Failed to fetch post:", res.status);
      return null;
    }

    const data = await res.json();

    if (!data.data || data.data.length === 0) {
      return null;
    }

    return data.data[0];
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

/**
 * 카테고리 데이터 가져오기
 */
export async function getCategoryData(slug: string) {
  try {
    // 1. 카테고리 정보 가져오기
    const category = await fetchCategoryBySlug(slug);

    if (!category) {
      return null;
    }

    // 2. 이 카테고리에 속한 포스트 가져오기
    const postsData = await fetchPostsByCategory(slug);

    return {
      category,
      posts: postsData.data,
      pagination: postsData.pagination
    };
  } catch (error) {
    console.error("Error fetching category data:", error);
    return null;
  }
}
