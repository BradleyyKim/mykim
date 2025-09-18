"use client";

import Link from "next/link";
import { PenTool } from "lucide-react";
import { formatDate } from "date-fns";
import { useAuth } from "@/lib/auth";
import type { PostsByYear } from "@/lib/types/post";

interface HomePageClientProps {
  postsByYear: PostsByYear;
  filteredYears: string[];
}

export default function HomePageClient({ postsByYear, filteredYears }: HomePageClientProps) {
  const { isLoggedIn } = useAuth();

  return (
    <>
      <div className="container mx-auto px-4 py-12">
        {/* 연도별 게시물 묶음 */}
        <div className="space-y-16">
          {filteredYears.map(year => {
            const postsCount = postsByYear[year].totalCount;

            return (
              <div key={year} className="year-section">
                <div className="flex flex-col md:flex-row gap-8">
                  {/* 연도 정보 (좌측 또는 상단) */}
                  <div className="w-full md:w-1/4 mb-6 md:mb-0">
                    <div className="sticky top-20">
                      <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{year}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {postsCount.toLocaleString()} posts
                      </p>
                    </div>
                  </div>
                  {/* 해당 연도의 게시물 목록 (우측 또는 하단) */}
                  <div className="w-full md:w-3/4">
                    <div className="space-y-6">
                      {postsByYear[year].posts.map(post => {
                        return (
                          <article
                            key={post.id}
                            className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700 last:border-0 transition-all hover:translate-x-1"
                          >
                            {/* 게시글 제목과 날짜 */}
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
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 인증된 유저용 플로팅 Write 버튼 - footer와 겹치지 않도록 위치 조정 */}
      {isLoggedIn && (
        <Link href="/write">
          <button
            className="fixed bottom-24 right-8 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-50"
            title="새 글 작성"
          >
            <PenTool className="h-6 w-6" />
          </button>
        </Link>
      )}
    </>
  );
}
