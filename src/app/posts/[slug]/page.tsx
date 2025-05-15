import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { CalendarIcon, ArrowLeft } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Post as PostType } from "@/lib/api";

type Props = {
  params: {
    slug: string;
  };
};

// Strapi 관계 데이터를 처리하기 위한 타입
type StrapiAttribute = {
  name?: string;
  slug?: string;
  [key: string]: unknown;
};

type StrapiData = {
  id?: number | string;
  attributes?: StrapiAttribute;
  name?: string;
  slug?: string;
  [key: string]: unknown;
};

type StrapiRelation = {
  data?: StrapiData | null;
  [key: string]: unknown;
};

// 카테고리 이름 가져오는 함수 (서버 컴포넌트 버전)
function getCategoryNameServer(category: unknown): string | null {
  if (!category) return null;

  // Strapi의 관계 데이터 형식에 맞춰 처리
  // 1. category가 직접 객체로 제공되는 경우 (populate로 가져온 경우)
  if (typeof category === "object" && category !== null) {
    // Strapi v4 형식: category.data.attributes
    if ("data" in category) {
      const relation = category as StrapiRelation;
      if (relation.data && typeof relation.data === "object") {
        const data = relation.data;
        if (data.attributes) {
          return data.attributes.name || data.attributes.slug || null;
        }
        return data.name || data.slug || null;
      }
      return null;
    }

    // 일반 객체 형식: category.name 또는 category.attributes.name
    const categoryObj = category as Record<string, unknown>;
    if (categoryObj.attributes && typeof categoryObj.attributes === "object") {
      const attributes = categoryObj.attributes as StrapiAttribute;
      return attributes.name || attributes.slug || null;
    }
    if (typeof categoryObj.name === "string") {
      return categoryObj.name;
    }
    if (typeof categoryObj.slug === "string") {
      return categoryObj.slug;
    }
    return null;
  }

  // 문자열로 제공되는 경우 (id나 slug)
  return typeof category === "string" ? category : null;
}

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

// 포스트 데이터 가져오기
async function getPostBySlug(slug: string): Promise<PostType | null> {
  const STRAPI_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337/api";

  try {
    const res = await fetch(`${STRAPI_URL}/posts?filters[slug][$eq]=${slug}&populate=*`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
      next: { revalidate: 60 } // 60초마다 재검증
    });

    if (!res.ok) {
      console.error("Failed to fetch post:", res.status);
      return null;
    }

    const data = await res.json();

    if (!data.data || data.data.length === 0) {
      return null;
    }

    return data.data[0];
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

export default async function PostPage({ params }: Props) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  // 카테고리 이름 가져오기 (서버 컴포넌트 버전 사용)
  const categoryName = getCategoryNameServer(post.category);

  return (
    <article className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-8">
        <Link href="/" passHref>
          <Button variant="ghost" className="mb-4 pl-0 hover:bg-transparent">
            <ArrowLeft className="mr-2 h-4 w-4" />
            돌아가기
          </Button>
        </Link>
      </div>

      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

        <div className="flex items-center text-gray-500 mb-4">
          <CalendarIcon className="h-4 w-4 mr-2" />
          <time dateTime={post.createdAt}>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ko })}</time>
        </div>

        {categoryName && (
          <div className="mb-4">
            <Badge variant="outline">{categoryName}</Badge>
          </div>
        )}
      </header>

      {post.featuredImage && post.featuredImage.url && (
        <div className="mb-8 relative aspect-video w-full overflow-hidden rounded-lg shadow-md">
          <Image
            src={post.featuredImage.url}
            alt={post.featuredImage.alternativeText || post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="prose prose-lg max-w-none">
        <Markdown remarkPlugins={[remarkGfm]}>{post.content}</Markdown>
      </div>
    </article>
  );
}

// 404 페이지
export function PostNotFound() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl text-center">
      <h1 className="text-3xl font-bold mb-4">포스트를 찾을 수 없습니다</h1>
      <p className="mb-8">요청하신 포스트가 존재하지 않거나 삭제되었습니다.</p>
      <Link href="/" passHref>
        <Button>메인 페이지로 돌아가기</Button>
      </Link>
    </div>
  );
}
