import { fetchPaginatedPosts, fetchPostsByCategory, fetchCategoryBySlug } from "@/lib/api";
import { getPostBySlugLocal } from "@/lib/mdx";
import type { Post, PaginationResult } from "@/lib/types/post";
import type { Locale } from "@/i18n";

export async function getHomePageData(
  page: number = 1,
  categorySlug?: string,
  locale: Locale = "ko"
): Promise<{
  posts: Post[];
  pagination: PaginationResult<Post>["pagination"];
  pageTitle: string;
  categoryName: string;
}> {
  let categoryName = "";

  if (categorySlug) {
    const categoryInfo = await fetchCategoryBySlug(categorySlug, locale);
    if (categoryInfo) {
      categoryName = categoryInfo.name;
    }
  }

  const postsData = categorySlug
    ? await fetchPostsByCategory(categorySlug, page, locale)
    : await fetchPaginatedPosts(page, undefined, locale);

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

export async function getPostBySlug(slug: string, locale: Locale = "ko"): Promise<Post | null> {
  return getPostBySlugLocal(slug, locale);
}

export async function getCategoryData(slug: string, locale: Locale = "ko") {
  try {
    const category = await fetchCategoryBySlug(slug, locale);
    if (!category) return null;

    const postsData = await fetchPostsByCategory(slug, undefined, locale);

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
