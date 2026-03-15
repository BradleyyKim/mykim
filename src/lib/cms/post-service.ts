import { fetchPaginatedPosts, fetchPostsByCategory, fetchCategoryBySlug } from "@/lib/api";
import { getPostBySlugLocal } from "@/lib/mdx";
import type { Post, PaginationResult } from "@/lib/types/post";

export async function getHomePageData(
  page: number = 1,
  categorySlug?: string
): Promise<{
  posts: Post[];
  pagination: PaginationResult<Post>["pagination"];
  pageTitle: string;
  categoryName: string;
}> {
  let categoryName = "";

  if (categorySlug) {
    const categoryInfo = await fetchCategoryBySlug(categorySlug);
    if (categoryInfo) {
      categoryName = categoryInfo.name;
    }
  }

  const postsData = categorySlug
    ? await fetchPostsByCategory(categorySlug, page)
    : await fetchPaginatedPosts(page);

  const pageTitle = categoryName
    ? categoryName
    : categorySlug
      ? `${categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1)} Posts`
      : "Posts";

  return {
    posts: postsData.data,
    pagination: postsData.pagination,
    pageTitle,
    categoryName,
  };
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  return getPostBySlugLocal(slug);
}

export async function getCategoryData(slug: string) {
  try {
    const category = await fetchCategoryBySlug(slug);
    if (!category) return null;

    const postsData = await fetchPostsByCategory(slug);

    return {
      category,
      posts: postsData.data,
      pagination: postsData.pagination,
    };
  } catch (error) {
    console.error("Error fetching category data:", error);
    return null;
  }
}
