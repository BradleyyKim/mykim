"use client";

import { QueryClient, QueryClientProvider, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState, ReactNode, useEffect } from "react";

// API 클라이언트 가져오기
import { apiClient } from "./api-client";

// 관리자 상태 관리
export const useAdminAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 로컬 스토리지에서 토큰 확인
    const token = localStorage.getItem("adminJwtToken");
    setIsLoggedIn(!!token);
    setIsLoading(false);
  }, []);

  const login = async (credentials: { identifier: string; password: string }) => {
    const response = await apiClient.login(credentials);
    localStorage.setItem("adminJwtToken", response.jwt);
    localStorage.setItem("adminUser", JSON.stringify(response.user));
    setIsLoggedIn(true);
    return response;
  };

  const logout = () => {
    localStorage.removeItem("adminJwtToken");
    localStorage.removeItem("adminUser");
    setIsLoggedIn(false);
  };

  return {
    isLoggedIn,
    isLoading,
    login,
    logout
  };
};

// TanStack Query 프로바이더 컴포넌트
export function TanstackProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1분
            refetchOnWindowFocus: false
          }
        }
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

// 로그인 관련 React Query 훅
export function useLoginMutation() {
  const { login } = useAdminAuth();

  return useMutation({
    mutationFn: (credentials: { identifier: string; password: string }) => login(credentials),
    onSuccess: () => {
      console.log("로그인 성공");
    }
  });
}

// POST 관련 React Query 훅
export function useCreatePost() {
  const queryClient = useQueryClient();

  const createPost = async (data: {
    title: string;
    content: string;
    description?: string;
    category?: string;
    slug?: string;
    featuredImage?: {
      url: string;
      alternativeText?: string;
    } | null;
    publishedDate?: string;
  }) => {
    // 제목, 내용, 설명, 카테고리, slug, 발행날짜 처리
    return apiClient.createPost({
      title: data.title,
      content: data.content,
      description: data.description,
      category: data.category,
      slug: data.slug,
      featuredImage: data.featuredImage,
      publishedDate: data.publishedDate
    });
  };

  // useMutation 반환
  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      // 포스트 생성 성공 시 posts 캐시를 무효화하여 최신 데이터로 갱신
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      console.log("포스트 생성 완료 및 캐시 무효화");
    },
    onError: error => {
      console.error("포스트 생성 실패:", error);
    }
  });
}

// 포스트 목록 가져오기 훅
export function usePosts() {
  return useQuery({
    queryKey: ["posts"],
    queryFn: apiClient.getPosts
  });
}

// 포스트 수정 훅
export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: object }) => apiClient.updatePost(id, data),
    onSuccess: () => {
      // 포스트 수정 성공 시 관련 캐시들을 무효화
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      console.log("포스트 수정 완료 및 캐시 무효화");
    }
  });
}

// 포스트 삭제 훅
export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => apiClient.deletePost(id),
    onSuccess: () => {
      // 포스트 삭제 성공 시 posts 캐시를 무효화
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      console.log("포스트 삭제 완료 및 캐시 무효화");
    }
  });
}

// Slug 기반 포스트 수정 훅
export function useUpdatePostBySlug() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      slug,
      data
    }: {
      slug: string;
      data: {
        title?: string;
        content?: string;
        description?: string;
        category?: number | string;
        slug?: string;
        featuredImage?: { url: string; alternativeText?: string } | null;
        publishedDate?: string;
      };
    }) => apiClient.updatePostBySlug(slug, data),
    onSuccess: () => {
      // Slug 기반 포스트 수정 성공 시 관련 캐시들을 무효화
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      console.log("포스트 수정 완료 및 캐시 무효화");
    }
  });
}

// Slug 기반 포스트 삭제 훅
export function useDeletePostBySlug() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slug: string) => apiClient.deletePostBySlug(slug),
    onSuccess: () => {
      // Slug 기반 포스트 삭제 성공 시 posts 캐시를 무효화
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      console.log("포스트 삭제 완료 및 캐시 무효화");
    }
  });
}
