"use client";

import { CalendarIcon, TagIcon, EyeIcon, Clock3Icon } from "lucide-react";
import { formatDistanceToNow, format, differenceInDays } from "date-fns";
import { ko } from "date-fns/locale";
import { Post as PostType } from "@/lib/api";

type StrapiAttribute = {
  name?: string;
  slug?: string;
  [key: string]: unknown;
};

type StrapiData = {
  id?: number | string;
  attributes?: StrapiAttribute;
  name?: string;
  slug?: string;
  [key: string]: unknown;
};

type StrapiRelation = {
  data?: StrapiData | null;
  [key: string]: unknown;
};

interface PostCardProps {
  post: PostType;
}

export function getCategoryName(category: unknown): string | null {
  if (!category) return null;

  // Strapi의 관계 데이터 형식에 맞춰 처리
  // 1. category가 직접 객체로 제공되는 경우 (populate로 가져온 경우)
  if (typeof category === "object" && category !== null) {
    // Strapi v4 형식: category.data.attributes
    if ("data" in category) {
      const relation = category as StrapiRelation;
      if (relation.data && typeof relation.data === "object") {
        const data = relation.data;
        if (data.attributes) {
          return data.attributes.name || data.attributes.slug || null;
        }
        return data.name || data.slug || null;
      }
      return null;
    }

    // 일반 객체 형식: category.name 또는 category.attributes.name
    const categoryObj = category as Record<string, unknown>;
    if (categoryObj.attributes && typeof categoryObj.attributes === "object") {
      const attributes = categoryObj.attributes as StrapiAttribute;
      return attributes.name || attributes.slug || JSON.stringify(category);
    }
    if (typeof categoryObj.name === "string") {
      return categoryObj.name;
    }
    if (typeof categoryObj.slug === "string") {
      return categoryObj.slug;
    }
    return JSON.stringify(category);
  }

  // 문자열로 제공되는 경우 (id나 slug)
  return String(category);
}

// HTML 태그 제거 함수
export const stripHtml = (html: string) => {
  return html
    .replace(/<[^>]*>/g, "") // HTML 태그 제거
    .replace(/&nbsp;/g, " ") // 특수 HTML 엔티티 처리
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .trim();
};

export default function PostCard({ post }: PostCardProps) {
  const categoryName = getCategoryName(post.category);
  const postDate = new Date(post.createdAt);
  const daysAgo = differenceInDays(new Date(), postDate);
  const isRecent = daysAgo <= 3; // 3일 이내의 게시물인지 확인

  // 예상 읽기 시간 계산 (대략적인 계산: 평균 250단어/분)
  // content가 null/undefined인 경우 안전하게 처리
  const content = post.content || "";

  const plainContent = stripHtml(content);
  const wordCount = plainContent.split(/\s+/).length;
  const readingTimeMinutes = Math.max(1, Math.round(wordCount / 250));

  // 날짜 표시 형식 결정
  const dateDisplay = isRecent ? formatDistanceToNow(postDate, { addSuffix: true, locale: ko }) : format(postDate, "yyyy년 MM월 dd일", { locale: ko });

  // 내용 요약 안전하게 생성 (HTML 태그 제거)
  const description = post.description ? stripHtml(post.description) : "";
  const contentSummary = description || (plainContent.length > 0 ? plainContent.substring(0, 240) : "내용 없음");

  return (
    <article
      className={`border rounded-lg overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col hover:border-blue-200 dark:hover:border-blue-800 ${isRecent ? "animate-pulse-slow" : ""}`}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h2 className="text-2xl font-bold group-hover:text-blue-600 transition-colors duration-200 flex-1 pr-3">{post.title}</h2>
          {categoryName && (
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1 text-sm shrink-0 ml-2">
              <TagIcon className="h-3.5 w-3.5 mr-1 text-gray-500" />
              <span className="text-gray-700 dark:text-gray-300">{categoryName}</span>
            </div>
          )}
        </div>

        <div className="flex items-center text-gray-500 text-sm mb-4 flex-wrap">
          <div className={`flex items-center mr-4 ${isRecent ? "text-blue-500" : ""}`}>
            <CalendarIcon className="h-4 w-4 mr-1" />
            <time dateTime={post.createdAt} className={isRecent ? "font-medium" : ""}>
              {dateDisplay}
            </time>
          </div>

          {/* 예상 읽기 시간 표시 */}
          <div className="flex items-center mr-4">
            <Clock3Icon className="h-4 w-4 mr-1" />
            <span>{readingTimeMinutes}분 소요</span>
          </div>

          {/* 조회수 표시 (미구현) */}
          <div className="flex items-center">
            <EyeIcon className="h-4 w-4 mr-1" />
            <span>0 조회</span>
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-3">{contentSummary}...</p>

        <div className="flex justify-between items-center mt-3">
          <div className="text-blue-600 dark:text-blue-400 font-medium text-sm group-hover:underline">자세히 보기</div>

          {/* 새 게시물 배지 */}
          {isRecent && <div className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">NEW</div>}
        </div>
      </div>
    </article>
  );
}
