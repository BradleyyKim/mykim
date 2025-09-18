"use client";

import Link from "next/link";
import { Tag } from "@/lib/api";

interface TagsPageClientProps {
  tags: Tag[];
}

export default function TagsPageClient({ tags }: TagsPageClientProps) {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm font-bold text-gray-900 dark:text-gray-100 mb-6">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            Tags
          </div>
          {/* <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">모든 태그</h1> */}
          <p className="text-lg text-gray-900 dark:text-gray-100 max-w-2xl mx-auto">
            태그를 클릭하여 관련 포스트를 탐색해보세요.
          </p>
        </div>

        {/* 태그 목록 */}
        {tags.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {tags.map(tag => (
              <Link
                key={tag.id}
                href={`/tags/${tag.slug}`}
                className="group relative inline-flex items-center gap-2 px-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 hover:scale-105 hover:shadow-sm"
              >
                {/* 태그 아이콘 */}
                <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                  <div className="relative">
                    <svg
                      className="w-4 h-4 text-blue-500 dark:text-blue-400 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-all duration-200 group-hover:scale-110"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    {/* 작은 점 표시 */}
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 dark:bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                  </div>
                </div>

                {/* 태그 이름 */}
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors duration-200 truncate max-w-[200px]">
                  {tag.name}
                </span>

                {/* 호버 시 화살표 */}
                <div className="flex-shrink-0 w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <svg
                    className="w-3 h-3 text-gray-500 dark:text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-6">
              <svg
                className="w-8 h-8 text-gray-400 dark:text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">아직 태그가 없습니다</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              포스트를 작성하면서 태그를 추가해보세요. 태그는 콘텐츠를 분류하고 찾기 쉽게 만들어줍니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
