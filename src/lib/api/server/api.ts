import {
  getAllPosts,
  getPaginatedPosts,
  getPostBySlugLocal,
  getCategories,
  getCategoryBySlugLocal,
  getPostsByCategory,
  getAllTags,
  getTagByName,
  getPostsByTag,
} from "@/lib/mdx";
import type { Post, Tag, Category, PaginationResult } from "@/lib/types/post";
import type { Locale } from "@/i18n";

export async function fetchPosts(locale: Locale = "ko"): Promise<Post[]> {
  return getAllPosts(locale);
}

export async function fetchPaginatedPosts(page = 1, pageSize = 10, locale: Locale = "ko"): Promise<PaginationResult<Post>> {
  return getPaginatedPosts(page, pageSize, locale);
}

export async function fetchPostsClient(locale: Locale = "ko"): Promise<Post[]> {
  return getAllPosts(locale);
}

export async function fetchPostById(id: string, locale: Locale = "ko"): Promise<Post | null> {
  return getPostBySlugLocal(id, locale);
}

export async function fetchPostByIdClient(id: string, locale: Locale = "ko"): Promise<Post | null> {
  return getPostBySlugLocal(id, locale);
}

export async function fetchCategories(locale: Locale = "ko"): Promise<Category[]> {
  return getCategories(locale);
}

export async function fetchPostsByCategory(categorySlug: string, page = 1, locale: Locale = "ko"): Promise<PaginationResult<Post>> {
  return getPostsByCategory(categorySlug, page, undefined, locale);
}

export async function fetchCategoryBySlug(slug: string, locale: Locale = "ko"): Promise<Category | null> {
  return getCategoryBySlugLocal(slug, locale);
}

export async function fetchTags(locale: Locale = "ko"): Promise<Tag[]> {
  return getAllTags(locale);
}

export async function fetchTagByName(name: string, locale: Locale = "ko"): Promise<Tag | null> {
  return getTagByName(name, locale);
}

export async function fetchPostsByTag(tagName: string, page = 1, locale: Locale = "ko"): Promise<PaginationResult<Post>> {
  return getPostsByTag(tagName, page, undefined, locale);
}
