"use client";

import Image from "next/image";
import { useTimeBasedBackground } from "@/hooks/ui";

interface TimeBasedBackgroundProps {
  className?: string;
  children?: React.ReactNode;
}

export default function TimeBasedBackground({ className = "", children }: TimeBasedBackgroundProps) {
  const { currentBackground, isDayTime } = useTimeBasedBackground();

  if (!currentBackground) {
    return <div className={`relative ${className}`}>{children}</div>;
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* 배경 이미지 */}
      <div className="absolute inset-0 z-0">
        <Image
          src={currentBackground}
          alt={isDayTime ? "Day background" : "Night background"}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
        />
        {/* 오버레이 - 콘텐츠의 가독성을 위한 반투명 레이어 */}
        <div className="absolute inset-0 bg-black/20 dark:bg-black/40" />
      </div>

      {/* 콘텐츠 */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
