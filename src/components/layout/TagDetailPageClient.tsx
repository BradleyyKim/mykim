"use client";

import { useState } from "react";
import Link from "next/link";
import { Tag, Post, PaginationResult } from "@/lib/api";
import { Pagination } from "@/components/blog";
import { fetchPostsByTag } from "@/lib/api";
import { formatDate } from "date-fns";

interface TagDetailPageClientProps {
  tag: Tag;
  initialPosts: PaginationResult<Post>;
}

export default function TagDetailPageClient({ tag, initialPosts }: TagDetailPageClientProps) {
  const [posts, setPosts] = useState<PaginationResult<Post>>(initialPosts);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handlePageChange = async (page: number) => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const newPosts = await fetchPostsByTag(tag.name || "", page);
      setPosts(newPosts);
      setCurrentPage(page);

      // 페이지 상단으로 스크롤
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* 태그 섹션 - 홈페이지 스타일 */}
      <div className="space-y-16">
        <div className="tag-section">
          <div className="flex flex-col md:flex-row gap-8">
            {/* 태그 정보 (좌측 또는 상단) */}
            <div className="w-full md:w-1/4 mb-6 md:mb-0">
              <div className="sticky top-20">
                <div className="flex items-center gap-3 mb-2">
                  {/* 태그 아이콘 */}
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                    <div className="relative">
                      <svg
                        className="w-6 h-6 text-blue-500 dark:text-blue-400"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      {/* 작은 점 표시 */}
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 dark:bg-blue-500 rounded-full"></div>
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{tag.name}</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {posts.pagination.total.toLocaleString()} posts
                </p>
              </div>
            </div>

            {/* 해당 태그의 포스트 목록 (우측 또는 하단) */}
            <div className="w-full md:w-3/4">
              {posts.data.length > 0 ? (
                <>
                  <div className="space-y-6">
                    {posts.data.map(post => {
                      const formattedDate = formatDate(new Date(post.createdAt), "yyyy.MM.dd HH:mm");

                      return (
                        <article
                          key={post.id}
                          className="group border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0"
                        >
                          <Link href={`/posts/${post.slug}`} className="block">
                            <div className="flex justify-between items-center gap-4">
                              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 flex-1">
                                {post.title}
                              </h2>
                              <p className="text-sm text-gray-500 dark:text-gray-400 flex-shrink-0">{formattedDate}</p>
                            </div>
                          </Link>
                        </article>
                      );
                    })}
                  </div>

                  {/* 페이지네이션 */}
                  {posts.pagination.pageCount > 1 && (
                    <div className="flex justify-center mt-12">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={posts.pagination.pageCount}
                        onPageChange={handlePageChange}
                        isLoading={isLoading}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">포스트가 없습니다</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    &ldquo;{tag.name}&rdquo; 태그와 관련된 포스트가 아직 없습니다.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
