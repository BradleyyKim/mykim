import { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { PostCard, PostSkeleton, PaginationWrapper } from "@/components/blog";
import { POSTS_PER_PAGE } from "@/lib/constants";
import { getHomePageData } from "@/lib/services/post-service";
import { getCategorySlug } from "@/lib/utils";

export const metadata: Metadata = {
  title: "My Kim Blog - 홈",
  description: "프로그래밍, 웹 개발, 그리고 더 많은 주제에 대한 블로그"
};

// 메인 페이지 컴포넌트 - Suspense로 감싸서 제공
export default async function HomePage({ searchParams }: { searchParams: { page?: string; category?: string } }) {
  // searchParams를 직접 사용
  const currentPage = Number(searchParams.page) || 1;
  const categorySlug = searchParams.category;

  // 비동기 컨텍스트에서 Home Page Content 렌더
  return (
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
      <HomePageContent page={currentPage} categorySlug={categorySlug} />
    </Suspense>
  );
}

// 콘텐츠를 별도 컴포넌트로 분리하여 비동기 작업 처리
async function HomePageContent({ page, categorySlug }: { page: number; categorySlug?: string }) {
  // 서비스 레이어를 통해 데이터 가져오기
  const { posts, pagination, pageTitle } = await getHomePageData(page, categorySlug);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 italic text-center">{pageTitle}</h1>
      {posts.length === 0 ? (
        <div className="text-center p-12 border rounded-lg bg-gray-50">
          <p className="text-gray-600">{categorySlug ? `이 카테고리에 해당하는 게시물이 없습니다.` : `아직 게시물이 없습니다.`}</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col space-y-6">
            {posts.map(post => {
              const postCategorySlug = getCategorySlug(post.category);
              return (
                <div key={post.id}>
                  {postCategorySlug ? (
                    <Link href={`/category/${postCategorySlug}/${post.slug}`} className="block group">
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
          <PaginationWrapper currentPage={pagination.page} totalPages={pagination.pageCount} categorySlug={categorySlug} />
        </>
      )}
    </div>
  );
}

// Next.js에게 이 페이지를 빌드 시 정적으로 생성하지 말고 런타임에 생성하도록 알림
export const dynamic = "force-dynamic";
