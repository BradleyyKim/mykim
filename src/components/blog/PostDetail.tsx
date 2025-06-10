import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Post } from "@/lib/api";
import { getCategorySlug, getCategoryName } from "@/lib/utils";
import { renderTiptapContent } from "@/lib/tiptap-renderer";
import { PostDetailActions } from "./PostDetailActions";

interface PostDetailProps {
  post: Post;
  categoryName?: string | null;
  categorySlug?: string | null;
}

export default function PostDetail({
  post,
  categoryName: propCategoryName,
  categorySlug: propCategorySlug
}: PostDetailProps) {
  // 상위 컴포넌트에서 카테고리 정보를 받지 않은 경우 직접 추출
  const categoryName = propCategoryName || getCategoryName(post.category) || "카테고리";
  const categorySlug = propCategorySlug || getCategorySlug(post.category);

  // publishedDate가 있으면 우선 사용하고, 없으면 createdAt을 fallback으로 사용
  const displayDate = post.publishedDate || post.createdAt;
  const formattedDate = format(new Date(displayDate), "yyyy.MM.dd HH:mm", { locale: ko });

  // Tiptap JSON 콘텐츠를 HTML로 렌더링
  const renderedContent = renderTiptapContent(post.content);

  return (
    <article className="container mx-auto px-4 py-8 max-w-3xl">
      <header className="mb-16">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <div className="flex items-center justify-between text-gray-500 mb-4 flex-wrap gap-4">
          <div className="flex items-center">
            <time dateTime={displayDate}>{formattedDate}</time>
          </div>

          {categoryName && categorySlug && (
            <div className="flex items-center">
              <Link href={`/category/${categorySlug}`}>
                <Badge variant="outline" className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                  {categoryName}
                </Badge>
              </Link>
            </div>
          )}
        </div>

        {/* 관리자용 액션 버튼들 */}
        <PostDetailActions postSlug={post.slug} />
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

      <div className="prose prose-lg max-w-none post-content" dangerouslySetInnerHTML={{ __html: renderedContent }} />
    </article>
  );
}
