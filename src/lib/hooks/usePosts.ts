"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Post as PostType } from "@/lib/api";
import { API_ENDPOINTS, POSTS_PER_PAGE } from "@/lib/constants";

export interface UsePostsResult {
  posts: PostType[];
  filteredPosts: PostType[];
  isLoading: boolean;
  totalPages: number;
  currentPage: number;
  searchQuery: string;
  isSearchOpen: boolean;
  handlePageChange: (page: number) => void;
  handleSearch: (query: string) => void;
  toggleSearch: () => void;
  closeSearch: () => void;
}

export default function usePosts(): UsePostsResult {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? parseInt(pageParam) : 1;

  const [posts, setPosts] = useState<PostType[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<PostType[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // 포스트 로딩 함수
  const fetchPosts = async (page: number) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_ENDPOINTS.POSTS}?sort=createdAt:desc&populate=*&pagination[page]=${page}&pagination[pageSize]=${POSTS_PER_PAGE}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
        cache: "no-store"
      });

      if (!res.ok) {
        console.error("Failed to fetch posts:", res.status);
        return;
      }

      const data = await res.json();
      const fetchedPosts = data.data || [];
      setPosts(fetchedPosts);
      setFilteredPosts(fetchedPosts);

      // 페이지네이션 메타데이터 설정
      if (data.meta?.pagination) {
        setTotalPages(data.meta.pagination.pageCount);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 페이지 변경 함수
  const handlePageChange = (page: number) => {
    router.push(`/?page=${page}`);
  };

  // 페이지 번호 또는 마운트 시 포스트 로드
  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage]);

  // 검색 처리 함수
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredPosts(posts);
      return;
    }

    const lowerCaseQuery = query.toLowerCase();
    const filtered = posts.filter(
      post => post.title.toLowerCase().includes(lowerCaseQuery) || post.content.toLowerCase().includes(lowerCaseQuery) || (post.description && post.description.toLowerCase().includes(lowerCaseQuery))
    );

    setFilteredPosts(filtered);
  };

  // 검색창 토글 함수
  const toggleSearch = () => {
    setIsSearchOpen(prev => !prev);
    // 검색창이 닫힐 때 검색어 초기화
    if (isSearchOpen) {
      setSearchQuery("");
      setFilteredPosts(posts);
    }
  };

  // 검색창 닫기
  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
    setFilteredPosts(posts);
  };

  return {
    posts,
    filteredPosts,
    isLoading,
    totalPages,
    currentPage,
    searchQuery,
    isSearchOpen,
    handlePageChange,
    handleSearch,
    toggleSearch,
    closeSearch
  };
}
