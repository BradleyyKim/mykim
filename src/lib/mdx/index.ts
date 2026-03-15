import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Post, Tag, Category, PaginationResult } from "@/lib/types/post";

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");
const CATEGORIES_FILE = path.join(process.cwd(), "content", "categories.json");

interface PostFrontmatter {
  title: string;
  slug: string;
  description?: string;
  publishedDate?: string;
  category?: string;
  tags?: string[];
  featuredImage?: string;
}

/**
 * Read all MDX files and parse frontmatter + content
 */
function getAllPostFiles(): { frontmatter: PostFrontmatter; content: string; filePath: string }[] {
  if (!fs.existsSync(CONTENT_DIR)) {
    return [];
  }

  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

  return files
    .map((filename) => {
      const filePath = path.join(CONTENT_DIR, filename);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(fileContent);

      return {
        frontmatter: data as PostFrontmatter,
        content,
        filePath,
      };
    })
    .filter((post) => post.frontmatter.title && post.frontmatter.slug);
}

/**
 * Convert parsed MDX file to Post type
 */
function toPost(
  parsed: { frontmatter: PostFrontmatter; content: string },
  index: number
): Post {
  const { frontmatter, content } = parsed;
  const now = new Date().toISOString();
  const publishedDate = frontmatter.publishedDate || now;

  const categories = getCategories();
  const matchedCategory = categories.find((c) => c.slug === frontmatter.category) || null;

  return {
    id: index + 1,
    documentId: frontmatter.slug,
    title: frontmatter.title,
    slug: frontmatter.slug,
    content,
    description: frontmatter.description || null,
    featuredImage: frontmatter.featuredImage
      ? { url: frontmatter.featuredImage }
      : null,
    publishedDate,
    postStatus: "published",
    createdAt: publishedDate,
    updatedAt: publishedDate,
    publishedAt: publishedDate,
    tags: (frontmatter.tags || []).map((name, i) => ({
      id: i + 1,
      name,
    })),
    category: matchedCategory,
  };
}

/**
 * Get all posts sorted by publishedDate desc
 */
export function getAllPosts(): Post[] {
  const files = getAllPostFiles();

  return files
    .map((file, i) => toPost(file, i))
    .sort((a, b) => {
      const dateA = new Date(a.publishedDate || a.createdAt).getTime();
      const dateB = new Date(b.publishedDate || b.createdAt).getTime();
      return dateB - dateA;
    });
}

/**
 * Get paginated posts
 */
export function getPaginatedPosts(page: number = 1, pageSize: number = 10): PaginationResult<Post> {
  const allPosts = getAllPosts();
  const total = allPosts.length;
  const pageCount = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const data = allPosts.slice(start, start + pageSize);

  return {
    data,
    pagination: { page, pageSize, pageCount, total },
  };
}

/**
 * Get a single post by slug
 */
export function getPostBySlugLocal(slug: string): Post | null {
  const files = getAllPostFiles();
  const found = files.find((f) => f.frontmatter.slug === slug);
  if (!found) return null;
  return toPost(found, 0);
}

/**
 * Get all categories from categories.json
 */
export function getCategories(): Category[] {
  try {
    if (!fs.existsSync(CATEGORIES_FILE)) return [];
    const raw = fs.readFileSync(CATEGORIES_FILE, "utf-8");
    const categories = JSON.parse(raw) as Array<{ name: string; slug: string; description?: string }>;
    return categories.map((c, i) => ({
      id: i + 1,
      name: c.name,
      slug: c.slug,
      description: c.description,
    }));
  } catch {
    return [];
  }
}

/**
 * Get a single category by slug
 */
export function getCategoryBySlugLocal(slug: string): Category | null {
  return getCategories().find((c) => c.slug === slug) || null;
}

/**
 * Get posts filtered by category slug
 */
export function getPostsByCategory(categorySlug: string, page: number = 1, pageSize: number = 10): PaginationResult<Post> {
  const allPosts = getAllPosts().filter((p) => p.category?.slug === categorySlug);
  const total = allPosts.length;
  const pageCount = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const data = allPosts.slice(start, start + pageSize);

  return {
    data,
    pagination: { page, pageSize, pageCount, total },
  };
}

/**
 * Get all unique tags from all posts
 */
export function getAllTags(): Tag[] {
  const allPosts = getAllPosts();
  const tagMap = new Map<string, Tag>();

  allPosts.forEach((post) => {
    post.tags.forEach((tag) => {
      if (!tagMap.has(tag.name)) {
        tagMap.set(tag.name, { id: tagMap.size + 1, name: tag.name });
      }
    });
  });

  return Array.from(tagMap.values()).sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Get a single tag by name
 */
export function getTagByName(name: string): Tag | null {
  return getAllTags().find((t) => t.name === name) || null;
}

/**
 * Get posts filtered by tag name
 */
export function getPostsByTag(tagName: string, page: number = 1, pageSize: number = 10): PaginationResult<Post> {
  const allPosts = getAllPosts().filter((p) => p.tags.some((t) => t.name === tagName));
  const total = allPosts.length;
  const pageCount = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const data = allPosts.slice(start, start + pageSize);

  return {
    data,
    pagination: { page, pageSize, pageCount, total },
  };
}
