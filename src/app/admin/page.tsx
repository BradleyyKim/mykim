"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Lock } from "lucide-react";
import { useAuth } from "@/lib/auth";

export default function AdminPage() {
  const router = useRouter();
  const { isLoggedIn, isLoading, login, logout } = useAuth();
  const [formData, setFormData] = useState({
    identifier: "",
    password: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await login(formData.identifier, formData.password);
      router.refresh();
    } catch (error) {
      console.error("로그인 오류:", error);
      setError(error instanceof Error ? error.message : "로그인 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.refresh();
    } catch (error) {
      console.error("로그아웃 오류:", error);
    }
  };

  // 로딩 중이면 로딩 표시
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  // 이미 로그인된 경우 관리자 대시보드 표시
  if (isLoggedIn) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">관리자 대시보드</h1>
          <Button variant="outline" onClick={handleLogout}>
            로그아웃
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">포스트 관리</h2>
            <Button className="w-full" onClick={() => router.push("/write")}>
              새 포스트 작성
            </Button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">통계</h2>
            <p>곧 제공될 예정입니다.</p>
          </div>
        </div>
      </div>
    );
  }

  // 로그인 폼
  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <div className="flex flex-col items-center mb-8">
        <Lock className="h-12 w-12 text-gray-500 mb-4" />
        <h1 className="text-3xl font-bold text-center">관리자 로그인</h1>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-md">
        <div className="space-y-2">
          <Label htmlFor="identifier">아이디 또는 이메일</Label>
          <Input
            id="identifier"
            type="text"
            value={formData.identifier}
            onChange={e => setFormData({ ...formData, identifier: e.target.value })}
            placeholder="아이디 또는 이메일 입력"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">비밀번호</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={e => setFormData({ ...formData, password: e.target.value })}
            placeholder="비밀번호 입력"
            required
          />
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              로그인 중...
            </>
          ) : (
            "로그인"
          )}
        </Button>
      </form>
    </div>
  );
}
