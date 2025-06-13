import { Metadata } from "next";
import PostDetail from "@/components/blog/PostDetail";
import { PostNotFound } from "@/components/NotFound";
import { getPostBySlug } from "@/lib/services/post-service";
import { extractPlainText, extractFirstImageFromTiptapContent } from "@/lib/tiptap-renderer";
import { MAIN } from "@/lib/constants";

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

// 썸네일 이미지 URL 생성 함수
function getThumbnailImage(post: { featuredImage?: { url?: string } | null; content: string | object }): string {
  // 1. featuredImage가 있으면 사용
  if (post.featuredImage?.url) {
    return post.featuredImage.url;
  }

  // 2. 콘텐츠에서 첫 번째 이미지 추출
  const firstImage = extractFirstImageFromTiptapContent(post.content);
  if (firstImage) {
    return firstImage;
  }

  // 3. 기본 프로필 이미지 사용
  return MAIN.image;
}

// 구조화된 데이터 생성 함수
function generateStructuredData(post: {
  title: string;
  description?: string | null;
  content: string | object;
  publishedDate?: string | null;
  updatedAt?: string;
  slug: string;
  featuredImage?: { url?: string } | null;
}) {
  const thumbnailImage = getThumbnailImage(post);

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description || extractPlainText(post.content, 160),
    image: thumbnailImage,
    datePublished: post.publishedDate || undefined,
    dateModified: post.updatedAt || undefined,
    author: {
      "@type": "Person",
      name: MAIN.author,
      url: MAIN.url
    },
    publisher: {
      "@type": "Organization",
      name: MAIN.title,
      logo: {
        "@type": "ImageObject",
        url: MAIN.image
      }
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${MAIN.url}/posts/${post.slug}`
    }
  };
}

// 동적 메타데이터 생성
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

    const description = post.description || extractPlainText(post.content, 160);
    const thumbnailImage = getThumbnailImage(post);

    return {
      title: post.title,
      description,
      openGraph: {
        title: post.title,
        description,
        type: "article",
        publishedTime: post.publishedDate || undefined,
        modifiedTime: post.updatedAt || undefined,
        authors: [MAIN.author],
        images: [
          {
            url: thumbnailImage,
            width: 1200,
            height: 630,
            alt: post.title
          }
        ],
        url: `${MAIN.url}/posts/${post.slug}`
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description,
        images: [thumbnailImage],
        creator: MAIN.twitter
      },
      alternates: {
        canonical: `${MAIN.url}/posts/${post.slug}`
      }
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

  // 구조화된 데이터를 JSON-LD로 추가
  const structuredData = generateStructuredData(post);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <PostDetail post={post} />
    </>
  );
}
