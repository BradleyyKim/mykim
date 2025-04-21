"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, X } from "lucide-react";
import { useCreatePost } from "@/lib/tanstack-query";
import { ProtectedRoute } from "@/lib/auth";
import RichTextEditor from "@/components/RichTextEditor";
import { Category } from "@/lib/api";

// 예시 카테고리 - API에서 로드하기 전 사용
const defaultCategories = [
  { id: 1, name: "아이디어를 빌드합니다", icon: "🎯", description: "기술 아이디어", slug: "tech-ideas" },
  { id: 2, name: "루틴을 디버그합니다", icon: "🏋", description: "운동", slug: "fitness" },
  { id: 3, name: "레시피를 커밋합니다", icon: "🍳", description: "요리 & 음식", slug: "food" },
  { id: 4, name: "삶을 디플로이합니다", icon: "🎨", description: "취미 & 일상", slug: "hobby" },
  { id: 5, name: "마음을 로깅합니다", icon: "📖", description: "블로그 글/시", slug: "blog" }
];

// 컴포넌트 2개로 분리
function WritePageContent() {
  const router = useRouter();
  const { createPost } = useCreatePost();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: ""
  });
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  // 카테고리 데이터 로드
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (response.ok) {
          const data = await response.json();
          if (data.data && Array.isArray(data.data)) {
            setCategories(
              data.data.map((item: { id: number; attributes?: { name?: string; slug?: string; description?: string } }) => ({
                id: item.id,
                name: item.attributes?.name || "카테고리",
                slug: item.attributes?.slug || "",
                description: item.attributes?.description || ""
              }))
            );
          }
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault();
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      setError("제목과 내용을 모두 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // 카테고리 문자열 값을 그대로 사용
      console.log("Submitting with category:", formData.category);

      // TanStack Query 훅 사용
      await createPost({
        title: formData.title,
        content: formData.content,
        category: formData.category
      });

      // 메인 페이지로 이동 (강제 새로고침)
      window.location.href = "/";
    } catch (error) {
      console.error("Error creating post:", error);
      setError(error instanceof Error ? error.message : "포스트 작성 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8 text-center">새 글 작성</h1>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="category">카테고리</Label>
          {isLoadingCategories ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm text-gray-500">카테고리 로딩 중...</span>
            </div>
          ) : (
            <Select value={formData.category} onValueChange={value => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="카테고리를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.slug} value={category.slug}>
                    <span className="flex items-center gap-2">
                      <span>{category.name}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">제목</Label>
          <Input id="title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="제목을 입력하세요" className="text-lg" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">내용</Label>
          <RichTextEditor content={formData.content} onChange={html => setFormData({ ...formData, content: html })} placeholder="내용을 입력하세요..." />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags">태그</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag, index) => (
              <div key={index} className="flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1">
                <span>{tag}</span>
                <button type="button" onClick={() => handleRemoveTag(tag)} className="ml-2 rounded-full p-1 hover:bg-blue-200 focus:outline-none">
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
          <Input id="tags" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={handleAddTag} placeholder="태그를 입력하고 엔터를 누르세요" />
          <p className="text-xs text-gray-500">엔터 키를 눌러 태그를 추가하세요.</p>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
            취소
          </Button>
          <Button type="submit" disabled={isSubmitting} className="min-w-[100px]">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                작성 중...
              </>
            ) : (
              "작성하기"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

// 메인 컴포넌트 - ProtectedRoute로 감싸서 인증 체크
export default function WritePage() {
  return (
    <ProtectedRoute>
      <WritePageContent />
    </ProtectedRoute>
  );
}
