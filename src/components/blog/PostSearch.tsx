"use client";

import { useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useBlogAnalytics } from "@/hooks/useGoogleAnalytics";

interface PostSearchProps {
  isSearchOpen: boolean;
  searchQuery: string;
  onToggleSearch: () => void;
  onCloseSearch: () => void;
  onSearch: (query: string) => void;
}

export default function PostSearch({
  isSearchOpen,
  searchQuery,
  onToggleSearch,
  onCloseSearch,
  onSearch
}: PostSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { trackSearch } = useBlogAnalytics();

  // 검색어 변경 시 분석 이벤트 포함한 핸들러
  const handleSearchWithAnalytics = useCallback(
    (query: string) => {
      onSearch(query);

      // Google Analytics에 검색 이벤트 추적 (빈 검색어가 아니고 이전 검색어와 다른 경우)
      if (query.trim() && query.trim() !== searchQuery.trim()) {
        trackSearch(query.trim());
      }
    },
    [onSearch, searchQuery, trackSearch]
  );

  // 검색창이 열릴 때 자동 포커스
  const handleToggleSearch = () => {
    onToggleSearch();
    if (!isSearchOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  return (
    <div className="flex justify-center items-center mb-8 relative">
      {isSearchOpen ? (
        <div className="flex w-full max-w-md items-center transition-all duration-300 ease-in-out">
          <div className="relative flex-1">
            <Input
              ref={inputRef}
              type="text"
              placeholder="게시물 검색..."
              value={searchQuery}
              onChange={e => handleSearchWithAnalytics(e.target.value)}
              className="pr-10 shadow-sm border-blue-200 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            {searchQuery && (
              <button
                onClick={() => handleSearchWithAnalytics("")}
                className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="검색어 지우기"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <button
            onClick={onCloseSearch}
            className="ml-2 rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="검색 닫기"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      ) : (
        <button
          onClick={handleToggleSearch}
          className="group flex items-center space-x-2 transition-all duration-200 ease-in-out"
          aria-label="검색 열기"
        >
          <h1 className="text-3xl font-bold italic group-hover:text-blue-600">Posts</h1>
          <Search className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transform transition-transform group-hover:scale-110" />
        </button>
      )}
    </div>
  );
}
