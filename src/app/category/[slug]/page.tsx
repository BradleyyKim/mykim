import { Metadata } from "next";
import { getCategoryData } from "@/lib/cms";
import Link from "next/link";
import { NotFound as CategoryNotFound } from "@/components/ui";
import { Button } from "@/components/ui/button";
import PaginationWrapper from "@/components/blog/PaginationWrapper";
import { formatDate } from "date-fns";
import CategoryAnalytics from "@/components/analytics/CategoryAnalytics";
import { MAIN } from "@/lib/constants";
import { getRevalidateTime } from "@/lib/cache/revalidate-config";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

// ISR 설정 - 중앙화된 설정 사용
export const revalidate = getRevalidateTime("CATEGORY");

// 카테고리 메타데이터 생성
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const categoryData = await getCategoryData(slug);

  if (!categoryData) {
    return {
      title: "카테고리를 찾을 수 없습니다"
    };
  }

  const { category } = categoryData;
  const title = `${category.name} - ${MAIN.title}`;
  const description = category.description || `${category.name} 카테고리의 글 목록입니다.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `${MAIN.url}/category/${category.slug}`,
      siteName: MAIN.title
    },
    twitter: {
      card: "summary",
      title,
      description
    },
    alternates: {
      canonical: `${MAIN.url}/category/${category.slug}`
    }
  };
}

export default async function CategoryPage({ params }: Props) {
  // 1. URL 파라미터에서 데이터 추출
  const { slug } = await params;

  // 2. 카테고리 데이터 가져오기
  const categoryData = await getCategoryData(slug);

  // 3. 데이터가 없으면 404 페이지 표시
  if (!categoryData) {
    return <CategoryNotFound />;
  }

  // 4. 카테고리 데이터 추출
  const { category, posts, pagination } = categoryData;

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Google Analytics 카테고리 추적 */}
      <CategoryAnalytics categoryName={category.name} />

      <div className="space-y-16">
        <div className="category-section">
          <div className="flex flex-col md:flex-row gap-8">
            {/* 카테고리 정보 (왼쪽) */}
            <div className="w-full md:w-1/4 mb-6 md:mb-0">
              <div className="sticky top-20">
                <div className="relative group">
                  <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2 cursor-help">
                    {category.name}
                  </h1>
                  {category.description && (
                    <div className="absolute left-0 top-full mt-3 w-72 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-20 transform translate-y-1 group-hover:translate-y-0">
                      <div className="absolute -top-2 left-6 w-4 h-4 bg-white dark:bg-gray-800 border-l border-t border-gray-200 dark:border-gray-700 rotate-45"></div>
                      <div className="relative">
                        <div className="font-medium text-gray-900 dark:text-gray-100 mb-1">카테고리 설명</div>
                        <div className="text-gray-600 dark:text-gray-400 leading-relaxed">{category.description}</div>
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {pagination.total.toLocaleString()} posts
                </p>
              </div>
            </div>

            {/* 포스트 리스트 (오른쪽) */}
            <div className="w-full md:w-3/4">
              {posts.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">포스트가 없습니다</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    &ldquo;{category.name}&rdquo; 카테고리에 아직 포스트가 없습니다.
                  </p>
                  <Link href="/" passHref>
                    <Button variant="outline">다른 글 보러가기</Button>
                  </Link>
                </div>
              ) : (
                <>
                  <div className="space-y-6">
                    {posts.map(post => {
                      const formattedDate = formatDate(new Date(post.createdAt), "yyyy.MM.dd HH:mm");
                      return (
                        <article
                          key={post.id}
                          className="group border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0"
                        >
                          <Link href={`/posts/${post.slug}`} className="block">
                            <div className="flex justify-between items-start gap-4">
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
                  {pagination.pageCount > 1 && (
                    <div className="flex justify-center mt-12">
                      <PaginationWrapper
                        currentPage={pagination.page}
                        totalPages={pagination.pageCount}
                        categorySlug={slug}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
