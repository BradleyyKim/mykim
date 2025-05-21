import { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { CalendarIcon, TagIcon } from "lucide-react";
import { getCategorySlug, getCategoryName } from "@/lib/utils";
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
    // 게시물 날짜 (publishedDate가 없으면 createdAt 사용)
    const postDate = new Date(post.publishedAt || post.createdAt);
    const year = postDate.getFullYear().toString();
    console.log("yearFilter", yearFilter);
    if (!acc[year]) {
      acc[year] = { posts: [], totalCount: 0 };
    }

    acc[year].posts.push({
      id: post.id,
      title: post.title,
      slug: post.slug,
      publishedDate: post.publishedAt || post.createdAt,
      createdAt: post.createdAt,
      category: post.category
    });

    return acc;
  }, {} as PostsByYear);

  // 연도별로 내림차순 정렬 (최신 연도가 먼저 오도록)
  const sortedYears = Object.keys(postsByYear).sort((a, b) => parseInt(b) - parseInt(a));

  // 각 연도 내에서 게시물 날짜로 내림차순 정렬 및 최근 5개만 유지 (연도 필터가 없는 경우)
  sortedYears.forEach(year => {
    postsByYear[year].posts.sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());

    // 원래 게시물 수 저장
    const totalCount = postsByYear[year].posts.length;

    // 특정 연도 필터가 없거나 현재 연도가 필터와 일치하지 않는 경우에만 최근 5개로 제한
    if (!yearFilter || year !== yearFilter) {
      postsByYear[year].posts = postsByYear[year].posts.slice(0, 5);
    }

    // 원래 게시물 수 저장
    postsByYear[year].totalCount = totalCount;
  });

  // 연도 필터가 있는 경우 해당 연도만 표시
  const yearsToDisplay = yearFilter ? sortedYears.filter(year => year === yearFilter) : sortedYears;

  return (
    <div className="container mx-auto px-4 py-12">
      {yearFilter && (
        <div className="mb-8">
          <Link href="/" className="text-gray-600 hover:text-gray-900 hover:underline flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            홈으로 돌아가기
          </Link>
          <h1 className="text-3xl font-bold mt-4">{yearFilter}</h1>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        {/* 연도 목록 (왼쪽) - 필터가 없는 경우에만 표시 */}
        {!yearFilter && (
          <div className="w-full md:w-1/4 md:h-100">
            {sortedYears.map(year => (
              <div key={year} className="mb-6 flex flex-row md:flex-col justify-between items-center md:items-start md:h-100">
                <h3 className="text-3xl font-bold text-gray-800">{year}</h3>
                {/* 추가 게시물이 있는 경우 "모든 게시물 보기" 링크 표시 */}
                {postsByYear[year].totalCount > 5 && (
                  <Link href={`/?year=${year}`} className="text-sm text-gray-600 hover:text-gray-900 hover:underline md:self-start">
                    모두 보기 ({postsByYear[year].totalCount}개)
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}

        {/* 게시물 목록 (오른쪽) */}
        <div className={`w-full ${!yearFilter ? "md:w-3/4" : ""}`}>
          {yearsToDisplay.map(year => (
            <div key={year} className="mb-12">
              <div className="space-y-6">
                {postsByYear[year].posts.map(post => {
                  const postCategorySlug = getCategorySlug(post.category);
                  const categoryName = getCategoryName(post.category);
                  const postDate = new Date(post.publishedDate);
                  const formattedDate = format(postDate, "MMM d", { locale: ko });
                  console.log("categoryName", categoryName);
                  return (
                    <article key={post.id} className="mb-6 pb-6 border-b border-gray-200 last:border-0 transition-all hover:translate-x-1">
                      <Link href={postCategorySlug ? `/category/${postCategorySlug}/${post.slug}` : `/posts/${post.slug}`} className="block group">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-medium text-gray-800 group-hover:text-gray-600">{post.title}</h3>
                          {categoryName && (
                            <div className="ml-4 flex-shrink-0 bg-gray-100 rounded-full px-3 py-1 text-sm text-gray-700">
                              <TagIcon className="inline-block h-3.5 w-3.5 mr-1" />
                              {categoryName}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <CalendarIcon className="mr-1 h-4 w-4" />
                          <time dateTime={post.publishedDate}>{formattedDate}</time>
                        </div>
                      </Link>
                    </article>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Next.js에게 이 페이지를 빌드 시 정적으로 생성하지 말고 런타임에 생성하도록 알림
export const dynamic = "force-dynamic";
