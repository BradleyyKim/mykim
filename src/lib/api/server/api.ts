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

export async function fetchPosts(): Promise<Post[]> {
  return getAllPosts();
}

export async function fetchPaginatedPosts(page = 1, pageSize = 10): Promise<PaginationResult<Post>> {
  return getPaginatedPosts(page, pageSize);
}

export async function fetchPostsClient(): Promise<Post[]> {
  return getAllPosts();
}

export async function fetchPostById(id: string): Promise<Post | null> {
  return getPostBySlugLocal(id);
}

export async function fetchPostByIdClient(id: string): Promise<Post | null> {
  return getPostBySlugLocal(id);
}

export async function fetchCategories(): Promise<Category[]> {
  return getCategories();
}

export async function fetchPostsByCategory(categorySlug: string, page = 1): Promise<PaginationResult<Post>> {
  return getPostsByCategory(categorySlug, page);
}

export async function fetchCategoryBySlug(slug: string): Promise<Category | null> {
  return getCategoryBySlugLocal(slug);
}

export async function fetchTags(): Promise<Tag[]> {
  return getAllTags();
}

export async function fetchTagByName(name: string): Promise<Tag | null> {
  return getTagByName(name);
}

export async function fetchPostsByTag(tagName: string, page = 1): Promise<PaginationResult<Post>> {
  return getPostsByTag(tagName, page);
}
