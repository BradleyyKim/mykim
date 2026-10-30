"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ThemeMode } from "@/components/ui";
import { MAIN } from "@/lib/constants";
import type { Category } from "@/lib/types/post";
import { useBlogAnalytics } from "@/hooks/analytics";
import { getLocalePath, removeLocaleFromPath, t } from "@/i18n";
import type { Locale } from "@/i18n";

/**
 * Header — wordmark on the left, text navigation in the middle, locale + theme on the right.
 * Series is a dropdown fed by /api/categories. Everything collapses into one menu under md.
 * Portfolio is reachable from About (and the footer), not from the primary nav.
 */
export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { trackThemeChange } = useBlogAnalytics();
  const [categories, setCategories] = useState<Category[]>([]);

  const locale: Locale = pathname.startsWith("/en") ? "en" : "ko";
  const bare = removeLocaleFromPath(pathname);
  const isHome = bare === "/";
  const isSeries = bare.startsWith("/category");
  const isAbout = bare.startsWith("/about");

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/categories?locale=${locale}`)
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) setCategories(d.data || []);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [locale]);

  const toggleLocale = () => {
    const next = locale === "ko" ? "en" : "ko";
    router.push(getLocalePath(next, bare));
  };

  const navClass = (active: boolean) =>
    `relative px-3 py-1.5 text-sm font-medium transition-colors duration-1 ${
      active ? "text-foreground" : "text-text-2 hover:text-foreground"
    } after:absolute after:inset-x-3 after:-bottom-0.5 after:h-px after:bg-primary after:transition-transform after:duration-2 after:ease-soft ${
      active ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100"
    }`;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/80 backdrop-blur-md">
      <div className="page flex h-14 items-center">
        <Link href={getLocalePath(locale, "/")} className="text-[1.0625rem] font-extrabold tracking-[-0.03em] text-foreground">
          {MAIN.title}
        </Link>

        <nav className="ml-8 hidden items-center md:flex" aria-label="primary">
          <Link href={getLocalePath(locale, "/")} className={navClass(isHome)}>
            {t(locale, "nav.posts")}
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button type="button" className={`${navClass(isSeries)} inline-flex items-center gap-1`}>
                {t(locale, "nav.series")}
                <ChevronDown className="h-3.5 w-3.5 opacity-60" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-52">
              {categories.length === 0 ? (
                <DropdownMenuItem disabled>{t(locale, "nav.loading")}</DropdownMenuItem>
              ) : (
                categories.map((c) => (
                  <DropdownMenuItem key={c.id} onSelect={() => router.push(getLocalePath(locale, `/category/${c.slug}`))}>
                    {c.name}
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <Link href={getLocalePath(locale, "/about")} className={navClass(isAbout)}>
            {t(locale, "nav.about")}
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={toggleLocale}
            className="mono rounded-md px-2 py-1 text-text-2 transition-colors duration-1 hover:bg-accent hover:text-foreground"
            aria-label="switch language"
          >
            {locale === "ko" ? "EN" : "KO"}
          </button>
          <div className="hidden md:block">
            <ThemeMode />
          </div>

          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label={t(locale, "nav.menu")}>
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onSelect={() => router.push(getLocalePath(locale, "/"))}>{t(locale, "nav.posts")}</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => router.push(getLocalePath(locale, "/about"))}>{t(locale, "nav.about")}</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="eyebrow">{t(locale, "nav.series")}</DropdownMenuLabel>
                {categories.map((c) => (
                  <DropdownMenuItem key={c.id} onSelect={() => router.push(getLocalePath(locale, `/category/${c.slug}`))}>
                    {c.name}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() => {
                    const next = theme === "dark" ? "light" : "dark";
                    setTheme(next);
                    trackThemeChange(next);
                  }}
                >
                  <Sun className="mr-2 h-4 w-4 dark:hidden" />
                  <Moon className="mr-2 hidden h-4 w-4 dark:block" />
                  {t(locale, "nav.theme")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
