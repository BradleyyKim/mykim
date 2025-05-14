"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CalendarIcon, ChevronLeft, ChevronRight, TagIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { Post as PostType } from "@/lib/api";
import { useRouter, useSearchParams } from "next/navigation";
import { API_ENDPOINTS, POSTS_PER_PAGE } from "@/lib/constants";

// Strapi 관계 필드 타입 정의
interface StrapiAttribute {
  name?: string;
  slug?: string;
  [key: string]: unknown;
}

interface StrapiData {
  id?: number | string;
  attributes?: StrapiAttribute;
  name?: string;
  slug?: string;
  [key: string]: unknown;
}

interface StrapiRelation {
  data?: StrapiData | null;
  [key: string]: unknown;
}

export default function HomePageContent() {
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
      const res = await fetch(`${API_ENDPOINTS.POSTS}?sort=createdAt:desc&populate=*&pagination[page]=${page}&pagination[pageSize]=${POSTS_PER_PAGE}`, {
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

  // 카테고리 표시를 위한 헬퍼 함수
  const getCategoryName = (category: unknown): string | null => {
    if (!category) return null;

    // Strapi의 관계 데이터 형식에 맞춰 처리
    // 1. category가 직접 객체로 제공되는 경우 (populate로 가져온 경우)
    if (typeof category === "object" && category !== null) {
      // Strapi v4 형식: category.data.attributes
      if ("data" in category) {
        const relation = category as StrapiRelation;
        if (relation.data && typeof relation.data === "object") {
          const data = relation.data;
          if (data.attributes) {
            return data.attributes.name || data.attributes.slug || null;
          }
          return data.name || data.slug || null;
        }
        return null;
      }

      // 일반 객체 형식: category.name 또는 category.attributes.name
      const categoryObj = category as Record<string, unknown>;
      if (categoryObj.attributes && typeof categoryObj.attributes === "object") {
        const attributes = categoryObj.attributes as StrapiAttribute;
        return attributes.name || attributes.slug || JSON.stringify(category);
      }
      if (typeof categoryObj.name === "string") {
        return categoryObj.name;
      }
      if (typeof categoryObj.slug === "string") {
        return categoryObj.slug;
      }
      return JSON.stringify(category);
    }

    // 문자열로 제공되는 경우 (id나 slug)
    return String(category);
  };
  console.log("posts", posts);
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
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
          <div className="flex flex-col space-y-6">
            {posts.map(post => {
              const categoryName = getCategoryName(post.category);

              return (
                <Link key={post.id} href={`/posts/${post.slug}`} className="block group">
                  <article className="border rounded-lg overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col hover:border-blue-200 dark:hover:border-blue-800">
                    <div className="p-6">
                      <h2 className="text-2xl font-bold mb-3 group-hover:text-blue-600 transition-colors duration-200">{post.title}</h2>

                      <div className="flex items-center text-gray-500 text-sm mb-4">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        <time dateTime={post.createdAt}>
                          {formatDistanceToNow(new Date(post.createdAt), {
                            addSuffix: true,
                            locale: ko
                          })}
                        </time>

                        {categoryName && (
                          <div className="flex items-center ml-4">
                            <TagIcon className="h-4 w-4 mr-1" />
                            <span className="text-sm text-gray-600">{categoryName}</span>
                          </div>
                        )}
                      </div>

                      <p className="text-gray-600 mb-3 line-clamp-3">{post.description || post.content.substring(0, 240)}...</p>

                      <div className="text-blue-600 font-medium text-sm group-hover:underline mt-2">자세히 보기</div>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-10">
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
