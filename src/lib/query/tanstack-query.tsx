"use client";

import { QueryClient, QueryClientProvider, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState, ReactNode, useEffect } from "react";

// API 클라이언트 가져오기
import { apiClient } from "../api/client";

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

// 전역 QueryClient 인스턴스 생성
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 캐시 전략 최적화
      staleTime: 5 * 60 * 1000, // 5분 (기존 1분에서 증가)
      gcTime: 10 * 60 * 1000, // 10분 (가비지 컬렉션 시간)
      refetchOnWindowFocus: false, // 윈도우 포커스 시 재요청 비활성화
      refetchOnMount: true, // 컴포넌트 마운트 시 재요청 활성화
      retry: 2, // 실패 시 2번 재시도
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000) // 지수 백오프
    },
    mutations: {
      retry: 1, // 뮤테이션 실패 시 1번 재시도
      retryDelay: 1000 // 1초 후 재시도
    }
  }
});

// TanStack Query 프로바이더 컴포넌트
export function TanstackProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

// queryClient export (다른 컴포넌트에서 사용 가능)
export { queryClient };

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
    onSuccess: data => {
      // 포스트 생성 성공 시 관련 캐시들을 무효화
      queryClient.invalidateQueries({ queryKey: ["posts"] });

      // 특정 포스트 캐시도 무효화 (slug가 있는 경우)
      if (data?.data?.slug) {
        queryClient.invalidateQueries({ queryKey: ["post", data.data.slug] });
      }

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
    onSuccess: (data, variables) => {
      // Slug 기반 포스트 수정 성공 시 관련 캐시들을 무효화
      queryClient.invalidateQueries({ queryKey: ["posts"] });

      // 기존 slug와 새 slug 모두 무효화
      queryClient.invalidateQueries({ queryKey: ["post", variables.slug] });
      if (variables.data.slug && variables.data.slug !== variables.slug) {
        queryClient.invalidateQueries({ queryKey: ["post", variables.data.slug] });
      }

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
