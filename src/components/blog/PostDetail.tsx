"use client";

import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import { Badge } from "@/components/ui/badge";
import { usePostAnalytics } from "@/hooks/analytics";
import { trackPostView } from "@/lib/analytics/vercel-analytics";
import { useEffect } from "react";
import type { PostDetailProps } from "@/lib/types/post";

export default function PostDetail({
  post,
  categoryName: propCategoryName,
  categorySlug: propCategorySlug,
}: PostDetailProps) {
  const categoryName = propCategoryName || post.category?.name || "카테고리";
  const categorySlug = propCategorySlug || post.category?.slug;

  const displayDate = post.publishedDate || post.createdAt;
  const formattedDate = format(new Date(displayDate), "yyyy.MM.dd HH:mm", {
    locale: ko,
  });

  usePostAnalytics(post.slug, categoryName, post.title);

  useEffect(() => {
    trackPostView(post.slug, post.title);
  }, [post.slug, post.title]);

  return (
    <article className="container mx-auto px-4 py-8 max-w-3xl">
      <header className="mb-16">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <div className="flex items-center justify-between text-gray-500 mb-4 flex-wrap gap-4">
          <div className="flex items-center">
            <time dateTime={displayDate}>{formattedDate}</time>
          </div>

          <div className="flex items-center gap-2">
            {categoryName && categorySlug && (
              <Link href={`/category/${categorySlug}`}>
                <Badge
                  variant="outline"
                  className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                >
                  {categoryName}
                </Badge>
              </Link>
            )}
          </div>
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag) => (
              <Link
                key={tag.id}
                href={`/tags/${encodeURIComponent(tag.name || "")}`}
              >
                <Badge
                  variant="secondary"
                  className="hover:bg-blue-100 dark:hover:bg-blue-900 cursor-pointer transition-colors duration-200"
                >
                  #{tag.name}
                </Badge>
              </Link>
            ))}
          </div>
        )}
      </header>

      <div className="prose prose-lg max-w-none post-content dark:prose-invert">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, rehypeHighlight]}
          components={{
            img: ({ src, alt }) => {
              if (!src || typeof src !== "string") return null;
              return (
                <span className="block my-4">
                  <Image
                    src={src}
                    alt={alt || ""}
                    width={800}
                    height={450}
                    className="rounded-lg shadow-md max-w-full h-auto"
                    style={{ width: "100%", height: "auto" }}
                  />
                </span>
              );
            },
            a: ({ href, children, ...props }) => (
              <a
                href={href}
                className="text-blue-600 hover:text-blue-800 underline"
                target={href?.startsWith("http") ? "_blank" : undefined}
                rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
                {...props}
              >
                {children}
              </a>
            ),
            pre: ({ children, ...props }) => (
              <pre className="code-block-container" {...props}>
                {children}
              </pre>
            ),
          }}
        >
          {post.content}
        </ReactMarkdown>
      </div>
    </article>
  );
}
