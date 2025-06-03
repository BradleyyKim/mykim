import { Metadata } from "next";
import PostDetail from "@/components/blog/PostDetail";
import { PostNotFound } from "@/components/NotFound";
import { getPostBySlug } from "@/lib/services/post-service";
import { extractPlainText } from "@/lib/tiptap-renderer";

// ISR 설정
export const revalidate = 300; // 5분

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

// 정적 경로 생성 (ISR 최적화) - 빌드 시에는 빈 배열 반환
export async function generateStaticParams() {
  return [];
}

// 동적 메타데이터 생성 - 빌드 시점에서 안전하게 처리
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  // 빌드 시점에서는 기본 메타데이터 반환
  if (process.env.NODE_ENV === "production" && !process.env.NEXT_PUBLIC_API_URL?.startsWith("http")) {
    return {
      title: `Post: ${slug}`,
      description: "Blog post content"
    };
  }

  try {
    const post = await getPostBySlug(slug);

    if (!post) {
      return {
        title: "포스트를 찾을 수 없습니다",
        description: "요청하신 포스트를 찾을 수 없습니다."
      };
    }

    return {
      title: post.title,
      description: post.description || extractPlainText(post.content, 160)
    };
  } catch (error) {
    console.warn(`Metadata generation failed for slug: ${slug}`, error);
    return {
      title: `Post: ${slug}`,
      description: "Blog post content"
    };
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;

  // 1. 포스트 데이터 가져오기
  const post = await getPostBySlug(slug);

  // 2. 포스트가 없으면 404 페이지
  if (!post) {
    return <PostNotFound />;
  }

  return <PostDetail post={post} />;
}
