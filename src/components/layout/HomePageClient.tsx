"use client";

import Link from "next/link";
import { formatDate } from "date-fns";
import type { PostsByYear } from "@/lib/types/post";
import { getLocalePath } from "@/i18n";
import type { Locale } from "@/i18n";

interface HomePageClientProps {
  postsByYear: PostsByYear;
  filteredYears: string[];
  locale?: Locale;
}

export default function HomePageClient({ postsByYear, filteredYears, locale = "ko" }: HomePageClientProps) {
  const dateFormat = locale === "en" ? "MMM dd, yyyy" : "yyyy.MM.dd";

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="space-y-16">
        {filteredYears.map((year) => {
          const postsCount = postsByYear[year].totalCount;

          return (
            <div key={year} className="year-section">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-1/4 mb-6 md:mb-0">
                  <div className="sticky top-20">
                    <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                      {year}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {postsCount.toLocaleString()} posts
                    </p>
                  </div>
                </div>
                <div className="w-full md:w-3/4">
                  <div className="space-y-6">
                    {postsByYear[year].posts.map((post) => (
                      <article
                        key={post.id}
                        className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700 last:border-0 transition-all hover:translate-x-1"
                      >
                        <Link href={getLocalePath(locale, `/posts/${post.slug}`)} className="block group">
                          <div className="flex justify-between items-center">
                            <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 group-hover:text-gray-600 dark:group-hover:text-gray-300">
                              {post.title}
                            </h2>
                            <div className="ml-4 flex-shrink-0 text-sm text-gray-500 dark:text-gray-400">
                              {formatDate(new Date(post.publishedDate), dateFormat)}
                            </div>
                          </div>
                        </Link>
                      </article>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
