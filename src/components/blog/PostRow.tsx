import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import PostMark from "./PostMark";
import { formatPostDate, formatMinutes, pad2 } from "@/lib/format";
import { getLocalePath } from "@/i18n";
import type { Locale } from "@/i18n";
import type { Tag, Category } from "@/lib/types/post";

export interface PostRowData {
  title: string;
  slug: string;
  description?: string | null;
  publishedDate: string;
  readingMinutes?: number;
  tags?: Tag[];
  category?: Category | null;
}

interface PostRowProps {
  post: PostRowData;
  locale: Locale;
  index?: number;
  /** archive mode — one line, no description */
  compact?: boolean;
}

export default function PostRow({ post, locale, index, compact = false }: PostRowProps) {
  const href = getLocalePath(locale, `/posts/${post.slug}`);

  if (compact) {
    return (
      <li>
        <Link
          href={href}
          className="row-hover group -mx-3 flex items-baseline gap-4 rounded-md px-3 py-2.5"
        >
          <span className="mono w-10 shrink-0 text-text-3">{formatPostDate(post.publishedDate, locale).slice(5)}</span>
          <span className="min-w-0 flex-1 truncate text-[0.9375rem] font-medium text-text-1 transition-colors duration-1 group-hover:text-foreground">
            {post.title}
          </span>
          {post.readingMinutes ? (
            <span className="mono hidden shrink-0 sm:inline">{formatMinutes(post.readingMinutes, locale)}</span>
          ) : null}
        </Link>
      </li>
    );
  }

  return (
    <li>
      <Link
        href={href}
        className="row-hover group -mx-3 grid grid-cols-[auto_1fr] items-start gap-x-4 rounded-lg px-3 py-4 sm:grid-cols-[2.25rem_3.5rem_1fr_auto] sm:gap-x-5"
      >
        {index !== undefined ? (
          <span className="mono hidden pt-1 text-text-3 sm:block">{pad2(index)}</span>
        ) : (
          <span className="hidden sm:block" />
        )}
        <PostMark slug={post.slug} category={post.category?.slug} size={56} className="row-span-2 sm:row-span-1" />
        <div className="min-w-0">
          <h3 className="t-h3 text-foreground transition-colors duration-1 group-hover:text-primary">{post.title}</h3>
          {post.description ? (
            <p className="t-small mt-1 line-clamp-2 pr-4 sm:pr-10">{post.description}</p>
          ) : null}
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="mono">{formatPostDate(post.publishedDate, locale)}</span>
            {post.readingMinutes ? <span className="mono">{formatMinutes(post.readingMinutes, locale)}</span> : null}
            {post.tags?.slice(0, 3).map((tag) => (
              <span key={tag.id} className="mono text-text-3">
                #{tag.name}
              </span>
            ))}
          </div>
        </div>
        <ArrowUpRight
          className="mt-1 hidden h-4 w-4 shrink-0 text-text-3 transition-all duration-2 ease-soft group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary sm:block"
          aria-hidden="true"
        />
      </Link>
    </li>
  );
}
