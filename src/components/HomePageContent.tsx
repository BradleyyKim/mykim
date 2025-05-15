"use client";

import { PostSearch, PostList, Pagination } from "@/components/blog";
import usePosts from "@/lib/hooks/usePosts";

/**
 * 메인 페이지 컨텐츠 컴포넌트
 * - 검색 기능과 포스트 목록, 페이지네이션을 포함
 * - 데이터 로직은 usePosts 훅으로 분리
 */
export default function HomePageContent() {
  const { filteredPosts, isLoading, totalPages, currentPage, searchQuery, isSearchOpen, handlePageChange, handleSearch, toggleSearch, closeSearch } = usePosts();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* 검색 컴포넌트 */}
      <PostSearch isSearchOpen={isSearchOpen} searchQuery={searchQuery} onToggleSearch={toggleSearch} onCloseSearch={closeSearch} onSearch={handleSearch} />

      {/* 포스트 목록 */}
      <PostList posts={filteredPosts} searchQuery={searchQuery} isLoading={isLoading} onClearSearch={() => handleSearch("")} />

      {/* 페이지네이션 (검색 상태가 아닐 때만 표시) */}
      {!searchQuery && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />}
    </div>
  );
}
