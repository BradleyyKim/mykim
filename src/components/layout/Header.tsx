"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { MenuIcon, LayoutIcon, HomeIcon, Sun, Moon, Tag } from "lucide-react";
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
import type { Category } from "@/lib/types/post";
import { useBlogAnalytics } from "@/hooks/analytics";
import { getLocalePath, removeLocaleFromPath, t } from "@/i18n";
import type { Locale } from "@/i18n";

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

  // 현재 locale 감지
  const locale: Locale = pathname.startsWith("/en") ? "en" : "ko";

  // 현재 홈페이지인지 확인
  const isHomePage = pathname === "/" || pathname === "/en" || pathname === "/en/";

  // 언어 전환 핸들러
  const handleLocaleToggle = () => {
    const newLocale = locale === "ko" ? "en" : "ko";
    const pathWithoutLocale = removeLocaleFromPath(pathname);
    router.push(getLocalePath(newLocale, pathWithoutLocale));
  };

  // 카테고리 데이터 로드
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const response = await fetch(`/api/categories?locale=${locale}`);
        const data = await response.json();
        const categoryData = data.data || [];

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
  }, [locale]);

  // 카테고리 선택 핸들러
  const handleCategorySelect = (slug: string) => {
    router.push(getLocalePath(locale, `/category/${slug}`));
  };

  // 모든 포스트 보기
  const handleViewAllPosts = () => {
    router.push(getLocalePath(locale, "/"));
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center px-4">
        {/* 좌측: 블로그 타이틀 */}
        <div className="mr-4 flex items-center">
          <Link href={getLocalePath(locale, "/")} className="flex items-center space-x-2">
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
                    <span>{t(locale, "nav.allPosts")}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              {isLoadingCategories ? (
                <DropdownMenuItem disabled>
                  <span className="flex items-center">
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent mr-2"></span>
                    {t(locale, "nav.loading")}
                  </span>
                </DropdownMenuItem>
              ) : categories.length === 0 ? (
                <DropdownMenuItem disabled>{t(locale, "nav.noCategories")}</DropdownMenuItem>
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

          {/* Tags 버튼 */}
          <Button variant="ghost" onClick={() => router.push(getLocalePath(locale, "/tags"))}>
            Tags
          </Button>

          {/* About 버튼 */}
          <Button variant="ghost" onClick={() => router.push(getLocalePath(locale, "/about"))}>
            About
          </Button>
        </div>

        {/* 우측: 기능 버튼들 */}
        <div className="ml-auto flex items-center space-x-2">
          {/* KO | EN 언어 토글 (모든 화면 크기에서 표시) */}
          <button
            onClick={handleLocaleToggle}
            className="px-2 py-1 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            {locale === "ko" ? "EN" : "KO"}
          </button>

          {/* 다크모드 토글 (태블릿/데스크탑에서만 표시) */}
          <div className="hidden md:block">
            <ThemeMode />
          </div>

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
                    <span>{t(locale, "nav.allPosts")}</span>
                  </DropdownMenuItem>
                )}
                {isLoadingCategories ? (
                  <DropdownMenuItem disabled>
                    <span className="flex items-center">
                      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent mr-2"></span>
                      {t(locale, "nav.loading")}
                    </span>
                  </DropdownMenuItem>
                ) : categories.length === 0 ? (
                  <DropdownMenuItem disabled>{t(locale, "nav.noCategories")}</DropdownMenuItem>
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
                  {/* Tags 버튼 */}
                  <DropdownMenuItem onSelect={() => router.push(getLocalePath(locale, "/tags"))}>
                    <Tag className="mr-2 h-4 w-4" />
                    <span>Tags</span>
                  </DropdownMenuItem>
                  {/* About 버튼 */}
                  <DropdownMenuItem onSelect={() => router.push(getLocalePath(locale, "/about"))}>
                    <LayoutIcon className="mr-2 h-4 w-4" />
                    <span>About</span>
                  </DropdownMenuItem>
                  {/* ThemeMode 버튼 - 모바일에서만 표시 */}
                  <DropdownMenuItem
                    onClick={() => {
                      const newTheme = theme === "dark" ? "light" : "dark";
                      setTheme(newTheme);
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
