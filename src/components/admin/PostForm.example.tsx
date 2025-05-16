"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { revalidatePosts, revalidatePost } from "@/lib/revalidate";
import { Post } from "@/lib/api";

interface PostFormProps {
  initialData?: Post | null;
}

// 이 컴포넌트는 예시용입니다 - 실제 구현은 다를 수 있습니다
export default function PostForm({ initialData = null }: PostFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 폼 제출 처리
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(event.currentTarget);
      const postData = Object.fromEntries(formData.entries());

      let response;
      let postId;

      // 새 게시물 생성 또는 기존 게시물 업데이트
      if (initialData?.id) {
        // 기존 게시물 업데이트
        response = await fetch(`/api/posts/${initialData.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(postData)
        });
        postId = initialData.id;
      } else {
        // 새 게시물 생성
        response = await fetch("/api/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(postData)
        });
        const data = await response.json();
        postId = data.id;
      }

      if (!response.ok) {
        throw new Error("포스트 저장 중 오류가 발생했습니다");
      }

      // 중요: 게시물 캐시 재검증
      // 이 부분이 핵심입니다 - 새 게시물이 메인 페이지에 즉시 표시되도록 합니다
      await revalidatePosts();

      // 특정 게시물 페이지도 재검증
      if (postId) {
        await revalidatePost(postId);
      }

      // 메인 페이지로 리디렉션
      router.push("/");
      router.refresh(); // 현재 라우트 리프레시 (옵션)
    } catch (error) {
      console.error("게시물 제출 오류:", error);
      // 오류 처리 (예: 오류 메시지 표시)
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* 폼 필드들 (예시) */}
      <div className="mb-4">
        <label htmlFor="title" className="block mb-2">
          제목
        </label>
        <input type="text" id="title" name="title" defaultValue={initialData?.title || ""} className="w-full p-2 border rounded" required />
      </div>

      <div className="mb-4">
        <label htmlFor="content" className="block mb-2">
          내용
        </label>
        <textarea id="content" name="content" defaultValue={initialData?.content || ""} className="w-full p-2 border rounded" rows={10} required />
      </div>

      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded" disabled={isSubmitting}>
        {isSubmitting ? "저장 중..." : initialData?.id ? "업데이트" : "게시물 작성"}
      </button>
    </form>
  );
}
