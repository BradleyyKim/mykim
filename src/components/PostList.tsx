"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Post, fetchPostsClient } from "@/lib/api";
import PostCard from "./PostCard";
import SearchBar from "./SearchBar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filter, X, RefreshCw } from "lucide-react";

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

interface TagAttribute {
  name?: string;
  slug?: string;
  [key: string]: unknown;
}

interface Tag {
  id?: number;
  attributes?: TagAttribute;
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
  const searchParams = useSearchParams();
  const router = useRouter();

  const [filteredPosts, setFilteredPosts] = useState<Post[]>(initialPosts);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeTag, setActiveTag] = useState("");
  const [sortOrder, setSortOrder] = useState("latest");
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeFilters, setActiveFilters] = useState<{ type: string; value: string }[]>([]);

  // 디버깅 정보
  useEffect(() => {
    console.log("🔍 PostList - 초기 포스트:", initialPosts);
  }, [initialPosts]);

  // 모든 필터 적용 - useCallback으로 메모이제이션
  const applyFilters = useCallback(
    (query: string, category: string, tag: string, sort: string, postsToFilter: Post[] = initialPosts) => {
      console.log("🔍 필터 적용 시작:", { query, category, tag, sort });
      console.time("applyFilters");

      // 1. 검색어 필터링
      let result = postsToFilter;

      if (query.trim() !== "") {
        result = result.filter(post => post.title.toLowerCase().includes(query.toLowerCase()) || post.content.toLowerCase().includes(query.toLowerCase()));
        console.log(`검색어 '${query}'로 필터링 후 결과:`, result.length);
      }

      // 2. 카테고리 필터링
      if (category !== "all") {
        result = result.filter(post => {
          if (!post.categories || post.categories.length === 0) return false;
          return post.categories.some((cat: Category) => cat.attributes?.slug === category || cat.attributes?.name?.toLowerCase() === category.toLowerCase());
        });
        console.log(`카테고리 '${category}'로 필터링 후 결과:`, result.length);
      }

      // 3. 태그 필터링
      if (tag) {
        result = result.filter(post => {
          if (!post.tags || post.tags.length === 0) return false;
          return post.tags.some((t: Tag) => t.attributes?.slug === tag || t.attributes?.name?.toLowerCase() === tag.toLowerCase());
        });
        console.log(`태그 '${tag}'로 필터링 후 결과:`, result.length);
      }

      // 4. 정렬 적용
      if (sort === "latest") {
        result.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
      } else if (sort === "oldest") {
        result.sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime());
      }
      console.log(`'${sort}' 정렬 적용 후 결과:`, result.length);

      console.timeEnd("applyFilters");
      console.log("🔍 필터링 완료. 최종 포스트 수:", result.length);
      setFilteredPosts(result);
    },
    [initialPosts]
  );

  // URL에서 초기 필터 상태 가져오기
  useEffect(() => {
    const category = searchParams.get("category");
    const tag = searchParams.get("tag");
    const search = searchParams.get("q");

    const filters: { type: string; value: string }[] = [];

    if (category) {
      setActiveCategory(category);
      filters.push({ type: "category", value: category });
    }

    if (tag) {
      setActiveTag(tag);
      filters.push({ type: "tag", value: tag });
    }

    if (search) {
      setSearchQuery(search);
      filters.push({ type: "search", value: search });
    }

    setActiveFilters(filters);

    // 필터 적용
    applyFilters(search || "", category || "all", tag || "", sortOrder);
  }, [searchParams, applyFilters, sortOrder]);

  // 수동으로 데이터 새로고침
  const refreshData = async () => {
    try {
      setIsRefreshing(true);
      console.log("🔄 포스트 데이터 새로고침 시작...");
      const freshPosts = await fetchPostsClient();
      console.log("🔄 새로 가져온 포스트:", freshPosts);

      // 현재 필터를 새로운 데이터에 적용
      applyFilters(searchQuery, activeCategory, activeTag, sortOrder, freshPosts);

      setIsRefreshing(false);
    } catch (error) {
      console.error("❌ 데이터 새로고침 실패:", error);
      setIsRefreshing(false);
    }
  };

  // 인기 있는 포스트 (예시로 첫 3개를 사용)
  const popularPosts = [...initialPosts].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()).slice(0, 3);

  // 검색 기능
  const handleSearch = (query: string) => {
    console.log("🔍 검색 필터 적용:", query);
    // URL 업데이트
    updateUrl({ q: query || null });

    setSearchQuery(query);
    const updatedFilters = activeFilters.filter(f => f.type !== "search");
    if (query) {
      updatedFilters.push({ type: "search", value: query });
    }
    setActiveFilters(updatedFilters);

    applyFilters(query, activeCategory, activeTag, sortOrder);
  };

  // 카테고리 필터
  const handleCategoryChange = (category: string) => {
    console.log("🔍 카테고리 필터 적용:", category);
    setIsLoading(true);
    setActiveCategory(category);

    // URL 업데이트
    updateUrl({ category: category === "all" ? null : category });

    // 필터 업데이트
    const updatedFilters = activeFilters.filter(f => f.type !== "category");
    if (category !== "all") {
      updatedFilters.push({ type: "category", value: category });
    }
    setActiveFilters(updatedFilters);

    // 로딩 효과를 위한 지연
    setTimeout(() => {
      applyFilters(searchQuery, category, activeTag, sortOrder);
      setIsLoading(false);
    }, 300);
  };

  // 태그 필터
  const handleTagFilter = (tag: string) => {
    console.log("🔍 태그 필터 적용:", tag);
    setActiveTag(tag);

    // URL 업데이트
    updateUrl({ tag: tag || null });

    // 필터 업데이트
    const updatedFilters = activeFilters.filter(f => f.type !== "tag");
    if (tag) {
      updatedFilters.push({ type: "tag", value: tag });
    }
    setActiveFilters(updatedFilters);

    applyFilters(searchQuery, activeCategory, tag, sortOrder);
  };

  // 정렬 변경
  const handleSortChange = (sort: string) => {
    console.log("🔍 정렬 변경:", sort);
    setSortOrder(sort);
    applyFilters(searchQuery, activeCategory, activeTag, sort);
  };

  // URL 업데이트 함수
  const updateUrl = useCallback(
    (params: Record<string, string | null>) => {
      const url = new URL(window.location.href);

      Object.entries(params).forEach(([key, value]) => {
        if (value === null) {
          url.searchParams.delete(key);
        } else {
          url.searchParams.set(key, value);
        }
      });

      router.replace(url.pathname + url.search);
    },
    [router]
  );

  // 필터 제거
  const removeFilter = (type: string, value: string) => {
    console.log("🔍 필터 제거:", type, value);
    const newFilters = activeFilters.filter(f => !(f.type === type && f.value === value));
    setActiveFilters(newFilters);

    if (type === "category") {
      setActiveCategory("all");
      updateUrl({ category: null });
    } else if (type === "tag") {
      setActiveTag("");
      updateUrl({ tag: null });
    } else if (type === "search") {
      setSearchQuery("");
      updateUrl({ q: null });
    }

    applyFilters(type === "search" ? "" : searchQuery, type === "category" ? "all" : activeCategory, type === "tag" ? "" : activeTag, sortOrder);
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
          setActiveTag("");
          setSortOrder("latest");
          setActiveFilters([]);
          applyFilters("", "all", "", "latest");

          // URL 초기화
          updateUrl({ q: null, category: null, tag: null });
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

  // 활성 필터 표시 컴포넌트
  const ActiveFilters = () => {
    if (activeFilters.length === 0) return null;

    return (
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((filter, index) => (
            <div key={index} className="flex items-center gap-1 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-sm">
              <span>{filter.type === "category" ? "카테고리:" : filter.type === "tag" ? "태그:" : "검색:"}</span>
              <span>{filter.value}</span>
              <button onClick={() => removeFilter(filter.type, filter.value)} className="ml-1 text-amber-800 hover:text-amber-900">
                <X size={14} />
              </button>
            </div>
          ))}
          {activeFilters.length > 0 && (
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("all");
                setActiveTag("");
                setActiveFilters([]);
                applyFilters("", "all", "", sortOrder);

                // URL 초기화
                updateUrl({ q: null, category: null, tag: null });
              }}
              className="text-sm text-amber-600 hover:text-amber-800"
            >
              모두 지우기
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-10">
      {/* 디버깅 정보 및 데이터 새로고침 버튼 */}
      <div className="bg-gray-100 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-semibold">디버깅 정보</h3>
          <Button variant="outline" size="sm" onClick={refreshData} disabled={isRefreshing} className="flex items-center gap-1">
            <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
            {isRefreshing ? "새로고침 중..." : "API에서 새로고침"}
          </Button>
        </div>
        <div className="text-xs space-y-1">
          <p>초기 포스트 수: {initialPosts.length}</p>
          <p>필터링된 포스트 수: {filteredPosts.length}</p>
          <p>활성 필터: {activeFilters.length > 0 ? activeFilters.map(f => `${f.type}:${f.value}`).join(", ") : "없음"}</p>
        </div>
      </div>

      {/* 인기 포스트 섹션 */}
      {popularPosts.length > 0 && !activeFilters.length && (
        <section>
          <h2 className="text-2xl font-bold mb-6 text-amber-800 border-b pb-2">인기 포스트</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {popularPosts.map(post => (
              <PostCard key={`popular-${post.id}`} post={post} onTagClick={handleTagFilter} />
            ))}
          </div>
        </section>
      )}

      {/* 검색 및 필터 섹션 */}
      <section className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm py-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4">
          <div className="w-full md:w-1/2">
            <SearchBar initialValue={searchQuery} onSearch={handleSearch} />
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

        {/* 활성 필터 표시 */}
        <ActiveFilters />
      </section>

      {/* 카테고리 탭 */}
      <section>
        <Tabs defaultValue="all" value={activeCategory} onValueChange={handleCategoryChange}>
          <TabsList className="w-full flex overflow-x-auto p-1 bg-amber-50 rounded-md mb-6">
            {categories.map(category => (
              <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-1 px-4 py-2 data-[state=active]:bg-amber-100 data-[state=active]:text-amber-900">
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeCategory} className="mt-0">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <PostSkeleton key={i} />
                  ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.length > 0 ? filteredPosts.map(post => <PostCard key={post.id} post={post} onTagClick={handleTagFilter} />) : <EmptyState />}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
