"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, type ReactNode } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import { ArrowLeft } from "lucide-react";
import CodeBlock from "./CodeBlock";
import TableOfContents from "./TableOfContents";
import ReadingProgress from "./ReadingProgress";
import PostNav from "./PostNav";
import PostInteractive from "./PostInteractive";
import { formatPostDate, formatMinutes } from "@/lib/format";
import { usePostAnalytics } from "@/hooks/analytics";
import { trackPostView } from "@/lib/analytics/vercel-analytics";
import type { Post, PostRef } from "@/lib/types/post";
import { getLocalePath, t } from "@/i18n";
import type { Locale } from "@/i18n";

interface PostDetailProps {
  post: Post;
  locale: Locale;
  prev: PostRef | null;
  next: PostRef | null;
}

function nodeText(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(nodeText).join("");
  if (typeof node === "object" && "props" in node) {
    return nodeText((node as { props: { children?: ReactNode } }).props.children);
  }
  return "";
}

export default function PostDetail({ post, locale, prev, next }: PostDetailProps) {
  const categoryName = post.category?.name;
  const categorySlug = post.category?.slug;
  const displayDate = post.publishedDate || post.createdAt;

  usePostAnalytics(post.slug, categoryName ?? "", post.title);
  useEffect(() => {
    trackPostView(post.slug, post.title);
  }, [post.slug, post.title]);

  // Sections are written as `#` in MDX. The title is the page's h1, so each heading
  // renders one level down. Ids are assigned by rehype-slug (same slugger as the server
  // TOC), not during render — a render-time counter drifted on re-render and broke links.
  const components = useMemo<Components>(() => {
    const heading =
      (Tag: "h2" | "h3" | "h4") =>
      // eslint-disable-next-line react/display-name
      ({ id, children }: { id?: string; children?: ReactNode }) => {
        const text = nodeText(children);
        return (
          <Tag id={id}>
            <a href={`#${id}`} className="heading-anchor" aria-label={text}>
              #
            </a>
            {children}
          </Tag>
        );
      };
    return {
      h1: heading("h2"),
      h2: heading("h3"),
      h3: heading("h4"),
      img: ({ src, alt }) => {
        if (!src || typeof src !== "string") return null;
        return (
          <span className="block my-6">
            <Image
              src={src}
              alt={alt || ""}
              width={960}
              height={540}
              className="h-auto w-full rounded-lg"
              style={{ width: "100%", height: "auto" }}
            />
          </span>
        );
      },
      // `<div data-interactive="…"></div>` in MDX becomes an interactive figure
      div: ({ node, ...props }) => {
        const name = (props as Record<string, unknown>)["data-interactive"];
        if (typeof name === "string") return <PostInteractive name={name} locale={locale} />;
        void node;
        return <div {...props} />;
      },
      a: ({ href, children, ...props }) => {
        const external = !!href && /^https?:\/\//.test(href);
        return (
          <a href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} {...props}>
            {children}
          </a>
        );
      },
      pre: ({ children }) => {
        const child = Array.isArray(children) ? children[0] : children;
        const cls: string =
          child && typeof child === "object" && "props" in child
            ? ((child as { props: { className?: string } }).props.className ?? "")
            : "";
        const lang = /language-([\w-]+)/.exec(cls)?.[1];
        return (
          <CodeBlock language={lang} copyLabel={t(locale, "post.copy")} copiedLabel={t(locale, "post.copied")}>
            {children}
          </CodeBlock>
        );
      }
    };
  }, [locale, post.slug]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <ReadingProgress />
      <article className="page py-10 sm:py-14">
        <header className="mx-auto max-w-[var(--measure)]">
          <Link
            href={getLocalePath(locale, "/")}
            className="eyebrow mb-8 inline-flex items-center gap-1.5 transition-colors duration-1 hover:text-foreground"
          >
            <ArrowLeft className="h-3 w-3" />
            {t(locale, "post.backToList")}
          </Link>

          {categoryName && categorySlug ? (
            <Link href={getLocalePath(locale, `/category/${categorySlug}`)} className="eyebrow block text-primary">
              {categoryName}
            </Link>
          ) : null}

          <h1 className="t-title mt-3 text-foreground">{post.title}</h1>

          {post.description ? <p className="t-lead mt-5">{post.description}</p> : null}

          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-y border-border py-3">
            <time className="mono text-text-1" dateTime={displayDate}>
              {formatPostDate(displayDate, locale)}
            </time>
            <span className="mono">
              {formatMinutes(post.readingMinutes, locale)} · {t(locale, "post.readLabel")}
            </span>
            <span className="mono uppercase">{locale}</span>
            {post.tags?.length ? (
              <span className="flex flex-wrap gap-1.5 sm:ml-auto">
                {post.tags.map((tag) => (
                  <Link key={tag.id} href={getLocalePath(locale, `/tags/${encodeURIComponent(tag.name)}`)} className="chip">
                    #{tag.name}
                  </Link>
                ))}
              </span>
            ) : null}
          </div>
        </header>

        <div className="mx-auto mt-8 grid max-w-[var(--measure)] gap-8 xl:max-w-none xl:grid-cols-[1fr_minmax(0,var(--measure))_1fr] xl:gap-10">
          <div className="xl:hidden">
            <TableOfContents headings={post.headings} title={t(locale, "post.toc")} collapsible />
          </div>
          <div className="hidden xl:block" />

          <div className="prose post-content min-w-0">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw, rehypeSlug, rehypeHighlight]} components={components}>
              {post.content}
            </ReactMarkdown>
          </div>

          <aside className="hidden xl:block">
            <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-auto pr-2">
              <TableOfContents headings={post.headings} title={t(locale, "post.toc")} />
            </div>
          </aside>
        </div>

        <div className="mx-auto mt-16 max-w-[var(--measure)]">
          <PostNav prev={prev} next={next} locale={locale} />
        </div>
      </article>
    </>
  );
}
