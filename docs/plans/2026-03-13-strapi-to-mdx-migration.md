# Strapi → MDX + Cloudinary Migration Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace Strapi CMS backend with local MDX file-based content and Cloudinary for images, making the blog a pure static Next.js site deployed on Vercel.

**Architecture:** MDX files in `content/blog/` provide post content via `gray-matter` frontmatter parsing. `react-markdown` (already installed) renders markdown to HTML. Categories and tags are derived from frontmatter. Cloudinary hosts all images. All Strapi-dependent code (auth, write/edit pages, API routes, TipTap editor) is deleted.

**Tech Stack:** Next.js 15 (App Router, SSG), gray-matter, react-markdown, remark-gfm, rehype-raw, rehype-highlight, Cloudinary, Tailwind CSS, shadcn/ui

---

## Task 1: Install New Dependencies & Create Content Directory

**Files:**
- Modify: `package.json`
- Create: `content/blog/.gitkeep`
- Create: `content/categories.json`

**Step 1: Install gray-matter and rehype plugins**

```bash
cd /Users/mykim/Documents/Projects/mykim-blog-front
npm install gray-matter rehype-raw rehype-highlight
```

Note: `react-markdown` and `remark-gfm` are already installed.

**Step 2: Create content directory structure**

```bash
mkdir -p content/blog
```

**Step 3: Create categories.json**

Create `content/categories.json`:
```json
[
  {
    "name": "Development",
    "slug": "development",
    "description": "개발 관련 포스트"
  }
]
```

Note: The user will populate this with their actual Strapi categories later.

**Step 4: Create a sample MDX file for testing**

Create `content/blog/sample-post.mdx`:
```markdown
---
title: "샘플 포스트"
slug: "sample-post"
description: "MDX 마이그레이션 테스트 포스트입니다."
publishedDate: "2026-03-13"
category: "development"
tags: ["test", "migration"]
featuredImage: ""
---

## 마이그레이션 테스트

이 포스트는 MDX 기반 블로그가 정상 작동하는지 확인하기 위한 테스트 포스트입니다.

### 코드 블록 테스트

```typescript
const greeting = "Hello, MDX!";
console.log(greeting);
```

### 이미지 테스트

이미지는 Cloudinary URL을 사용합니다.

### 리스트 테스트

- 항목 1
- 항목 2
- 항목 3
```

**Step 5: Commit**

```bash
git add content/ package.json package-lock.json
git commit -m "feat: add MDX infrastructure dependencies and content directory"
```

---

## Task 2: Create MDX Data Layer

Replace Strapi API calls with local file-based content reading.

**Files:**
- Create: `src/lib/mdx/index.ts` (core MDX reading functions)
- Modify: `src/lib/api/server/api.ts` (complete rewrite)
- Modify: `src/lib/api/server/index.ts` (update exports)

**Step 1: Create `src/lib/mdx/index.ts`**

This is the core data layer that reads MDX files from the filesystem.

```typescript
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

  // Load categories to find matching category
  const categories = getCategories();
  const matchedCategory = categories.find((c) => c.slug === frontmatter.category) || null;

  return {
    id: index + 1,
    documentId: frontmatter.slug,
    title: frontmatter.title,
    slug: frontmatter.slug,
    content, // raw markdown string
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
```

**Step 2: Rewrite `src/lib/api/server/api.ts`**

Replace all Strapi fetch calls with local MDX functions:

```typescript
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
  // In MDX system, use slug as ID
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
```

**Step 3: Update `src/lib/api/server/index.ts`**

Remove `StrapiResponse` type export:

```typescript
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
```

**Step 4: Commit**

```bash
git add src/lib/mdx/ src/lib/api/server/
git commit -m "feat: replace Strapi API calls with local MDX file reading"
```

---

## Task 3: Update CMS Service Layer

**Files:**
- Modify: `src/lib/cms/post-service.ts` (remove Strapi direct calls)
- Delete: `src/lib/cms/strapi-utils.ts`
- Modify: `src/lib/cms/index.ts`
- Modify: `src/lib/utils.ts` (remove strapi-utils re-export)

