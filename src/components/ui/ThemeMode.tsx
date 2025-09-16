"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useBlogAnalytics } from "@/hooks/analytics";

export function ThemeMode() {
  const { theme, setTheme } = useTheme();
  const { trackThemeChange } = useBlogAnalytics();

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);

    // Google Analytics에 테마 변경 이벤트 추적
    trackThemeChange(newTheme);
  };

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} title="Toggle theme">
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
