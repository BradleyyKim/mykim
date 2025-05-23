import { Metadata } from "next";
import PostDetail from "@/components/blog/PostDetail";
import { PostNotFound } from "@/components/NotFound";
import { getPostBySlug } from "@/lib/services/post-service";
import { REVALIDATE_TIME } from "@/lib/constants";

// ISR 설정
export const revalidate = REVALIDATE_TIME;

type Props = {
  params: {
    slug: string;
  };
};

// 동적 메타데이터 생성
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;
  const post = await getPostBySlug(slug);

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

export default async function PostPage({ params }: Props) {
  const { slug } = params;

  // 1. 포스트 데이터 가져오기
  const post = await getPostBySlug(slug);

  // 2. 포스트가 없으면 404 페이지
  if (!post) {
    return <PostNotFound />;
  }

  return <PostDetail post={post} />;
}
