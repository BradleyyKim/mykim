/**
 * Server API exports
 * 서버 사이드에서 사용하는 API 호출 함수들
 */
export {
  fetchPosts,
  fetchPaginatedPosts,
  fetchPostsClient,
  fetchPostById,
  fetchPostByIdClient,
  fetchCategories,
  fetchPostsByCategory,
  fetchCategoryBySlug,
  type Post,
  type Category,
  type Tag,
  type FeaturedImage,
  type PaginationResult
} from "./api";

// StrapiResponse는 internal 타입이므로 별도로 export
export type { StrapiResponse } from "./api";
