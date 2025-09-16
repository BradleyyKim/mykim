"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useDeletePostBySlug } from "@/lib/query";

interface PostDetailActionsProps {
  postSlug: string;
}

export function PostDetailActions({ postSlug }: PostDetailActionsProps) {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const deletePostMutation = useDeletePostBySlug();
  const [isDeleting, setIsDeleting] = useState(false);

  // 로그인하지 않은 사용자에게는 버튼을 보여주지 않음
  if (!isLoggedIn) {
    return null;
  }

  const handleDelete = async () => {
    // 브라우저 기본 확인 창 사용
    const confirmed = window.confirm("이 포스트를 정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.");

    if (!confirmed) {
      return;
    }

    try {
      setIsDeleting(true);
      await deletePostMutation.mutateAsync(postSlug);
      // 삭제 성공 시 메인 페이지로 이동
      router.push("/");
    } catch (error) {
      console.error("포스트 삭제 중 오류:", error);
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex gap-2 mt-4">
      <Link href={`/edit/${postSlug}`}>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Edit className="h-4 w-4" />
          수정
        </Button>
      </Link>

      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
        onClick={handleDelete}
        disabled={isDeleting}
      >
        {isDeleting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            삭제 중...
          </>
        ) : (
          <>
            <Trash2 className="h-4 w-4" />
            삭제
          </>
        )}
      </Button>
    </div>
  );
}
