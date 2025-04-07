"use client";

import { useState } from "react";
import { Post } from "@/lib/api";
import PostCard from "./PostCard";
import SearchBar from "./SearchBar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filter } from "lucide-react";

// 카테고리 타입 정의
interface CategoryAttribute {
  name?: string;
  slug?: string;
  [key: string]: unknown;
}

interface Category {
  id?: number;
  attributes?: CategoryAttribute;
}

interface PostListProps {
  initialPosts: Post[];
}

const categories = [
  { id: "all", name: "전체보기", icon: "🔍" },
  { id: "tech-ideas", name: "기술 아이디어", icon: "🎯" },
  { id: "fitness", name: "운동", icon: "🏋" },
  { id: "food", name: "요리 & 음식", icon: "🍳" },
  { id: "hobby", name: "취미 & 일상", icon: "🎨" },
  { id: "blog", name: "블로그", icon: "📖" }
];

const sortOptions = [
  { value: "latest", label: "최신순" },
  { value: "oldest", label: "오래된순" },
  { value: "popular", label: "인기순" }
];

export default function PostList({ initialPosts }: PostListProps) {
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(initialPosts);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState("latest");
  const [isLoading, setIsLoading] = useState(false);

  // 인기 있는 포스트 (예시로 첫 3개를 사용)
  const popularPosts = [...initialPosts].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()).slice(0, 3);

  // 검색 기능
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applyFilters(query, activeCategory, sortOrder);
  };

  // 카테고리 필터
  const handleCategoryChange = (category: string) => {
    setIsLoading(true);
    setActiveCategory(category);

    // 로딩 효과를 위한 지연
    setTimeout(() => {
      applyFilters(searchQuery, category, sortOrder);
      setIsLoading(false);
    }, 300);
  };

  // 정렬 변경
  const handleSortChange = (sort: string) => {
    setSortOrder(sort);
    applyFilters(searchQuery, activeCategory, sort);
  };

  // 모든 필터 적용
  const applyFilters = (query: string, category: string, sort: string) => {
    // 1. 검색어 필터링
    let result = initialPosts;

    if (query.trim() !== "") {
      result = result.filter(post => post.title.toLowerCase().includes(query.toLowerCase()) || post.content.toLowerCase().includes(query.toLowerCase()));
    }

    // 2. 카테고리 필터링
    if (category !== "all") {
      result = result.filter(post => {
        if (!post.categories || post.categories.length === 0) return false;
        return post.categories.some((cat: Category) => cat.attributes?.slug === category || cat.attributes?.name?.toLowerCase() === category.toLowerCase());
      });
    }

    // 3. 정렬 적용
    if (sort === "latest") {
      result.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    } else if (sort === "oldest") {
      result.sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime());
    }
    // '인기순' 정렬은 구현을 위한 데이터가 필요하므로 현재는 최신순과 동일하게 처리

    setFilteredPosts(result);
  };

  // 포스트 없는 경우 표시할 컴포넌트
  const EmptyState = () => (
    <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-500">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1}
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        />
      </svg>
      <p className="text-lg font-medium">검색 결과가 없습니다.</p>
      <p className="text-sm mt-2">다른 검색어나 필터를 시도해보세요.</p>
      <Button
        variant="outline"
        className="mt-4"
        onClick={() => {
          setSearchQuery("");
          setActiveCategory("all");
          setSortOrder("latest");
          applyFilters("", "all", "latest");
        }}
      >
        필터 초기화
      </Button>
    </div>
  );

  // 스켈레톤 로딩 컴포넌트
  const PostSkeleton = () => (
    <div className="h-full flex flex-col overflow-hidden shadow-sm rounded-xl animate-pulse">
      <div className="p-4">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
      <div className="mt-auto p-4 border-t">
        <div className="flex justify-between">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* 인기 포스트 섹션 */}
      <div className="mb-12">
        <h2 className="text-xl font-bold mb-6 text-amber-800">인기 포스트</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {popularPosts.map(post => (
            <PostCard key={`popular-${post.id}`} post={post} />
          ))}
        </div>
      </div>

      {/* 검색 및 필터 섹션 */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm py-4 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="w-full md:w-1/2">
            <SearchBar onSearch={handleSearch} />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Filter size={16} />
              <span>정렬:</span>
            </div>
            <select value={sortOrder} onChange={e => handleSortChange(e.target.value)} className="rounded-md border border-gray-300 py-1 px-2 text-sm bg-white">
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 카테고리 탭 */}
      <div className="mb-8">
        <Tabs defaultValue="all" value={activeCategory} onValueChange={handleCategoryChange}>
          <TabsList className="w-full flex overflow-x-auto pb-2 mb-2">
            {categories.map(category => (
              <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-1 px-4 py-2">
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeCategory} className="mt-0">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <PostSkeleton key={i} />
                  ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredPosts.length > 0 ? filteredPosts.map(post => <PostCard key={post.id} post={post} />) : <EmptyState />}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
