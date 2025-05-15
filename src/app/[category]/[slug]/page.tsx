/* eslint-disable @typescript-eslint/no-explicit-any */
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { CalendarIcon, ArrowLeft, Tag as TagIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Post as PostType } from "@/lib/api";

type Props = {
  params: {
    category: string;
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

// 카테고리 이름 가져오는 함수 (서버 컴포넌트 버전)
function getCategoryNameServer(category: any): string | null {
  if (!category) return null;

  // Strapi의 관계 데이터 형식에 맞춰 처리
  if (typeof category === "object" && category !== null) {
    // Strapi v4 형식: category.data.attributes
    if ("data" in category) {
      const relation = category as any;
      if (relation.data && typeof relation.data === "object") {
        const data = relation.data;
        if (data.attributes && "name" in data.attributes) {
          return String(data.attributes.name);
        }
        if ("name" in data) {
          return String(data.name);
        }
      }
      return null;
    }

    // 일반 객체 형식
    const categoryObj = category as Record<string, any>;
    if (categoryObj.attributes && typeof categoryObj.attributes === "object") {
      const attributes = categoryObj.attributes as Record<string, any>;
      if ("name" in attributes) {
        return String(attributes.name);
      }
    }
    if ("name" in categoryObj) {
      return String(categoryObj.name);
    }
  }

  return null;
}

// 카테고리 슬러그 가져오는 함수
function getCategorySlugServer(category: any): string | null {
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

export default async function PostPage({ params }: Props) {
  const { category: categorySlug, slug } = params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // 카테고리 이름과 슬러그 가져오기
  const categoryName = getCategoryNameServer(post.category) || "카테고리";
  const postCategorySlug = getCategorySlugServer(post.category);

  // URL의 카테고리와 포스트의 카테고리가 일치하는지 확인
  if (postCategorySlug && postCategorySlug !== categorySlug) {
    // 올바른 URL로 리다이렉트 (Next.js는 서버 컴포넌트에서 직접 리다이렉트할 수 없어서 notFound 처리)
    notFound();
  }

  return (
    <article className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-8">
        <Link href={`/${categorySlug}`} passHref>
          <Button variant="ghost" className="mb-4 pl-0 hover:bg-transparent">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {categoryName} 목록으로 돌아가기
          </Button>
        </Link>
      </div>

      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

        <div className="flex items-center text-gray-500 mb-4 flex-wrap gap-4">
          <div className="flex items-center">
            <CalendarIcon className="h-4 w-4 mr-2" />
            <time dateTime={post.createdAt}>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ko })}</time>
          </div>

          <div className="flex items-center">
            <TagIcon className="h-4 w-4 mr-2" />
            <Link href={`/${categorySlug}`}>
              <Badge variant="outline" className="hover:bg-gray-100 cursor-pointer">
                {categoryName}
              </Badge>
            </Link>
          </div>
        </div>
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
