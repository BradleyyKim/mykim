"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState, ReactNode } from "react";

// API 클라이언트 가져오기
import { apiClient } from "./api-client";

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

// POST 관련 React Query 훅
export function useCreatePost() {
  const createPost = async (data: { title: string; content: string; category?: string; tags?: string }) => {
    // 태그 분할 처리
    const tags = data.tags
      ? data.tags
          .split(",")
          .map(tag => tag.trim())
          .filter(Boolean)
      : [];

    return apiClient.createPost({
      ...data,
      tags
    });
  };

  return { createPost };
}

// GET 관련 React Query 훅
export function usePosts() {
  const getPosts = async () => {
    return apiClient.getPosts();
  };

  return { getPosts };
}
