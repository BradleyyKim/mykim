import { Metadata } from "next";
import { notFound } from "next/navigation";
import PostDetail from "@/components/blog/PostDetail";
import { PostNotFound } from "@/components/NotFound";
import { getPostBySlug } from "@/lib/services/post-service";
import { fetchCategoryBySlug } from "@/lib/api";
import { getCategorySlug } from "@/lib/utils";

type Props = {
  params: {
    slug: string;
    postSlug: string;
  };
};

// 동적 메타데이터 생성
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { postSlug } = params;
  const post = await getPostBySlug(postSlug);

  if (!post) {
    return {
      title: "포스트를 찾을 수 없습니다"
    };
  }

  return {
    title: post.title,
    description: post.description || post.content.substring(0, 160)
  };
}

export default async function CategoryPostPage({ params }: Props) {
  const { slug: categorySlug, postSlug } = params;

  // 1. 포스트 데이터 가져오기
  const post = await getPostBySlug(postSlug);

  // 2. 포스트가 없으면 404 페이지
  if (!post) {
    return <PostNotFound />;
  }

  // 3. 포스트의 카테고리 슬러그와 URL의 카테고리 슬러그가 일치하는지 확인
  const postCategorySlug = getCategorySlug(post.category);

  // 4. 카테고리 일치 여부 확인 - 일치하지 않으면 404
  if (postCategorySlug !== categorySlug) {
    return notFound();
  }

  // 5. 카테고리 데이터 가져오기
  const category = await fetchCategoryBySlug(categorySlug);
  if (!category) {
    return notFound();
  }

  return <PostDetail post={post} categoryName={category.name} categorySlug={categorySlug} />;
}
