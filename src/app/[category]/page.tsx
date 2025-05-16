/* eslint-disable @typescript-eslint/no-explicit-any */
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchPosts, fetchCategories, Category } from "@/lib/api";
import PostCard from "@/components/blog/PostCard";
import { notFound } from "next/navigation";

type Props = {
  params: {
    category: string;
  };
};

// 카테고리 메타데이터 생성
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = params;
  const categoryData = await getCategoryBySlug(category);

  if (!categoryData) {
    return {
      title: "카테고리를 찾을 수 없습니다"
    };
  }

  return {
    title: `${categoryData.name} - 블로그`,
    description: categoryData.description || `${categoryData.name} 카테고리의 글 목록입니다.`
  };
}

// 카테고리 데이터 가져오기
async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const categories = await fetchCategories();
    return categories.find(category => category.slug === slug) || null;
  } catch (error) {
    console.error("Error fetching category:", error);
    return null;
  }
}

// 카테고리 슬러그 가져오는 함수
function getCategorySlug(category: any): string | null {
  if (!category) return null;

  if (typeof category === "object" && category !== null) {
    // Strapi v4 형식: category.data.attributes
    if ("data" in category) {
      const relation = category as any;
      if (relation.data && typeof relation.data === "object") {
        const data = relation.data;
        if (data.attributes && "slug" in data.attributes) {
          return String(data.attributes.slug);
        }
        if ("slug" in data) {
          return String(data.slug);
        }
      }
      return null;
    }

    // 일반 객체 형식
    const categoryObj = category as Record<string, any>;
    if (categoryObj.attributes && typeof categoryObj.attributes === "object") {
      const attributes = categoryObj.attributes as Record<string, any>;
      if ("slug" in attributes) {
        return String(attributes.slug);
      }
    }
    if ("slug" in categoryObj) {
      return String(categoryObj.slug);
    }
  }

  return null;
}

export default async function CategoryPage({ params }: Props) {
  const { category } = params;
  const categoryData = await getCategoryBySlug(category);

  if (!categoryData) {
    notFound();
  }

  // 모든 포스트를 가져온 후 현재 카테고리에 해당하는 포스트만 필터링
  const allPosts = await fetchPosts();
  const posts = allPosts.filter(post => {
    const postCategorySlug = getCategorySlug(post.category);
    return postCategorySlug === category;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/" passHref>
          <Button variant="ghost" className="mb-4 pl-0 hover:bg-transparent">
            <ArrowLeft className="mr-2 h-4 w-4" />
            홈으로 돌아가기
          </Button>
        </Link>

        <h1 className="text-3xl font-bold mb-4">{categoryData.name}</h1>
        {categoryData.description && <p className="text-gray-600 mb-8">{categoryData.description}</p>}
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">이 카테고리에는 아직 글이 없습니다.</p>
          <Link href="/" passHref>
            <Button variant="outline">다른 글 보러가기</Button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col space-y-6">
          {posts.map(post => (
            <div key={post.id}>
              <Link href={`/${category}/${post.slug}`} className="block group">
                <PostCard post={post} />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
