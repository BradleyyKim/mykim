"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { MenuIcon, LayoutIcon, HomeIcon, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { ThemeMode } from "@/components/ui";
import { MAIN } from "@/lib/constants";
import { Category, fetchCategories } from "@/lib/api";
import { useBlogAnalytics } from "@/hooks/analytics";

/**
 * Header 컴포넌트
 * - 좌측: 블로그 타이틀
 * - 중앙: 네비게이션 버튼들 (데스크탑에서만 표시)
 * - 우측: 기능 버튼들 (다크모드, 언어) + 모바일용 메뉴 드롭다운
 */
export default function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { trackThemeChange } = useBlogAnalytics();
  const currentCategory = searchParams.get("category");
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  // 현재 홈페이지인지 확인
  const isHomePage = pathname === "/";

  // 카테고리 데이터 로드
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const categoryData = await fetchCategories();

        if (categoryData.length > 0) {
          setCategories(categoryData);
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

  // 카테고리 선택 핸들러
  const handleCategorySelect = (slug: string) => {
    // 카테고리 페이지로 이동
    router.push(`/category/${slug}`);
  };

  // 모든 포스트 보기
  const handleViewAllPosts = () => {
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center px-4">
        {/* 좌측: 블로그 타이틀 */}
        <div className="mr-4 flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold italic">{isHomePage ? MAIN.title : "Home"}</span>
          </Link>
        </div>

        {/* 중앙: 네비게이션 메뉴 (태블릿/데스크탑에서만 표시) */}
        <div className="hidden md:flex flex-1 items-center justify-center space-x-4">
          {/* Series 드롭다운 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className={`${currentCategory ? "text-blue-500" : ""}`}>
                Series
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {currentCategory && (
                <>
                  <DropdownMenuItem onSelect={handleViewAllPosts}>
                    <HomeIcon className="mr-2 h-4 w-4" />
                    <span>모든 포스트 보기</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
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
                  <DropdownMenuItem
                    key={category.id}
                    onSelect={() => handleCategorySelect(category.slug as string)}
                    className={currentCategory === category.slug ? "bg-blue-50 text-blue-700" : ""}
                  >
                    {category.name}
                    {currentCategory === category.slug && <span className="ml-auto text-blue-500">✓</span>}
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
          {/* 다크모드 토글 (태블릿/데스크탑에서만 표시) */}
          <div className="hidden md:block">
            <ThemeMode />
          </div>

          {/* 언어 설정 버튼 (모든 화면 크기에서 표시) */}
          {/* <DropdownMenu>
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
          </DropdownMenu> */}

          {/* 모바일 메뉴 (모바일에서만 표시) */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" title="Menu">
                  <MenuIcon className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Series</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {currentCategory && (
                  <DropdownMenuItem onSelect={handleViewAllPosts}>
                    <HomeIcon className="mr-2 h-4 w-4" />
                    <span>모든 포스트 보기</span>
                  </DropdownMenuItem>
                )}
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
                    <DropdownMenuItem
                      key={category.id}
                      onSelect={() => handleCategorySelect(category.slug as string)}
                      className={currentCategory === category.slug ? "bg-blue-50 text-blue-700" : ""}
                    >
                      {category.name}
                      {currentCategory === category.slug && <span className="ml-auto text-blue-500">✓</span>}
                    </DropdownMenuItem>
                  ))
                )}
                <DropdownMenuLabel>Menu</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  {/* About 버튼 */}
                  <DropdownMenuItem onSelect={() => router.push("/about")}>
                    <LayoutIcon className="mr-2 h-4 w-4" />
                    <span>About</span>
                  </DropdownMenuItem>
                  {/* ThemeMode 버튼 - 모바일에서만 표시 */}
                  <DropdownMenuItem
                    onClick={() => {
                      const newTheme = theme === "dark" ? "light" : "dark";
                      setTheme(newTheme);
                      // Google Analytics에 테마 변경 이벤트 추적
                      trackThemeChange(newTheme);
                    }}
                  >
                    <div className="flex items-start">
                      <Sun className="mr-2 h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                      <span className="ml-2">Theme</span>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
