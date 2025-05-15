"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GlobeIcon, MenuIcon, LayoutIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuGroup, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { ThemeMode } from "@/components/ThemeMode";
import { MAIN } from "@/lib/constants";
import { Category, fetchCategories } from "@/lib/api";

/**
 * Header 컴포넌트
 * - 좌측: 블로그 타이틀
 * - 중앙: 네비게이션 버튼들 (데스크탑에서만 표시)
 * - 우측: 기능 버튼들 (다크모드, 언어) + 모바일용 메뉴 드롭다운
 */
export default function Header() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
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
        }
      } catch (error) {
        console.error("카테고리 로드 중 오류 발생:", error);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center px-4">
        {/* 좌측: 블로그 타이틀 */}
        <div className="mr-4 flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">{MAIN.title}</span>
          </Link>
        </div>

        {/* 중앙: 네비게이션 메뉴 (태블릿/데스크탑에서만 표시) */}
        <div className="hidden md:flex flex-1 items-center justify-center space-x-4">
          {/* Series 드롭다운 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">Series</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {isLoadingCategories ? (
                <DropdownMenuItem disabled>
                  <span className="flex items-center">
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent mr-2"></span>
                    로딩 중...
                  </span>
                </DropdownMenuItem>
              ) : categories.length === 0 ? (
                <DropdownMenuItem disabled>카테고리가 없습니다</DropdownMenuItem>
              ) : (
                categories.map(category => (
                  <DropdownMenuItem key={category.id} onSelect={() => router.push(`/category/${category.slug}`)}>
                    {category.name}
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* About 버튼 */}
          <Button variant="ghost" onClick={() => router.push("/about")}>
            About
          </Button>
        </div>

        {/* 우측: 기능 버튼들 */}
        <div className="ml-auto flex items-center space-x-2">
          {/* 다크모드 토글 (모든 화면 크기에서 표시) */}
          <ThemeMode />

          {/* 언어 설정 버튼 (모든 화면 크기에서 표시) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" title="언어 설정">
                <GlobeIcon className="h-5 w-5" />
                <span className="sr-only">Language</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => null}>한국어</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => null}>English</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* 모바일 메뉴 (모바일에서만 표시) */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" title="메뉴">
                  <MenuIcon className="h-5 w-5" />
                  <span className="sr-only">메뉴</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>메뉴</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  {/* About 버튼 */}
                  <DropdownMenuItem onSelect={() => router.push("/about")}>
                    <LayoutIcon className="mr-2 h-4 w-4" />
                    <span>About</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuLabel>Series</DropdownMenuLabel>
                <DropdownMenuSeparator />

                {isLoadingCategories ? (
                  <DropdownMenuItem disabled>
                    <span className="flex items-center">
                      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent mr-2"></span>
                      로딩 중...
                    </span>
                  </DropdownMenuItem>
                ) : categories.length === 0 ? (
                  <DropdownMenuItem disabled>카테고리가 없습니다</DropdownMenuItem>
                ) : (
                  categories.map(category => (
                    <DropdownMenuItem key={category.id} onSelect={() => router.push(`/category/${category.slug}`)}>
                      {category.name}
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
