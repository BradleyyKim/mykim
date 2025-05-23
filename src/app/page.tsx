import { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { getCategorySlug, getCategoryName, getFirstEmojiOrString } from "@/lib/utils";
import { fetchPaginatedPosts } from "@/lib/api";

export const metadata: Metadata = {
  title: "My Kim Blog",
  description: "프로그래밍, 웹 개발, 그리고 더 많은 주제에 대한 블로그"
};

// 메인 페이지 컴포넌트
export default function HomePage({
  searchParams
}: {
  searchParams: {
    year?: string;
  };
}) {
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
      <HomePageContent yearFilter={searchParams.year} />
    </Suspense>
  );
}

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
    }>;
    totalCount: number;
  };
};

// 콘텐츠를 별도 컴포넌트로 분리하여 비동기 작업 처리
async function HomePageContent({ yearFilter }: { yearFilter?: string }) {
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

  // 나머지 처리 로직 (정렬, 제한 등)
  filteredYears.forEach(year => {
    // 기존 로직: 날짜 정렬, totalCount 설정 등
    postsByYear[year].posts.sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());
    // 원래 게시물 수 저장
    const totalCount = postsByYear[year].posts.length;
    // 필터링 로직
    if (!yearFilter || year !== yearFilter) {
      postsByYear[year].posts = postsByYear[year].posts.slice(0, 5);
    }
    postsByYear[year].totalCount = totalCount;
  });

  // 연도 필터가 있는 경우 해당 연도만 표시 (필터링된 연도 목록 사용)
  const yearsToDisplay = yearFilter ? filteredYears.filter(year => year === yearFilter) : filteredYears;

  return (
    <div className="container mx-auto px-4 py-12">
      {/* 연도별 게시물 묶음 */}
      <div className="space-y-16">
        {yearsToDisplay.map(year => (
          <div key={year} className="year-section">
            <div className="flex flex-col md:flex-row gap-8">
              {/* 연도 정보 (좌측 또는 상단) */}
              <div className="w-full md:w-1/4 mb-6 md:mb-0">
                <div className="sticky top-20">
                  <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{year}</h3>
                  {/* 추가 게시물이 있는 경우 "모든 게시물 보기" 링크 표시 */}
                  {!yearFilter && postsByYear[year].totalCount > 5 && (
                    <Link href={`/?year=${year}`} className="mt-2 inline-block text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:underline">
                      All ({postsByYear[year].totalCount.toLocaleString()} posts)
                    </Link>
                  )}
                </div>
              </div>
              {/* 해당 연도의 게시물 목록 (우측 또는 하단) */}
              <div className="w-full md:w-3/4">
                <div className="space-y-6">
                  {postsByYear[year].posts.map(post => {
                    const postCategorySlug = getCategorySlug(post.category);
                    const categoryName = getCategoryName(post.category);
                    return (
                      <article key={post.id} className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700 last:border-0 transition-all hover:translate-x-1">
                        <Link href={postCategorySlug ? `/category/${postCategorySlug}/${post.slug}` : `/posts/${post.slug}`} className="block group">
                          <div className="flex justify-between items-start">
                            <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 group-hover:text-gray-600 dark:group-hover:text-gray-300">{post.title}</h2>
                            {categoryName && (
                              <div className="ml-4 flex-shrink-0 dark:bg-gray-800 rounded-full px-3 py-1 text-sm text-gray-800 dark:text-gray-200">{getFirstEmojiOrString(categoryName)}</div>
                            )}
                          </div>
                        </Link>
                      </article>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Next.js에게 정적 생성 페이지로 설정하고 주기적으로 재검증하도록 설정
export const revalidate = 300; // 5분
