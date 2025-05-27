"use client";

import { CalendarIcon, TagIcon, EyeIcon, Clock3Icon } from "lucide-react";
import { formatDistanceToNow, format, differenceInDays } from "date-fns";
import { ko } from "date-fns/locale";
import { Post as PostType } from "@/lib/api";
import { getCategoryName, calculateReadingTime } from "@/lib/utils";
import { extractPlainText } from "@/lib/tiptap-renderer";

interface PostCardProps {
  post: PostType;
}

export default function PostCard({ post }: PostCardProps) {
  const categoryName = getCategoryName(post.category);

  // publishedDate가 있으면 우선 사용하고, 없으면 createdAt을 fallback으로 사용
  const displayDate = post.publishedDate || post.createdAt;
  const postDate = new Date(displayDate);
  const daysAgo = differenceInDays(new Date(), postDate);
  const isRecent = daysAgo <= 3; // 3일 이내의 게시물인지 확인

  // 예상 읽기 시간 계산
  const content = post.content || "";
  const readingTimeMinutes = calculateReadingTime(content);

  // 날짜 표시 형식 결정
  const dateDisplay = isRecent ? formatDistanceToNow(postDate, { addSuffix: true, locale: ko }) : format(postDate, "yyyy년 MM월 dd일", { locale: ko });

  // 내용 요약 안전하게 생성 (Tiptap JSON에서 플레인 텍스트 추출)
  const plainContent = extractPlainText(content, 240);
  const description = post.description ? extractPlainText(post.description, 240) : "";
  const contentSummary = description || (plainContent.length > 0 ? plainContent : "내용 없음");

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
            <time dateTime={displayDate} className={isRecent ? "font-medium" : ""}>
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
