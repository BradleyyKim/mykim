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
  fetchPostsByTag,
} from "./api";

export type { Post, Category, Tag, FeaturedImage, PaginationResult } from "../../types/post";
