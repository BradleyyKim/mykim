import { Metadata } from "next";
import { Suspense } from "react";
import { fetchPaginatedPosts } from "@/lib/api";
import { HomePageClient } from "@/components/layout";
import { getRevalidateTime } from "@/lib/cache/revalidate-config";

// ISR 설정 - 중앙화된 설정 사용
export const revalidate = getRevalidateTime("HOME");

export const metadata: Metadata = {
  title: "MYKim",
  description: "프로그래밍, 웹 개발, 그리고 더 많은 주제에 대한 블로그"
};

type PostsByYear = {
  [year: string]: {
    posts: Array<{
      id: number;
      title: string;
      slug: string;
      publishedDate: string;
      createdAt: string;
      category:
        | string
        | {
            id?: number | string;
            name?: string;
            slug?: string;
            attributes?: {
              name?: string;
              slug?: string;
              [key: string]: unknown;
            };
            data?: {
              id?: number | string;
              attributes?: {
                name?: string;
                slug?: string;
                [key: string]: unknown;
              };
              [key: string]: unknown;
            };
            [key: string]: unknown;
          }
        | null;
      tags?: Array<{
        id: number;
        name?: string;
        slug?: string;
      }>;
    }>;
    totalCount: number;
  };
};

// 메인 페이지 컴포넌트 (서버 컴포넌트)
export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/4">
              <div className="h-6 bg-gray-200 rounded-md animate-pulse mb-4 w-24"></div>
              <div className="h-6 bg-gray-200 rounded-md animate-pulse mb-4 w-20"></div>
              <div className="h-6 bg-gray-200 rounded-md animate-pulse mb-4 w-24"></div>
            </div>
            <div className="w-full md:w-3/4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="mb-6 pb-6 border-b border-gray-200 last:border-0">
                  <div className="h-7 bg-gray-200 rounded-md animate-pulse mb-2 w-3/4"></div>
                  <div className="h-5 bg-gray-200 rounded-md animate-pulse mb-4 w-1/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      }
    >
      <HomePageContentWrapper />
    </Suspense>
  );
}

// 서버 컴포넌트에서 데이터 로드
async function HomePageContentWrapper() {
  try {
    // 페이지네이션 없이 모든 게시물 가져오기 (최대 100개)
    const { data: allPosts } = await fetchPaginatedPosts(1, 100);

    // 연도별로 게시물 그룹화
    const postsByYear: PostsByYear = allPosts.reduce((acc, post) => {
      // publishedDate를 우선 사용하고, 없으면 publishedAt이나 createdAt 사용
      const postDate = new Date(post.publishedDate || post.publishedAt || post.createdAt);
      const year = postDate.getFullYear().toString();

      if (!acc[year]) {
        acc[year] = { posts: [], totalCount: 0 };
      }

      acc[year].posts.push({
        id: post.id,
        title: post.title,
        slug: post.slug,
        publishedDate: post.publishedDate || post.publishedAt || post.createdAt,
        createdAt: post.createdAt,
        category: post.category
      });

      return acc;
    }, {} as PostsByYear);

    // 연도별로 내림차순 정렬 (최신 연도가 먼저 오도록)
    const sortedYears = Object.keys(postsByYear).sort((a, b) => parseInt(b) - parseInt(a));

    // 각 연도에 포스트가 있는지 확인하고 포스트가 있는 연도만 필터링
    const filteredYears = sortedYears.filter(year => postsByYear[year].posts.length > 0);

    // 각 연도별 포스트 정렬 (제한 제거)
    filteredYears.forEach(year => {
      // 날짜별로 내림차순 정렬
      postsByYear[year].posts.sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());
      // 총 포스트 수 저장
      postsByYear[year].totalCount = postsByYear[year].posts.length;
      // 제한 제거 - 모든 포스트 표시
    });

    return <HomePageClient postsByYear={postsByYear} filteredYears={filteredYears} />;
  } catch (error) {
    console.warn("Failed to fetch posts for homepage:", error);

    // 빌드 시점에서 API 호출 실패 시 빈 데이터 반환
    const emptyPostsByYear: PostsByYear = {};
    const emptyFilteredYears: string[] = [];

    return <HomePageClient postsByYear={emptyPostsByYear} filteredYears={emptyFilteredYears} />;
  }
}

// 중복된 revalidate 선언 제거됨 - 상단에서 중앙화된 설정 사용

export type { PostsByYear };
