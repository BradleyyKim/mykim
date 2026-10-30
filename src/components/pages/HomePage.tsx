import { Metadata } from "next";
import { fetchPosts, fetchCategories, fetchTags } from "@/lib/api";
import HomeView from "@/components/home/HomeView";
import { MAIN } from "@/lib/constants";
import type { Locale } from "@/i18n";

interface HomePageProps {
  locale: Locale;
}

export function generateHomeMetadata(locale: Locale): Metadata {
  const alternates = {
    canonical: locale === "en" ? `${MAIN.url}/en` : MAIN.url,
    languages: {
      ko: MAIN.url,
      en: `${MAIN.url}/en`
    }
  };

  if (locale === "en") {
    return {
      title: "MYKim",
      description: "A blog about programming, web development, and more",
      openGraph: { locale: "en_US" },
      alternates
    };
  }
  return {
    title: "MYKim",
    description: "프로그래밍, 웹 개발, 그리고 더 많은 주제에 대한 블로그",
    openGraph: { locale: "ko_KR" },
    alternates
  };
}

export default async function HomePage({ locale }: HomePageProps) {
  const [posts, categories, tags] = await Promise.all([fetchPosts(locale), fetchCategories(locale), fetchTags(locale)]);

  const rows = posts.map((p) => ({
    title: p.title,
    slug: p.slug,
    description: p.description,
    publishedDate: p.publishedDate || p.createdAt,
    readingMinutes: p.readingMinutes,
    tags: p.tags,
    category: p.category
  }));

  const counts = new Map<string, number>();
  for (const p of posts) if (p.category) counts.set(p.category.slug, (counts.get(p.category.slug) ?? 0) + 1);
  const cats = categories.map((c) => ({ ...c, count: counts.get(c.slug) ?? 0 }));

  // "years writing" — ignore the one birthday post dated in the last century
  const postYears = posts.map((p) => new Date(p.publishedDate || p.createdAt).getFullYear()).filter((y) => y >= 2010);
  const oldest = postYears.length ? Math.min(...postYears) : new Date().getFullYear();
  const years = Math.max(1, new Date().getFullYear() - oldest + 1);

  return <HomeView locale={locale} posts={rows} categories={cats} stats={{ posts: posts.length, tags: tags.length, years }} />;
}
