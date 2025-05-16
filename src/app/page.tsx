import { fetchPaginatedPosts } from "@/lib/api";
import { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import PostCard from "@/components/blog/PostCard";
import PostSkeleton from "@/components/blog/PostSkeleton";
import PaginationWrapper from "@/components/blog/PaginationWrapper";
import Header from "@/components/Header";
import { POSTS_PER_PAGE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "My Kim Blog - 홈",
  description: "프로그래밍, 웹 개발, 그리고 더 많은 주제에 대한 블로그"
};

// 메인 페이지 컴포넌트 - Header는 바로 보여주고, HomePageContent만 Suspense로 감싸서 제공
export default async function HomePage({ searchParams }: { searchParams: { page?: string } }) {
  // 비동기 컨텍스트에서 Home Page Content 렌더
  return (
    <>
      <Header />
      <Suspense
        fallback={
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8 text-center">Posts</h1>
            <div className="flex flex-col space-y-6">
              {Array.from({ length: POSTS_PER_PAGE }).map((_, index) => (
                <PostSkeleton key={index} />
              ))}
            </div>
          </div>
        }
      >
        <HomePageContent searchParams={searchParams} />
      </Suspense>
    </>
  );
}

// 콘텐츠를 별도 컴포넌트로 분리하여 비동기 작업 처리
async function HomePageContent({ searchParams }: { searchParams: { page?: string } }) {
  const currentPage = Number(searchParams.page) || 1;
  const postsData = await fetchPaginatedPosts(currentPage);
  const { data: posts, pagination } = postsData;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 italic text-center">Posts</h1>
      {posts.length === 0 ? (
        <div className="text-center p-12 border rounded-lg bg-gray-50">
          <p className="text-gray-600">아직 게시물이 없습니다.</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col space-y-6">
            {posts.map(post => {
              const categorySlug = getCategorySlug(post.category);
              return (
                <div key={post.id}>
                  {categorySlug ? (
                    <Link href={`/${categorySlug}/${post.slug}`} className="block group">
                      <PostCard post={post} />
                    </Link>
                  ) : (
                    <Link href={`/posts/${post.slug}`} className="block group">
                      <PostCard post={post} />
                    </Link>
                  )}
                </div>
              );
            })}
          </div>

          <PaginationWrapper currentPage={pagination.page} totalPages={pagination.pageCount} />
        </>
      )}
    </div>
  );
}

// Next.js에게 이 페이지를 빌드 시 정적으로 생성하지 말고 런타임에 생성하도록 알림
export const dynamic = "force-dynamic";

// Strapi 관계 타입 정의
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

// 서버 컴포넌트용 카테고리 슬러그 가져오는 함수
function getCategorySlug(category: unknown): string | null {
  if (!category) return null;

  if (typeof category === "object" && category !== null) {
    // Strapi v4 형식: category.data.attributes
    if ("data" in category) {
      const relation = category as StrapiRelation;
      if (relation.data && typeof relation.data === "object") {
        const data = relation.data;
        if (data.attributes) {
          return data.attributes.slug || null;
        }
        return data.slug || null;
      }
      return null;
    }

    // 일반 객체 형식
    const categoryObj = category as Record<string, unknown>;
    if (categoryObj.attributes && typeof categoryObj.attributes === "object") {
      const attributes = categoryObj.attributes as StrapiAttribute;
      return attributes.slug || null;
    }
    if (typeof categoryObj.slug === "string") {
      return categoryObj.slug;
    }
    return null;
  }

  return null;
}
