"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { Post as PostType } from "@/lib/api";
import { useRouter, useSearchParams } from "next/navigation";

// 페이지당 표시할 포스트 수
const POSTS_PER_PAGE = 6;

export default function HomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? parseInt(pageParam) : 1;

  const [posts, setPosts] = useState<PostType[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // 포스트 로딩 함수
  const fetchPosts = async (page: number) => {
    setIsLoading(true);
    try {
      const STRAPI_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337/api";
      const res = await fetch(`${STRAPI_URL}/posts?sort=createdAt:desc&populate=*&pagination[page]=${page}&pagination[pageSize]=${POSTS_PER_PAGE}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
        cache: "no-store"
      });

      if (!res.ok) {
        console.error("Failed to fetch posts:", res.status);
        return;
      }

      const data = await res.json();
      setPosts(data.data || []);

      // 페이지네이션 메타데이터 설정
      if (data.meta?.pagination) {
        setTotalPages(data.meta.pagination.pageCount);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 페이지 변경 함수
  const handlePageChange = (page: number) => {
    router.push(`/?page=${page}`);
  };

  // 페이지 번호 또는 마운트 시 포스트 로드
  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Kim Blog</h1>
      </div>
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">아직 작성된 포스트가 없습니다.</p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map(post => (
              <Link key={post.id} href={`/posts/${post.slug}`} className="block group">
                <article className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200 h-full flex flex-col">
                  <div className="p-6 flex-grow">
                    <h2 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors duration-200">{post.title}</h2>

                    <p className="text-gray-600 mb-4 line-clamp-3">{post.description || post.content.substring(0, 120)}...</p>

                    <div className="flex items-center text-gray-500 text-sm">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      <time dateTime={post.createdAt}>
                        {formatDistanceToNow(new Date(post.createdAt), {
                          addSuffix: true,
                          locale: ko
                        })}
                      </time>
                    </div>
                  </div>

                  {post.category && (
                    <div className="px-6 pb-4">
                      <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-xs font-medium text-gray-700">{post.category}</span>
                    </div>
                  )}
                </article>
              </Link>
            ))}
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <Button key={page} variant={currentPage === page ? "default" : "outline"} size="sm" onClick={() => handlePageChange(page)}>
                    {page}
                  </Button>
                ))}

                <Button variant="outline" size="sm" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
}
