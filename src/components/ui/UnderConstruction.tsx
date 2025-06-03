"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Construction, HardHat, Wrench, Hammer, Cog, AlertTriangle } from "lucide-react";

interface UnderConstructionProps {
  title?: string;
  message?: string;
  showAnimation?: boolean;
}

export default function UnderConstruction({
  title = "🚧 페이지 공사중 🚧",
  message = "더 나은 경험을 위해 열심히 개발하고 있어요!",
  showAnimation = true
}: UnderConstructionProps) {
  const [currentIcon, setCurrentIcon] = useState(0);

  const icons = [
    { Icon: Construction, color: "text-orange-500" },
    { Icon: HardHat, color: "text-yellow-500" },
    { Icon: Wrench, color: "text-blue-500" },
    { Icon: Hammer, color: "text-red-500" },
    { Icon: Cog, color: "text-gray-500" },
    { Icon: AlertTriangle, color: "text-amber-500" }
  ];

  useEffect(() => {
    if (!showAnimation) return;

    const interval = setInterval(() => {
      setCurrentIcon(prev => (prev + 1) % icons.length);
    }, 1000);

    return () => clearInterval(interval);
  }, [showAnimation, icons.length]);

  const { Icon, color } = icons[currentIcon];

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-12">
      <div className="text-center max-w-md mx-auto">
        {/* 애니메이션 아이콘 */}
        <div className="mb-8 relative">
          <div className="relative inline-block">
            <Icon
              size={80}
              className={`${color} transition-all duration-500 ${showAnimation ? "animate-bounce" : ""}`}
            />
            {/* 반짝이는 효과 */}
            {showAnimation && (
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
            )}
          </div>

          {/* 주변 작은 아이콘들 */}
          <div className="absolute -top-4 -left-4 opacity-60">
            <Construction size={20} className="text-orange-400 animate-pulse" />
          </div>
          <div className="absolute -bottom-4 -right-4 opacity-60">
            <Wrench size={16} className="text-blue-400 animate-pulse" style={{ animationDelay: "0.5s" }} />
          </div>
          <div className="absolute top-0 -right-8 opacity-60">
            <Hammer size={18} className="text-red-400 animate-pulse" style={{ animationDelay: "1s" }} />
          </div>
        </div>

        {/* 제목 */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">{title}</h1>

        {/* 메시지 */}
        <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">{message}</p>

        {/* 진행률 바 (가짜) */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-orange-400 to-yellow-500 rounded-full transition-all duration-1000 relative"
            style={{ width: "67%" }}
          >
            {showAnimation && <div className="absolute inset-0 bg-white opacity-30 animate-pulse"></div>}
          </div>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">진행률: 67% 완료</p>

        {/* 귀여운 메시지들 */}
        <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
          <p>🔨 열심히 코딩하는 중...</p>
        </div>

        {/* 홈으로 돌아가기 버튼 */}
        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            🏠 홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
