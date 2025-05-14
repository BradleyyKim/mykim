"use client";

import { Suspense } from "react";

import { MAIN } from "@/lib/constants";
import HomePageContent from "@/components/HomePageContent";

// 메인 페이지 컴포넌트 - HomePageContent를 Suspense로 감싸서 제공
export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">{MAIN.title}</h1>
          </div>
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        </div>
      }
    >
      <HomePageContent />
    </Suspense>
  );
}

// Next.js에게 이 페이지를 빌드 시 정적으로 생성하지 말고 런타임에 생성하도록 알림
export const dynamic = "force-dynamic";
