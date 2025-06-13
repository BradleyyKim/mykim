import { Metadata } from "next";
import { getCategoryData } from "@/lib/services/post-service";
import Link from "next/link";
import { CategoryNotFound } from "@/components/NotFound";
import { Button } from "@/components/ui/button";
import PaginationWrapper from "@/components/blog/PaginationWrapper";
import { formatDate } from "date-fns";
import CategoryAnalytics from "@/components/analytics/CategoryAnalytics";
import { MAIN } from "@/lib/constants";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

// ISR 설정
export const revalidate = 300; // 5분

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
    <div className="container mx-auto px-4 py-12 ">
      {/* Google Analytics 카테고리 추적 */}
      <CategoryAnalytics categoryName={category.name} />

      <div className="mb-10">
        <h1 className="text-3xl font-bold mt-4 text-gray-800 dark:text-gray-100">{category.name}</h1>
        {category.description && <p className="text-gray-600 dark:text-gray-400 mt-2">{category.description}</p>}
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 mb-4">이 카테고리에는 아직 글이 없습니다.</p>
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
                  className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700 last:border-0 transition-all hover:translate-x-1"
                >
                  <Link href={`/posts/${post.slug}`} className="block group">
                    <div className="flex justify-between items-start">
                      <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 group-hover:text-gray-600 dark:group-hover:text-gray-300">
                        {post.title}
                      </h2>
                      <p className="text-gray-500 dark:text-gray-400">{formattedDate}</p>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
          <div className="mt-12">
            <PaginationWrapper currentPage={pagination.page} totalPages={pagination.pageCount} categorySlug={slug} />
          </div>
        </>
      )}
    </div>
  );
}
