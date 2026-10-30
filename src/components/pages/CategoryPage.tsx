import { Metadata } from "next";
import Link from "next/link";
import { getCategoryData } from "@/lib/cms";
import { NotFound as CategoryNotFound } from "@/components/ui";
import PaginationWrapper from "@/components/blog/PaginationWrapper";
import PostRow from "@/components/blog/PostRow";
import CategoryAnalytics from "@/components/analytics/CategoryAnalytics";
import { MAIN } from "@/lib/constants";
import { pad2 } from "@/lib/format";
import type { Locale } from "@/i18n";
import { getLocalePath, t } from "@/i18n";

interface CategoryPageProps {
  slug: string;
  locale: Locale;
}

export async function generateCategoryMetadata(slug: string, locale: Locale): Promise<Metadata> {
  const categoryData = await getCategoryData(slug, locale);

  if (!categoryData) {
    return {
      title: locale === "en" ? "Category not found" : "카테고리를 찾을 수 없습니다"
    };
  }

  const { category } = categoryData;
  const title = `${category.name} - ${MAIN.title}`;
  const description =
    category.description || (locale === "en" ? `Posts in ${category.name} category.` : `${category.name} 카테고리의 글 목록입니다.`);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      locale: locale === "en" ? "en_US" : "ko_KR",
      url: `${MAIN.url}${getLocalePath(locale, `/category/${category.slug}`)}`,
      siteName: MAIN.title
    },
    twitter: { card: "summary", title, description },
    alternates: {
      canonical: `${MAIN.url}${getLocalePath(locale, `/category/${category.slug}`)}`,
      languages: {
        ko: `${MAIN.url}/category/${category.slug}`,
        en: `${MAIN.url}/en/category/${category.slug}`
      }
    }
  };
}

export default async function CategoryPage({ slug, locale }: CategoryPageProps) {
  const categoryData = await getCategoryData(slug, locale);
  if (!categoryData) return <CategoryNotFound />;

  const { category, posts, pagination } = categoryData;

  return (
    <div className="page py-10 sm:py-14">
      <CategoryAnalytics categoryName={category.name} />

      <header className="max-w-[60ch]">
        <p className="eyebrow">
          {t(locale, "nav.series")} · {pad2(pagination.total)} posts
        </p>
        <h1 className="t-title mt-3 text-foreground">{category.name}</h1>
        {category.description ? <p className="t-lead mt-4">{category.description}</p> : null}
      </header>

      <div className="mt-10">
        {posts.length === 0 ? (
          <div className="surface p-8 text-center">
            <p className="t-h3 text-foreground">{t(locale, "category.noPosts")}</p>
            <p className="t-small mt-1">{t(locale, "category.noPostsDesc")}</p>
            <Link href={getLocalePath(locale, "/")} className="mt-4 inline-block text-sm font-medium text-primary link-underline">
              {t(locale, "category.viewOther")}
            </Link>
          </div>
        ) : (
          <>
            <ol className="divide-y divide-border">
              {posts.map((post, i) => (
                <PostRow
                  key={post.id}
                  locale={locale}
                  index={(pagination.page - 1) * pagination.pageSize + i + 1}
                  post={{
                    title: post.title,
                    slug: post.slug,
                    description: post.description,
                    publishedDate: post.publishedDate || post.createdAt,
                    readingMinutes: post.readingMinutes,
                    tags: post.tags,
                    category: post.category
                  }}
                />
              ))}
            </ol>
            {pagination.pageCount > 1 ? (
              <div className="mt-10 flex justify-center">
                <PaginationWrapper currentPage={pagination.page} totalPages={pagination.pageCount} categorySlug={slug} />
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
