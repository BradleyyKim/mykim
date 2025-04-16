"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

const categories = [
  { id: "tech-ideas", name: "아이디어를 빌드합니다", icon: "🎯", description: "기술 아이디어" },
  { id: "fitness", name: "루틴을 디버그합니다", icon: "🏋", description: "운동" },
  { id: "food", name: "레시피를 커밋합니다", icon: "🍳", description: "요리 & 음식" },
  { id: "hobby", name: "삶을 디플로이합니다", icon: "🎨", description: "취미 & 일상" },
  { id: "blog", name: "마음을 로깅합니다", icon: "📖", description: "블로그 글/시" }
];

export default function WritePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    tags: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      setError("제목과 내용을 모두 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    console.log("API Token:", process.env.STRAPI_API_TOKEN?.substring(0, 5) + "...");
    console.log("Request Headers:", {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`
    });
    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`
        },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags
            .split(",")
            .map(tag => tag.trim())
            .filter(Boolean)
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create post");
      }

      // 캐시된 데이터 갱신
      router.refresh();

      // 성공적으로 포스트 생성 후 메인 페이지로 이동
      router.push("/");
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
          <Label htmlFor="category">카테고리 (참고용)</Label>
          <Select value={formData.category} onValueChange={value => setFormData({ ...formData, category: value })}>
            <SelectTrigger>
              <SelectValue placeholder="카테고리를 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category.id} value={category.id}>
                  <span className="flex items-center gap-2">
                    <span>{category.icon}</span>
                    <span>{category.name}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-gray-500">* 현재 카테고리 기능은 개발 중입니다. 선택한 카테고리는 참고용으로만 사용됩니다.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">제목</Label>
          <Input id="title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="제목을 입력하세요" className="text-lg" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">내용</Label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={e => setFormData({ ...formData, content: e.target.value })}
            placeholder="내용을 입력하세요 (마크다운 형식을 지원합니다)"
            className="min-h-[300px] font-mono text-md"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags">태그 (참고용)</Label>
          <Input id="tags" value={formData.tags} onChange={e => setFormData({ ...formData, tags: e.target.value })} placeholder="태그를 쉼표로 구분하여 입력하세요" />
          <p className="text-sm text-gray-500">* 현재 태그 기능은 개발 중입니다. 입력한 태그는 참고용으로만 사용됩니다.</p>
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
