import { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchTagByName, fetchPostsByTag } from "@/lib/api";
import TagDetailPageClient from "@/components/layout/TagDetailPageClient";
import { MAIN } from "@/lib/constants";
import type { Locale } from "@/i18n";
import { getLocalePath } from "@/i18n";

interface TagDetailPageProps {
  slug: string;
  locale: Locale;
}

export async function generateTagDetailMetadata(slug: string, locale: Locale): Promise<Metadata> {
  const tag = await fetchTagByName(slug, locale);

  if (!tag) {
    return {
      title: "Tag Not Found | MyKim",
      description: locale === "en" ? "The requested tag could not be found." : "요청하신 태그를 찾을 수 없습니다."
    };
  }

  const description = locale === "en"
    ? `Browse all posts related to the ${tag.name} tag.`
    : `${tag.name} 태그와 관련된 모든 포스트를 확인해보세요.`;

  return {
    title: `${tag.name} | MyKim`,
    description,
    openGraph: {
      title: `${tag.name} | MyKim`,
      description,
      type: "website",
      locale: locale === "en" ? "en_US" : "ko_KR"
    },
    alternates: {
      canonical: `${MAIN.url}${getLocalePath(locale, `/tags/${slug}`)}`,
      languages: {
        "ko": `${MAIN.url}/tags/${slug}`,
        "en": `${MAIN.url}/en/tags/${slug}`
      }
    }
  };
}

export default async function TagDetailPage({ slug, locale }: TagDetailPageProps) {
  const [tag, postsResult] = await Promise.all([
    fetchTagByName(slug, locale),
    fetchPostsByTag(slug, 1, locale)
  ]);

  if (!tag) {
    notFound();
  }

  return <TagDetailPageClient tag={tag} initialPosts={postsResult} locale={locale} />;
}
