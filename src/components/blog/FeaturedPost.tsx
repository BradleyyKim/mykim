import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PostMark from "./PostMark";
import { formatPostDate, formatMinutes } from "@/lib/format";
import { getLocalePath, t } from "@/i18n";
import type { Locale } from "@/i18n";
import type { PostRowData } from "./PostRow";

interface FeaturedPostProps {
  post: PostRowData;
  locale: Locale;
}

export default function FeaturedPost({ post, locale }: FeaturedPostProps) {
  const href = getLocalePath(locale, `/posts/${post.slug}`);
  return (
    <Link
      href={href}
      className="surface group grid gap-6 p-6 transition-all duration-2 ease-soft hover:-translate-y-0.5 hover:shadow-[0_12px_40px_-24px_hsl(var(--glow)/0.5)] sm:grid-cols-[auto_1fr] sm:gap-8 sm:p-8"
    >
      <div className="flex items-start">
        <PostMark slug={post.slug} category={post.category?.slug} size={96} className="h-20 w-20 sm:h-24 sm:w-24" />
      </div>
      <div className="min-w-0">
        <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1">
          {post.category ? <span className="eyebrow text-primary">{post.category.name}</span> : null}
          <span className="mono">{formatPostDate(post.publishedDate, locale)}</span>
          {post.readingMinutes ? <span className="mono">{formatMinutes(post.readingMinutes, locale)}</span> : null}
        </div>
        <h3 className="t-h1 text-foreground transition-colors duration-1 group-hover:text-primary">{post.title}</h3>
        {post.description ? <p className="t-lead mt-3 line-clamp-3">{post.description}</p> : null}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          {post.tags?.slice(0, 4).map((tag) => (
            <span key={tag.id} className="chip">
              #{tag.name}
            </span>
          ))}
          <span className="ml-auto inline-flex items-center gap-1 text-sm font-medium text-primary">
            {t(locale, "home.readMore")}
            <ArrowRight className="h-4 w-4 transition-transform duration-2 ease-soft group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
