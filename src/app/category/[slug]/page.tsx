import { Metadata } from "next";
import { getCategoryData } from "@/lib/services/post-service";
import PostCard from "@/components/blog/PostCard";
import Link from "next/link";
import { CategoryNotFound } from "@/components/NotFound";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import PaginationWrapper from "@/components/blog/PaginationWrapper";

type Props = {
  params: {
    slug: string;
  };
};

// 카테고리 메타데이터 생성
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;
  const categoryData = await getCategoryData(slug);

  if (!categoryData) {
    return {
      title: "카테고리를 찾을 수 없습니다"
    };
  }

  return {
    title: `${categoryData.category.name} - 블로그`,
    description: categoryData.category.description || `${categoryData.category.name} 카테고리의 글 목록입니다.`
  };
}

export default async function CategoryPage({ params }: Props) {
  // 1. URL 파라미터에서 데이터 추출
  const { slug } = params;

  // 2. 카테고리 데이터 가져오기
  const categoryData = await getCategoryData(slug);

  // 3. 데이터가 없으면 404 페이지 표시
  if (!categoryData) {
    return <CategoryNotFound />;
  }

  // 4. 카테고리 데이터 추출
  const { category, posts, pagination } = categoryData;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-end mb-4">
        <Link href="/" passHref>
          <Button variant="ghost" className="pl-0">
            <ArrowLeft className="mr-2 h-4 w-4" />
            홈으로 돌아가기
          </Button>
        </Link>
      </div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{category.name}</h1>
        {category.description && <p className="text-gray-600 mb-8">{category.description}</p>}
      </div>
      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">이 카테고리에는 아직 글이 없습니다.</p>
          <Link href="/" passHref>
            <Button variant="outline">다른 글 보러가기</Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="flex flex-col space-y-6">
            {posts.map(post => (
              <div key={post.id}>
                <Link href={`/category/${slug}/${post.slug}`} className="block group">
                  <PostCard post={post} />
                </Link>
              </div>
            ))}
          </div>
          <PaginationWrapper currentPage={pagination.page} totalPages={pagination.pageCount} categorySlug={slug} />
        </>
      )}
    </div>
  );
}
