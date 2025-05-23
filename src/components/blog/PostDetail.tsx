import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Post } from "@/lib/api";
import { getCategorySlug, getCategoryName } from "@/lib/utils";

interface PostDetailProps {
  post: Post;
  categoryName?: string | null;
  categorySlug?: string | null;
}

export default function PostDetail({ post, categoryName: propCategoryName, categorySlug: propCategorySlug }: PostDetailProps) {
  // 상위 컴포넌트에서 카테고리 정보를 받지 않은 경우 직접 추출
  const categoryName = propCategoryName || getCategoryName(post.category) || "카테고리";
  const categorySlug = propCategorySlug || getCategorySlug(post.category);
  const formattedDate = format(new Date(post.createdAt), "yyyy.MM.dd HH:mm", { locale: ko });

  return (
    <article className="container mx-auto px-4 py-8 max-w-3xl">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <div className="flex items-center justify-between text-gray-500 mb-4 flex-wrap gap-4">
          <div className="flex items-center">
            <time dateTime={post.createdAt}>{formattedDate}</time>
          </div>

          {categoryName && categorySlug && (
            <div className="flex items-center">
              <Link href={`/category/${categorySlug}`}>
                <Badge variant="outline" className="hover:bg-gray-100 cursor-pointer">
                  {categoryName}
                </Badge>
              </Link>
            </div>
          )}
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
