"use client";

import { useCreatePost } from "@/lib/tanstack-query";
import { ProtectedRoute } from "@/lib/auth";
import PostForm from "@/components/PostForm";

function WritePageContent() {
  const createPostMutation = useCreatePost();

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
    await createPostMutation.mutateAsync({
      title: data.title,
      content: data.content,
      description: data.description,
      category: data.category,
      slug: data.slug,
      featuredImage: data.featuredImage,
      publishedDate: data.publishedDate
    });
  };

  return <PostForm onSubmit={handleSubmit} submitText="작성하기" title="새 글 작성" />;
}

// 메인 컴포넌트 - ProtectedRoute로 감싸서 인증 체크
export default function WritePage() {
  return (
    <ProtectedRoute>
      <WritePageContent />
    </ProtectedRoute>
  );
}