**Step 1: Rewrite `src/lib/cms/post-service.ts`**

```typescript
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
```

**Step 2: Delete `src/lib/cms/strapi-utils.ts`**

```bash
rm src/lib/cms/strapi-utils.ts
```

**Step 3: Update `src/lib/cms/index.ts`**

```typescript
export * from "./post-service";
```

**Step 4: Update `src/lib/utils.ts`**

Remove strapi-utils re-exports. The file becomes:

```typescript
export { cn, getFirstEmojiOrString } from "./ui";
export { stripHtml } from "./content";
```

**Step 5: Commit**

```bash
git add src/lib/cms/ src/lib/utils.ts
git commit -m "refactor: update CMS service layer for MDX, remove strapi-utils"
```

---

## Task 4: Replace Content Rendering Pipeline

Replace TipTap JSON rendering with Markdown rendering.

**Files:**
- Modify: `src/lib/content/editor/tiptap-renderer.ts` (complete rewrite)
- Modify: `src/components/blog/PostDetail.tsx` (use react-markdown)
- Modify: `src/lib/content/index.ts` (update exports if needed)

**Step 1: Rewrite `src/lib/content/editor/tiptap-renderer.ts`**

Replace TipTap rendering with simple markdown text extraction (for SEO, RSS):

```typescript
/**
 * Content utilities for MDX-based blog
 * Replaces TipTap JSON rendering with markdown text extraction
 */

/**
 * For MDX posts, content is raw markdown.
 * Rendering is done by react-markdown in PostDetail component.
 * This function is kept for backward compatibility but is no longer
 * the primary rendering path.
 */
export function renderTiptapContent(content: string | object): string {
  // In MDX mode, content is already markdown string
  if (typeof content === "string") {
    return content;
  }
  return String(content);
}

/**
 * Extract plain text from markdown content for SEO descriptions
 */
export function extractPlainText(content: string | object, maxLength: number = 160): string {
  try {
    const text = typeof content === "string" ? content : String(content);

    const plainText = text
      // Remove markdown headings
      .replace(/^#{1,6}\s+/gm, "")
      // Remove markdown bold/italic
      .replace(/\*{1,3}(.*?)\*{1,3}/g, "$1")
      // Remove markdown links
      .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
      // Remove markdown images
      .replace(/!\[([^\]]*)\]\([^)]*\)/g, "")
      // Remove code blocks
      .replace(/```[\s\S]*?```/g, "")
      // Remove inline code
      .replace(/`([^`]*)`/g, "$1")
      // Remove HTML tags
      .replace(/<[^>]*>/g, "")
      // Remove frontmatter (if accidentally included)
      .replace(/^---[\s\S]*?---/m, "")
      // Collapse whitespace
      .replace(/\s+/g, " ")
      .trim();

    return plainText.length > maxLength
      ? plainText.substring(0, maxLength) + "..."
      : plainText;
  } catch {
    return typeof content === "string" ? content.substring(0, maxLength) : "";
  }
}

/**
 * Extract first image URL from markdown content
 */
export function extractFirstImageFromTiptapContent(content: string | object): string | null {
  try {
    const text = typeof content === "string" ? content : String(content);

    // Match markdown image syntax: ![alt](url)
    const mdImageRegex = /!\[[^\]]*\]\(([^)]+)\)/;
    const match = text.match(mdImageRegex);
    if (match?.[1]) return match[1];

    // Match HTML img tags
    const htmlImageRegex = /<img[^>]+src="([^">]+)"/;
    const htmlMatch = text.match(htmlImageRegex);
    if (htmlMatch?.[1]) return htmlMatch[1];

    return null;
  } catch {
    return null;
  }
}
```

**Step 2: Rewrite `src/components/blog/PostDetail.tsx`**

Replace `dangerouslySetInnerHTML` with `react-markdown`:

```tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import { Badge } from "@/components/ui/badge";
import { usePostAnalytics } from "@/hooks/analytics";
import { trackPostView } from "@/lib/analytics/vercel-analytics";
import { useEffect } from "react";
import type { PostDetailProps } from "@/lib/types/post";

