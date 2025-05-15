import { Metadata } from "next";
import Link from "next/link";
import { fetchPosts } from "@/lib/api";
import PostCard from "@/components/blog/PostCard";

export const metadata: Metadata = {
  title: "카테고리1 - 블로그",
  description: "카테고리1에 관련된 글 목록입니다."
};

export default async function Category1Page() {
  // 카테고리1에 속한 글만 필터링
  const allPosts = await fetchPosts();
  const categorySlug = "category1";

  // 카테고리에 맞는 포스트만 필터링하는 로직
  const posts = allPosts.filter(post => {
    if (!post.category) return false;

    // 카테고리 정보 추출
    const category = post.category;

    // 여러 형태의 카테고리 객체 처리
    if (typeof category === "object" && category !== null) {
      // Strapi v4 형식: category.data.attributes.slug
      if ("data" in category && category.data && typeof category.data === "object") {
        const data = category.data;
        if (data.attributes && data.attributes.slug === categorySlug) return true;
        if (data.slug === categorySlug) return true;
      }

      // 일반 객체 형식
      if ("attributes" in category && category.attributes && category.attributes.slug === categorySlug) return true;
      if ("slug" in category && category.slug === categorySlug) return true;
    }

    return false;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/" className="text-blue-500 hover:underline mb-4 inline-block">
          홈으로 돌아가기
        </Link>
        <h1 className="text-3xl font-bold mb-4">카테고리1</h1>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">이 카테고리에는 아직 글이 없습니다.</p>
          <Link href="/" className="text-blue-500 hover:underline">
            다른 글 보러가기
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => (
            <div key={post.id} className="flex flex-col h-full">
              <Link href={`/category1/${post.slug}`} className="block h-full">
                <PostCard post={post} />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
