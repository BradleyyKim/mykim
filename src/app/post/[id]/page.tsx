import { fetchPostById, fetchPosts } from "@/lib/api";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, Share, Calendar, Clock, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PostPageProps {
  params: {
    id: string;
  };
}

interface Category {
  attributes?: {
    name?: string;
    slug?: string;
    [key: string]: unknown;
  };
}

interface Tag {
  attributes?: {
    name?: string;
    slug?: string;
    [key: string]: unknown;
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const id = parseInt(params.id);

  if (isNaN(id)) {
    notFound();
  }

  const post = await fetchPostById(id.toString());

  if (!post) {
    notFound();
  }

  // 추가 포스트 가져오기
  const allPosts = await fetchPosts();
  const relatedPosts = allPosts.filter(p => p.id !== post.id).slice(0, 3); // 최대 3개의 관련 포스트 표시

  // 읽기 시간 계산 (대략 1분에 200단어)
  const calculateReadTime = (content: string) => {
    const words = content.trim().split(/\s+/).length;
    const readTimeMinutes = Math.max(1, Math.ceil(words / 200));
    return readTimeMinutes;
  };

  const readTime = calculateReadTime(post.content);

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  // 카테고리, 태그 추출
  const categories = post.categories
    ? (post.categories as Category[]).map(cat => ({
        name: cat.attributes?.name || "",
        slug: cat.attributes?.slug || ""
      }))
    : [];

  const tags = post.tags
    ? (post.tags as Tag[]).map(tag => ({
        name: tag.attributes?.name || "",
        slug: tag.attributes?.slug || ""
      }))
    : [];

  return (
    <div className="bg-amber-50 min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="inline-block">
            <Button variant="outline" className="flex items-center gap-2 bg-white hover:bg-amber-100">
              <ArrowLeft size={16} />
              <span>목록으로 돌아가기</span>
            </Button>
          </Link>
          <div className="flex gap-2">
            <Button variant="ghost" className="flex items-center gap-1 text-amber-700 hover:bg-amber-100" aria-label="좋아요">
              <Heart size={16} />
              <span>좋아요</span>
            </Button>
            <Button variant="ghost" className="flex items-center gap-1 text-amber-700 hover:bg-amber-100" aria-label="공유하기">
              <Share size={16} />
              <span>공유하기</span>
            </Button>
          </div>
        </div>

        <article className="bg-white rounded-lg shadow-md p-8 mb-12">
          <header className="mb-8 border-b pb-6">
            {categories.length > 0 && (
              <div className="mb-4">
                {categories.map((category, index) => (
                  <Badge key={index} variant="outline" className="text-sm mr-2 bg-amber-50 text-amber-700 hover:bg-amber-100">
                    {category.name}
                  </Badge>
                ))}
              </div>
            )}
            <h1 className="text-4xl font-bold text-amber-900 mb-4">{post.title}</h1>
            <div className="flex flex-wrap gap-4 text-amber-600 text-sm">
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                <span>{formatDate(post.publishedDate || post.publishedAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>읽기 {readTime}분 소요</span>
              </div>
            </div>
          </header>

          <div className="prose prose-amber max-w-none lg:prose-lg">
            <div className="whitespace-pre-wrap break-words">{post.content}</div>
          </div>

          {tags.length > 0 && (
            <div className="mt-8 pt-6 border-t">
              <div className="flex flex-wrap items-center gap-2">
                <Tag size={16} className="text-amber-700" />
                {tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs bg-amber-50 text-amber-600 hover:bg-amber-100">
                    #{tag.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </article>

        {relatedPosts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-bold mb-6 text-amber-800">관련 포스트</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map(relatedPost => (
                <Link href={`/post/${relatedPost.id}`} key={relatedPost.id} className="block bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-bold text-lg mb-2 text-amber-900 line-clamp-2">{relatedPost.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-3">{relatedPost.description || relatedPost.content.substring(0, 120)}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