export default function PostDetail({
  post,
  categoryName: propCategoryName,
  categorySlug: propCategorySlug,
}: PostDetailProps) {
  const categoryName = propCategoryName || post.category?.name || "카테고리";
  const categorySlug = propCategorySlug || post.category?.slug;

  const displayDate = post.publishedDate || post.createdAt;
  const formattedDate = format(new Date(displayDate), "yyyy.MM.dd HH:mm", {
    locale: ko,
  });

  usePostAnalytics(post.slug, categoryName, post.title);

  useEffect(() => {
    trackPostView(post.slug, post.title);
  }, [post.slug, post.title]);

  return (
    <article className="container mx-auto px-4 py-8 max-w-3xl">
      <header className="mb-16">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <div className="flex items-center justify-between text-gray-500 mb-4 flex-wrap gap-4">
          <div className="flex items-center">
            <time dateTime={displayDate}>{formattedDate}</time>
          </div>

          <div className="flex items-center gap-2">
            {categoryName && categorySlug && (
              <Link href={`/category/${categorySlug}`}>
                <Badge
                  variant="outline"
                  className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                >
                  {categoryName}
                </Badge>
              </Link>
            )}
          </div>
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag) => (
              <Link
                key={tag.id}
                href={`/tags/${encodeURIComponent(tag.name || "")}`}
              >
                <Badge
                  variant="secondary"
                  className="hover:bg-blue-100 dark:hover:bg-blue-900 cursor-pointer transition-colors duration-200"
                >
                  #{tag.name}
                </Badge>
              </Link>
            ))}
          </div>
        )}
      </header>

      {post.featuredImage && post.featuredImage.url && (
        <div className="mb-8 relative aspect-video w-full overflow-hidden rounded-lg shadow-md">
          <Image
            src={post.featuredImage.url}
            alt={post.featuredImage.alternativeText || post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="prose prose-lg max-w-none post-content dark:prose-invert">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, rehypeHighlight]}
          components={{
            img: ({ src, alt, ...props }) => {
              if (!src) return null;
              return (
                <span className="block my-4">
                  <Image
                    src={src}
                    alt={alt || ""}
                    width={800}
                    height={450}
                    className="rounded-lg shadow-md max-w-full h-auto"
                    style={{ width: "100%", height: "auto" }}
                  />
                </span>
              );
            },
            a: ({ href, children, ...props }) => (
              <a
                href={href}
                className="text-blue-600 hover:text-blue-800 underline"
                target={href?.startsWith("http") ? "_blank" : undefined}
                rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
                {...props}
              >
                {children}
              </a>
            ),
            pre: ({ children, ...props }) => (
              <pre className="code-block-container" {...props}>
                {children}
              </pre>
            ),
          }}
        >
          {post.content}
        </ReactMarkdown>
      </div>
    </article>
  );
}
```

**Step 3: Commit**

```bash
git add src/lib/content/ src/components/blog/PostDetail.tsx
git commit -m "feat: replace TipTap rendering with react-markdown for MDX content"
```

---

## Task 5: Update Client Components

Remove auth dependencies and update components that fetch data client-side.

**Files:**
- Modify: `src/components/layout/HomePageClient.tsx` (remove auth/write button)
- Modify: `src/components/layout/Header.tsx` (change categories fetching)
- Modify: `src/components/layout/TagDetailPageClient.tsx` (fix client-side pagination)
- Delete: `src/components/blog/PostDetailActions.tsx` (auth-dependent edit/delete)

**Step 1: Update `src/components/layout/HomePageClient.tsx`**

Remove `useAuth` and floating write button:

```tsx
"use client";

import Link from "next/link";
import { formatDate } from "date-fns";
import type { PostsByYear } from "@/lib/types/post";

interface HomePageClientProps {
  postsByYear: PostsByYear;
  filteredYears: string[];
}

