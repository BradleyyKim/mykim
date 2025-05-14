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
import { Category, fetchCategories } from "@/lib/api";

// 예시 카테고리 - API에서 로드하기 전 사용
const defaultCategories = [
  { id: 1, name: "🌱 루틴을 디버그합니다", icon: "🎯", description: "운동", slug: "tech-ideas" },
  { id: 2, name: "📖 마음을 로깅합니다", icon: "🏋", description: "블로그 글/시", slug: "fitness" },
  { id: 3, name: "🎨 삶을 디플로이합니다", icon: "🍳", description: "취미 & 일상", slug: "food" },
  { id: 4, name: "🍳 레시피를 커밋합니다", icon: "🎨", description: "요리 & 음식", slug: "hobby" },
  { id: 5, name: "🧠 지식을 디벨롭합니다", icon: "📖", description: "기술 아이디어", slug: "blog" }
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
  const [formErrors, setFormErrors] = useState({
    title: false,
    content: false,
    category: false
  });
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  // 카테고리 데이터 로드
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const categoryData = await fetchCategories();

        if (categoryData.length > 0) {
          setCategories(categoryData);
          console.log("카테고리 로드 성공:", categoryData.length);
        } else {
          console.warn("카테고리 데이터가 비어있습니다");
          setCategories(defaultCategories);
        }
      } catch (error) {
        console.error("카테고리 로드 중 오류 발생:", error);
        setCategories(defaultCategories);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    loadCategories();
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

  // 폼 유효성 검사
  const validateForm = () => {
    const errors = {
      title: !formData.title.trim(),
      content: !formData.content.trim(),
      category: !formData.category.trim()
    };

    setFormErrors(errors);

    if (errors.title || errors.content || errors.category) {
      setError("제목, 카테고리, 내용을 모두 입력해주세요.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // 선택된 카테고리 ID 찾기
      const selectedCategory = categories.find(cat => cat.slug === formData.category);

      if (!selectedCategory) {
        setError("유효한 카테고리를 선택해주세요.");
        setIsSubmitting(false);
        return;
      }

      // Strapi API에 맞게 카테고리 ID를 전달
      // category는 relation 타입이므로 ID값을 전달해야 합니다
      await createPost({
        title: formData.title,
        content: formData.content,
        category: selectedCategory.id.toString()
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

  // 입력값 변경 처리
  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 값이 입력되면 해당 필드의 오류 상태 해제
    if (value.trim()) {
      setFormErrors(prev => ({ ...prev, [field]: false }));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8 text-center">새 글 작성</h1>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="category" className="flex items-center">
            카테고리
            <span className="text-red-500 ml-1">*</span>
          </Label>
          {isLoadingCategories ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm text-gray-500">카테고리 로딩 중...</span>
            </div>
          ) : (
            <Select value={formData.category} onValueChange={value => handleInputChange("category", value)} required>
              <SelectTrigger className={formErrors.category ? "border-red-500" : ""}>
                <SelectValue placeholder="카테고리를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category =>
                  category.slug ? (
                    <SelectItem key={`${category.id}-${category.slug}`} value={category.slug}>
                      <span className="flex items-center gap-2">
                        <span>{category.name}</span>
                      </span>
                    </SelectItem>
                  ) : null
                )}
              </SelectContent>
            </Select>
          )}
          {formErrors.category && <p className="text-xs text-red-500 mt-1">카테고리는 필수 항목입니다.</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="title" className="flex items-center">
            제목
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Input
            id="title"
            value={formData.title}
            onChange={e => handleInputChange("title", e.target.value)}
            placeholder="제목을 입력하세요"
            className={`text-lg ${formErrors.title ? "border-red-500" : ""}`}
            required
          />
          {formErrors.title && <p className="text-xs text-red-500 mt-1">제목은 필수 항목입니다.</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="content" className="flex items-center">
            내용
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <div className={`${formErrors.content ? "border border-red-500 rounded-md" : ""}`}>
            <RichTextEditor content={formData.content} onChange={html => handleInputChange("content", html)} placeholder="내용을 입력하세요..." />
          </div>
          {formErrors.content && <p className="text-xs text-red-500 mt-1">내용은 필수 항목입니다.</p>}
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
          <p className="text-xs text-gray-500">엔터 키를 눌러 태그를 추가하세요. (선택사항)</p>
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
