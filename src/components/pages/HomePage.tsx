import { Metadata } from "next";
import { Suspense } from "react";
import { fetchPaginatedPosts } from "@/lib/api";
import { HomePageClient } from "@/components/layout";
import { MAIN } from "@/lib/constants";
import type { PostsByYear } from "@/lib/types/post";
import type { Locale } from "@/i18n";

interface HomePageProps {
  locale: Locale;
}

export function generateHomeMetadata(locale: Locale): Metadata {
  const alternates = {
    canonical: locale === "en" ? `${MAIN.url}/en` : MAIN.url,
    languages: {
      "ko": MAIN.url,
      "en": `${MAIN.url}/en`
    }
  };

  if (locale === "en") {
    return {
      title: "MYKim",
      description: "A blog about programming, web development, and more",
      openGraph: {
        locale: "en_US"
      },
      alternates
    };
  }
  return {
    title: "MYKim",
    description: "프로그래밍, 웹 개발, 그리고 더 많은 주제에 대한 블로그",
    openGraph: {
      locale: "ko_KR"
    },
    alternates
  };
}

export default function HomePage({ locale }: HomePageProps) {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/4">
              <div className="h-6 bg-gray-200 rounded-md animate-pulse mb-4 w-24"></div>
              <div className="h-6 bg-gray-200 rounded-md animate-pulse mb-4 w-20"></div>
              <div className="h-6 bg-gray-200 rounded-md animate-pulse mb-4 w-24"></div>
            </div>
            <div className="w-full md:w-3/4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="mb-6 pb-6 border-b border-gray-200 last:border-0">
                  <div className="h-7 bg-gray-200 rounded-md animate-pulse mb-2 w-3/4"></div>
                  <div className="h-5 bg-gray-200 rounded-md animate-pulse mb-4 w-1/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      }
    >
      <HomePageContentWrapper locale={locale} />
    </Suspense>
  );
}

async function HomePageContentWrapper({ locale }: HomePageProps) {
  try {
    const { data: allPosts } = await fetchPaginatedPosts(1, 100, locale);

    const postsByYear: PostsByYear = allPosts.reduce((acc, post) => {
      const postDate = new Date(post.publishedDate || post.publishedAt || post.createdAt);
      const year = postDate.getFullYear().toString();

      if (!acc[year]) {
        acc[year] = { posts: [], totalCount: 0 };
      }

      acc[year].posts.push({
        id: post.id,
        title: post.title,
        slug: post.slug,
        publishedDate: post.publishedDate || post.publishedAt || post.createdAt,
        createdAt: post.createdAt,
        category: post.category,
        tags: post.tags || []
      });

      return acc;
    }, {} as PostsByYear);

    const sortedYears = Object.keys(postsByYear).sort((a, b) => parseInt(b) - parseInt(a));
    const filteredYears = sortedYears.filter(year => postsByYear[year].posts.length > 0);

    filteredYears.forEach(year => {
      postsByYear[year].posts.sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());
      postsByYear[year].totalCount = postsByYear[year].posts.length;
    });

    return <HomePageClient postsByYear={postsByYear} filteredYears={filteredYears} locale={locale} />;
  } catch (error) {
    console.warn("Failed to fetch posts for homepage:", error);

    const emptyPostsByYear: PostsByYear = {};
    const emptyFilteredYears: string[] = [];

    return <HomePageClient postsByYear={emptyPostsByYear} filteredYears={emptyFilteredYears} />;
  }
}
