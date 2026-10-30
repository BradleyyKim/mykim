import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Hero from "./Hero";
import FeaturedPost from "@/components/blog/FeaturedPost";
import PostRow, { type PostRowData } from "@/components/blog/PostRow";
import { getLocalePath, t } from "@/i18n";
import type { Locale } from "@/i18n";
import type { Category } from "@/lib/types/post";
import { pad2 } from "@/lib/format";

export interface HomeViewProps {
  locale: Locale;
  posts: PostRowData[];
  categories: (Category & { count: number })[];
  stats: { posts: number; tags: number; years: number };
}

function SectionHead({ eyebrow, title, hint }: { eyebrow: string; title: string; hint?: string }) {
  return (
    <div className="mb-6">
      <p className="eyebrow mb-2">{eyebrow}</p>
      <div className="section-head">
        <h2 className="t-h1 text-foreground">{title}</h2>
        {hint ? <span className="eyebrow hidden sm:inline">{hint}</span> : null}
      </div>
    </div>
  );
}

export default function HomeView({ locale, posts, categories, stats }: HomeViewProps) {
  const [latest, ...rest] = posts;
  const recent = rest.slice(0, 6);
  const byYear = new Map<string, PostRowData[]>();
  for (const p of posts) {
    const y = new Date(p.publishedDate).getFullYear().toString();
    byYear.set(y, [...(byYear.get(y) ?? []), p]);
  }
  const years = [...byYear.keys()].sort((a, b) => Number(b) - Number(a));

  return (
    <>
      <Hero locale={locale} stats={stats} />

      <div className="page space-y-20 pb-24 pt-4 sm:space-y-24">
        {latest ? (
          <section>
            <SectionHead eyebrow={`01 ${t(locale, "home.items")}`} title={t(locale, "home.latest")} hint={t(locale, "home.latestHint")} />
            <FeaturedPost post={latest} locale={locale} />
          </section>
        ) : null}

        {recent.length ? (
          <section>
            <SectionHead
              eyebrow={`${pad2(recent.length)} ${t(locale, "home.items")}`}
              title={t(locale, "home.recent")}
              hint={t(locale, "home.recentHint")}
            />
            <ol className="divide-y divide-border">
              {recent.map((p, i) => (
                <PostRow key={p.slug} post={p} locale={locale} index={i + 1} />
              ))}
            </ol>
          </section>
        ) : null}

        <section>
          <SectionHead
            eyebrow={`${pad2(categories.length)} ${t(locale, "home.items")}`}
            title={t(locale, "home.series")}
            hint={t(locale, "home.seriesHint")}
          />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={getLocalePath(locale, `/category/${c.slug}`)}
                className="surface group flex flex-col gap-2 p-5 transition-all duration-2 ease-soft hover:-translate-y-0.5 hover:border-primary/50"
              >
                <span className="mono">{pad2(c.count)} posts</span>
                <span className="t-h3 text-foreground group-hover:text-primary">{c.name}</span>
                <span className="t-small line-clamp-2">{c.description}</span>
                <ArrowRight className="mt-auto h-4 w-4 self-end text-text-3 transition-transform duration-2 ease-soft group-hover:translate-x-0.5 group-hover:text-primary" />
              </Link>
            ))}
          </div>
        </section>

        <section>
          <SectionHead eyebrow={`${pad2(posts.length)} ${t(locale, "home.items")}`} title={t(locale, "home.archive")} hint={t(locale, "home.archiveHint")} />
          <div className="space-y-10">
            {years.map((y) => (
              <div key={y} className="grid gap-3 md:grid-cols-[8rem_1fr]">
                <div>
                  <p className="num text-2xl font-semibold tracking-tight text-foreground">{y}</p>
                  <p className="mono">{pad2(byYear.get(y)!.length)} posts</p>
                </div>
                <ol>
                  {byYear.get(y)!.map((p) => (
                    <PostRow key={p.slug} post={p} locale={locale} compact />
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
