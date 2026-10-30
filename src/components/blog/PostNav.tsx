import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getLocalePath, t } from "@/i18n";
import type { Locale } from "@/i18n";
import type { PostRef } from "@/lib/types/post";

interface PostNavProps {
  prev: PostRef | null;
  next: PostRef | null;
  locale: Locale;
}

export default function PostNav({ prev, next, locale }: PostNavProps) {
  if (!prev && !next) return null;
  return (
    <nav className="grid gap-3 sm:grid-cols-2" aria-label="post navigation">
      {prev ? (
        <Link
          href={getLocalePath(locale, `/posts/${prev.slug}`)}
          className="surface group flex flex-col gap-1 p-4 transition-colors duration-1 hover:bg-accent/60"
        >
          <span className="eyebrow inline-flex items-center gap-1">
            <ArrowLeft className="h-3 w-3" /> {t(locale, "post.prev")}
          </span>
          <span className="t-h3 text-foreground group-hover:text-primary">{prev.title}</span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          href={getLocalePath(locale, `/posts/${next.slug}`)}
          className="surface group flex flex-col gap-1 p-4 text-right transition-colors duration-1 hover:bg-accent/60"
        >
          <span className="eyebrow inline-flex items-center justify-end gap-1">
            {t(locale, "post.next")} <ArrowRight className="h-3 w-3" />
          </span>
          <span className="t-h3 text-foreground group-hover:text-primary">{next.title}</span>
        </Link>
      ) : null}
    </nav>
  );
}