export default function HomePageClient({ postsByYear, filteredYears }: HomePageClientProps) {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="space-y-16">
        {filteredYears.map((year) => {
          const postsCount = postsByYear[year].totalCount;

          return (
            <div key={year} className="year-section">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-1/4 mb-6 md:mb-0">
                  <div className="sticky top-20">
                    <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                      {year}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {postsCount.toLocaleString()} posts
                    </p>
                  </div>
                </div>
                <div className="w-full md:w-3/4">
                  <div className="space-y-6">
                    {postsByYear[year].posts.map((post) => (
                      <article
                        key={post.id}
                        className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700 last:border-0 transition-all hover:translate-x-1"
                      >
                        <Link href={`/posts/${post.slug}`} className="block group">
                          <div className="flex justify-between items-center">
                            <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 group-hover:text-gray-600 dark:group-hover:text-gray-300">
                              {post.title}
                            </h2>
                            <div className="ml-4 flex-shrink-0 text-sm text-gray-500 dark:text-gray-400">
                              {formatDate(new Date(post.publishedDate), "yyyy.MM.dd HH:mm")}
                            </div>
                          </div>
                        </Link>
                      </article>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

**Step 2: Update `src/components/layout/Header.tsx`**

Replace client-side `fetchCategories()` API call with a static JSON import. The Header currently fetches categories from the Strapi API endpoint, but now categories live in `content/categories.json`.

Since Header is a client component, create a new API route to serve categories:

Create `src/app/api/categories/route.ts` (simplified - reads from JSON file):

```typescript
import { NextResponse } from "next/server";
import { getCategories } from "@/lib/mdx";

export async function GET() {
  const categories = getCategories();
  return NextResponse.json({ data: categories });
}
```

Then update Header.tsx - replace the `fetchCategories` import:

Change this line:
```typescript
import { Category, fetchCategories } from "@/lib/api";
```
To:
```typescript
import type { Category } from "@/lib/types/post";
```

And update the `loadCategories` function:
```typescript
const loadCategories = async () => {
  try {
    setIsLoadingCategories(true);
    const response = await fetch("/api/categories");
    const data = await response.json();
    const categoryData = data.data || [];

    if (categoryData.length > 0) {
      setCategories(categoryData);
    }
  } catch (error) {
    console.error("카테고리 로드 중 오류 발생:", error);
  } finally {
    setIsLoadingCategories(false);
  }
};
```

**Step 3: Update `src/components/layout/TagDetailPageClient.tsx`**

Replace client-side `fetchPostsByTag` API call. Create a simple API route for tag queries:

Create `src/app/api/tags/posts/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getPostsByTag } from "@/lib/mdx";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const tagName = searchParams.get("name") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);

  const result = getPostsByTag(tagName, page);
  return NextResponse.json(result);
}
```

Update TagDetailPageClient.tsx - replace the `fetchPostsByTag` import and usage:

Change:
```typescript
import { Tag, Post, PaginationResult } from "@/lib/api";
import { fetchPostsByTag } from "@/lib/api";
```
To:
```typescript
import type { Tag, Post, PaginationResult } from "@/lib/types/post";
```

And update `handlePageChange`:
```typescript
const handlePageChange = async (page: number) => {
  if (isLoading) return;
  setIsLoading(true);
  try {
    const response = await fetch(`/api/tags/posts?name=${encodeURIComponent(tag.name || "")}&page=${page}`);
    const newPosts = await response.json();
    setPosts(newPosts);
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (error) {
    console.error("Failed to fetch posts:", error);
  } finally {
    setIsLoading(false);
  }
};
```

**Step 4: Delete `PostDetailActions.tsx`**

```bash
rm src/components/blog/PostDetailActions.tsx
```

Remove its import from `src/app/posts/[slug]/page.tsx` or `PostDetail.tsx`.
In the new PostDetail.tsx (from Task 4), PostDetailActions is already removed.

**Step 5: Update `src/components/layout/TagsPageClient.tsx`**

Change import:
```typescript
import type { Tag } from "@/lib/types/post";
```
(instead of `import { Tag } from "@/lib/api"`)

**Step 6: Commit**

```bash
git add src/components/ src/app/api/categories/ src/app/api/tags/
git commit -m "refactor: update client components to remove auth and use local data"
```

---

## Task 6: Configure Cloudinary & Update Image Settings

**Files:**
- Modify: `next.config.ts` (add Cloudinary domain, remove Strapi domain)

**Step 1: Update `next.config.ts`**

Add Cloudinary to allowed image domains and remove Strapi:

In the `images` config, add:
```typescript
images: {
  formats: ["image/webp", "image/avif"],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  minimumCacheTTL: 60 * 60 * 24 * 30,
  remotePatterns: [
    {
      protocol: "https",
      hostname: "res.cloudinary.com",
    },
  ],
},
```

**Step 2: Commit**

```bash
git add next.config.ts
git commit -m "feat: configure Cloudinary image domain in Next.js config"
```

---

## Task 7: Delete Strapi-Specific Code

Remove all auth, write, edit, admin, and Strapi API route code.

**Files to delete:**
- `src/app/write/` (entire directory)
- `src/app/edit/` (entire directory)
- `src/app/admin/` (entire directory)
- `src/app/api/auth/route.ts`
- `src/app/api/upload/` (entire directory)
- `src/app/api/posts/route.ts` (POST handler - replace with read-only)
- `src/app/api/posts/[slug]/route.ts` (PUT/DELETE handlers - replace with read-only)
- `src/app/api/admin/route.ts`
- `src/lib/auth/` (entire directory)
- `src/lib/api/client/api-client.ts`
- `src/lib/api/client/index.ts`
- `src/components/forms/PostForm.tsx`
- `src/components/forms/RichTextEditor.tsx`
- `src/hooks/editor/` (entire directory)

**Files to modify:**
- `src/app/layout.tsx` (remove AuthProvider, TanstackProvider)
- `src/lib/api/index.ts` (remove client API export)
- `src/components/blog/index.ts` (remove PostDetailActions export if present)

**Step 1: Delete directories and files**

```bash
cd /Users/mykim/Documents/Projects/mykim-blog-front

# Delete page directories
rm -rf src/app/write
rm -rf src/app/edit
rm -rf src/app/admin

# Delete API routes
rm -rf src/app/api/auth
rm -rf src/app/api/upload
rm -rf src/app/api/admin
rm -rf src/app/api/posts

# Delete auth
rm -rf src/lib/auth

# Delete client API
rm -rf src/lib/api/client

# Delete editor forms and hooks
rm -rf src/components/forms
rm -rf src/hooks/editor
```

**Step 2: Simplify API routes**

The only API routes needed are:
- `src/app/api/categories/route.ts` (created in Task 5)
- `src/app/api/tags/route.ts` (rewrite to read from MDX)
- `src/app/api/tags/posts/route.ts` (created in Task 5)
- `src/app/api/revalidate/route.ts` (keep for manual cache invalidation)

Rewrite `src/app/api/tags/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getAllTags, getTagByName } from "@/lib/mdx";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const nameFilter = searchParams.get("name");

  if (nameFilter) {
    const tag = getTagByName(nameFilter);
    return NextResponse.json({ data: tag ? [tag] : [] });
  }

  const tags = getAllTags();
  return NextResponse.json({ data: tags });
}
```

**Step 3: Update `src/app/layout.tsx`**

Remove AuthProvider and TanstackProvider (no longer needed for read-only blog):

```tsx
import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Suspense } from "react";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Header } from "@/components/layout";
import { InfoCopyRight } from "@/components/layout";
import { Toaster } from "@/components/ui/sonner";
import { getGAMeasurementId, isGAEnabled } from "@/lib/analytics";
import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider";
import { VercelAnalyticsProvider } from "@/components/providers/analytics-provider";
import { MAIN } from "@/lib/constants";

export const metadata: Metadata = {
  metadataBase: new URL(MAIN.url),
  title: {
    default: MAIN.title,
    template: `%s | ${MAIN.title}`,
  },
  description: MAIN.description,
  keywords: MAIN.keywords,
  authors: [{ name: MAIN.author }],
  creator: MAIN.author,
  publisher: MAIN.author,
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: MAIN.url,
    title: MAIN.title,
    description: MAIN.description,
    siteName: MAIN.title,
    images: [
      {
        url: MAIN.image,
        width: 1200,
        height: 630,
        alt: MAIN.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: MAIN.title,
    description: MAIN.description,
    images: [MAIN.image],
    creator: MAIN.twitter,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  other: {
    "application/rss+xml": "/rss.xml",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link
          rel="alternate"
          type="application/rss+xml"
          title="MYKim Blog RSS Feed"
          href="/rss.xml"
        />
        <link
          rel="stylesheet"
          as="style"
          crossOrigin=""
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AnalyticsProvider>
            <VercelAnalyticsProvider>
              <Suspense
                fallback={
                  <div className="h-14 border-b bg-background/95"></div>
                }
              >
                <Header />
              </Suspense>
              <main className="min-h-screen flex flex-col">
                <div className="flex-1">{children}</div>
                <InfoCopyRight />
              </main>
            </VercelAnalyticsProvider>
          </AnalyticsProvider>
        </ThemeProvider>
        <Toaster position="top-center" richColors />
        {isGAEnabled() && getGAMeasurementId() && (
          <GoogleAnalytics gaId={getGAMeasurementId()!} />
        )}
      </body>
    </html>
  );
}
```

**Step 4: Update `src/lib/api/index.ts`**

Remove client API export:

```typescript
export * from "./server";
```

**Step 5: Commit**

```bash
git add -A
git commit -m "refactor: delete Strapi auth, write, edit, admin and API route code"
```

---

## Task 8: Clean Up Types, Constants, and Dependencies

**Files:**
- Modify: `src/lib/types/post.ts` (remove Strapi-specific types)
- Modify: `src/lib/constants.ts` (remove Strapi API endpoints)
- Modify: `package.json` (remove TipTap and unused dependencies)
- Modify: `src/lib/query/tanstack-query.tsx` (simplify or delete)
- Delete: `src/lib/content/slug-utils.ts` (only used in write page)

**Step 1: Clean up `src/lib/types/post.ts`**

Remove Strapi-specific types:

```typescript
// 1. Basic entity types
export interface Tag {
  id: number;
  name: string;
  slug?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export interface FeaturedImage {
  url: string;
  width?: number;
  height?: number;
  alternativeText?: string;
  caption?: string;
}

// 2. Core Post type
export interface Post {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  content: string;
  description: string | null;
  featuredImage: FeaturedImage | null;
  publishedDate: string | null;
  postStatus: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  tags: Tag[];
  category: Category | null;
}

// 3. Page-specific types
export interface PostListItem {
  id: number;
  title: string;
  slug: string;
  publishedDate: string;
  createdAt: string;
  category: Category | null;
  tags: Tag[];
}

export interface PostsByYear {
  [year: string]: {
    posts: PostListItem[];
    totalCount: number;
  };
}

// 4. Component Props
export interface PostDetailProps {
  post: Post;
  categoryName?: string | null;
  categorySlug?: string | null;
}

// 5. Pagination
export interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}
```

Removed: `StrapiResponse`, `PostCreateRequest`, `PostUpdateRequest`, `PostFormData`, `PostFormProps`.

**Step 2: Clean up `src/lib/constants.ts`**

Remove Strapi API endpoints:

```typescript
// 기타 상수
export const POSTS_PER_PAGE = 10;

// 재검증 시간 설정 (초 단위)
export const REVALIDATE_TIME = process.env.NODE_ENV === "development" ? 10 : 300;

export const MAIN = {
  // ... keep all MAIN config unchanged
};

export const AVATAR = {
  // ... keep all AVATAR config unchanged
};
```

Remove: `API_BASE_URL`, `API_ENDPOINTS`.

**Step 3: Delete or simplify `src/lib/query/tanstack-query.tsx`**

If TanStack Query is no longer used (no mutations, no client-side data fetching that needs caching), delete it. Check if any remaining component uses `useQuery`.

If only TagDetailPageClient uses simple fetch, TanStack Query can be removed entirely:

```bash
rm src/lib/query/tanstack-query.tsx
```

And remove TanstackProvider from layout (already done in Task 7).

Check for `src/lib/query/index.ts` and remove exports.

**Step 4: Delete unused content utilities**

```bash
rm src/lib/content/slug-utils.ts
```

Update `src/lib/content/index.ts`:

```typescript
export * from "./editor";
export { stripHtml } from "./text-utils";
```

**Step 5: Remove unused packages**

```bash
npm uninstall @tiptap/react @tiptap/starter-kit @tiptap/extension-code-block-lowlight @tiptap/extension-image @tiptap/extension-link @tiptap/extension-placeholder @tiptap/extension-text-align @tiptap/html @tiptap/pm @tiptap/extension-document lowlight highlight.js browser-image-compression @tanstack/react-query @tanstack/react-query-devtools react-hook-form @hookform/resolvers zod @uiw/react-md-editor
```

Note: Keep `react-markdown` and `remark-gfm` (used for rendering).

**Step 6: Update environment variables**

Create/update `.env.local`:
```
# Cloudinary (for image references in MDX)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name

# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-GT1T4JEBG9

# Site URL
NEXT_PUBLIC_SITE_URL=https://mykim.in
```

Remove from `.env` / `.env.local` / `.env.production`:
- `NEXT_PUBLIC_API_URL`
- `STRAPI_API_TOKEN`

**Step 7: Commit**

```bash
git add -A
git commit -m "chore: clean up types, constants, and remove unused dependencies"
```

---

## Task 9: Update PostDetail Page (posts/[slug]/page.tsx)

**Files:**
- Modify: `src/app/posts/[slug]/page.tsx`

**Step 1: Update imports**

Remove `extractFirstImageFromTiptapContent` usage name (function is already updated in Task 4 to handle markdown). Remove `renderTiptapContent` import if no longer used in this file.

The page.tsx uses `extractPlainText` and `extractFirstImageFromTiptapContent` - both are already updated in Task 4 to work with markdown. No changes needed to the page itself, but verify imports are correct after strapi-utils removal.

The key change: the page currently calls `getPostBySlug` which now reads from MDX. The structured data and metadata generation should work as-is since they use the same `Post` type.

Verify there's no import of deleted files (like `getCategorySlug` from utils).

**Step 2: Commit (if changes needed)**

```bash
git add src/app/posts/
git commit -m "fix: update post page imports for MDX compatibility"
```

---

## Task 10: Build & Test

**Step 1: Run TypeScript type check**

```bash
cd /Users/mykim/Documents/Projects/mykim-blog-front
npx tsc --noEmit
```

Fix any type errors that come up from removed imports/types.

**Step 2: Run build**

```bash
npm run build
```

Expected: Build succeeds with the sample-post.mdx rendering correctly.

**Step 3: Run dev server and test**

```bash
npm run dev
```

Test the following pages:
- `/` — home page shows sample post grouped by year
- `/posts/sample-post` — post detail renders markdown correctly
- `/tags` — shows "test" and "migration" tags
- `/tags/test` — shows sample post
- `/category/development` — shows sample post (if categories.json has "development")
- `/rss.xml` — generates RSS feed
- `/about` and `/career` — static pages still work

**Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete Strapi to MDX migration"
```

---

## Post-Migration Checklist (for the user)

After all code tasks are done, the user needs to:

1. **Upload images to Cloudinary** and note the URLs
2. **Convert Notion backup to MDX files** with proper frontmatter format:
   ```markdown
   ---
   title: "글 제목"
   slug: "original-strapi-slug"
   description: "설명"
   publishedDate: "2025-01-01"
   category: "category-slug"
   tags: ["tag1", "tag2"]
   featuredImage: "https://res.cloudinary.com/..."
   ---
   ```
3. **Update `content/categories.json`** with actual categories from Strapi
4. **Update Vercel environment variables** (remove Strapi, add Cloudinary if needed)
5. **Deploy to Vercel** and verify
6. **Cancel Strapi Cloud subscription**
7. **Optionally set GitHub repo to private**
