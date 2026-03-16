import { Metadata } from "next";
import { fetchTags } from "@/lib/api";
import TagsPageClient from "@/components/layout/TagsPageClient";
import { MAIN } from "@/lib/constants";
import type { Locale } from "@/i18n";

interface TagsPageProps {
  locale: Locale;
}

export function generateTagsMetadata(locale: Locale): Metadata {
  const alternates = {
    canonical: locale === "en" ? `${MAIN.url}/en/tags` : `${MAIN.url}/tags`,
    languages: {
      "ko": `${MAIN.url}/tags`,
      "en": `${MAIN.url}/en/tags`
    }
  };

  if (locale === "en") {
    return {
      title: "Tags | MyKim",
      description: "Browse all tags and find related posts.",
      openGraph: {
        title: "Tags | MyKim",
        description: "Browse all tags and find related posts.",
        type: "website",
        locale: "en_US"
      },
      alternates
    };
  }
  return {
    title: "Tags | MyKim",
    description: "모든 태그를 확인하고 관련 포스트를 찾아보세요.",
    openGraph: {
      title: "Tags | MyKim",
      description: "모든 태그를 확인하고 관련 포스트를 찾아보세요.",
      type: "website",
      locale: "ko_KR"
    },
    alternates
  };
}

export default async function TagsPage({ locale }: TagsPageProps) {
  const tags = await fetchTags(locale);

  return <TagsPageClient tags={tags} locale={locale} />;
}
