"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ProtectedRoute } from "@/lib/auth";
import { useUpdatePostBySlug } from "@/lib/tanstack-query";
import PostForm from "@/components/PostForm";
import { Loader2 } from "lucide-react";
import { getCategorySlug } from "@/lib/utils";
import { getPostBySlug } from "@/lib/services/post-service";
import { Post } from "@/lib/api";

function EditPageContent() {
  const params = useParams();
  const postSlug = params.slug as string;
  const updatePostMutation = useUpdatePostBySlug();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 포스트 데이터 로드
  useEffect(() => {
    const loadPost = async () => {
      try {
        setIsLoading(true);
        // 기존의 getPostBySlug 함수 사용
        const postData = await getPostBySlug(postSlug);

        if (!postData) {
          throw new Error("포스트를 찾을 수 없습니다");
        }

        setPost(postData);
      } catch (error) {
        console.error("포스트 로드 중 오류:", error);
        setError(error instanceof Error ? error.message : "포스트를 로드할 수 없습니다");
      } finally {
        setIsLoading(false);
      }
    };

    if (postSlug) {
      loadPost();
    }
  }, [postSlug]);

  const handleSubmit = async (data: {
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
    if (!post) {
      throw new Error("포스트 데이터가 없습니다");
    }

    await updatePostMutation.mutateAsync({
      slug: postSlug,
      data: {
        title: data.title,
        content: data.content,
        description: data.description,
        category: data.category,
        slug: data.slug,
        featuredImage: data.featuredImage,
        publishedDate: data.publishedDate
      }
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>포스트를 불러오는 중...</span>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error || "포스트를 찾을 수 없습니다"}
        </div>
      </div>
    );
  }

  // 카테고리 슬러그 추출
  const categorySlug = getCategorySlug(post.category);

  return (
    <PostForm
      initialData={{
        title: post.title,
        content: post.content,
        description: post.description || "",
        category: categorySlug || "",
        publishedDate: post.publishedDate || "",
        slug: post.slug || ""
      }}
      onSubmit={handleSubmit}
      submitText="수정하기"
      title="글 수정"
    />
  );
}

// 메인 컴포넌트 - ProtectedRoute로 감싸서 인증 체크
export default function EditPage() {
  return (
    <ProtectedRoute>
      <EditPageContent />
    </ProtectedRoute>
  );
}
