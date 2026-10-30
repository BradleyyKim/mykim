"use client";

import { useState } from "react";
import Link from "next/link";
import type { Tag, Post, PaginationResult } from "@/lib/types/post";
import { Pagination } from "@/components/blog";
import PostRow from "@/components/blog/PostRow";
import { getLocalePath, t } from "@/i18n";
import type { Locale } from "@/i18n";
import { pad2 } from "@/lib/format";

interface TagDetailPageClientProps {
  tag: Tag;
  initialPosts: PaginationResult<Post>;
  locale?: Locale;
}

export default function TagDetailPageClient({ tag, initialPosts, locale = "ko" }: TagDetailPageClientProps) {
  const [posts, setPosts] = useState<PaginationResult<Post>>(initialPosts);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handlePageChange = async (page: number) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const response = await fetch(`/api/tags/posts?name=${encodeURIComponent(tag.name || "")}&page=${page}&locale=${locale}`);
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

  return (
    <div className="page py-10 sm:py-14">
      <header className="max-w-[60ch]">
        <p className="eyebrow">
          <Link href={getLocalePath(locale, "/tags")} className="hover:text-foreground">
            {t(locale, "tags.title")}
          </Link>{" "}
          · {pad2(posts.pagination.total)} posts
        </p>
        <h1 className="t-title mt-3 text-foreground">#{tag.name}</h1>
      </header>

      <div className="mt-10">
        {posts.data.length ? (
          <ol className="divide-y divide-border">
            {posts.data.map((post, i) => (
              <PostRow
                key={post.id}
                locale={locale}
                index={(currentPage - 1) * posts.pagination.pageSize + i + 1}
                post={{
                  title: post.title,
                  slug: post.slug,
                  description: post.description,
                  publishedDate: post.publishedDate || post.createdAt,
                  readingMinutes: post.readingMinutes,
                  tags: post.tags,
                  category: post.category
                }}
              />
            ))}
          </ol>
        ) : (
          <p className="t-small">{t(locale, "tags.notFoundDesc")}</p>
        )}
        <Pagination currentPage={currentPage} totalPages={posts.pagination.pageCount} onPageChange={handlePageChange} isLoading={isLoading} />
      </div>
    </div>
  );
}
