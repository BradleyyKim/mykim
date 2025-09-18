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
  fetchTags,
  fetchTagByName,
  fetchPostsByTag
} from "./api";

// 타입들은 통합 타입 파일에서 re-export
export type { Post, Category, Tag, FeaturedImage, PaginationResult, StrapiResponse } from "../../types/post";
