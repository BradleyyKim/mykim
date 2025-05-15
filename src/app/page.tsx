"use client";

import { Suspense } from "react";
import HomePageContent from "@/components/HomePageContent";
import Header from "@/components/Header";

// 메인 페이지 컴포넌트 - Header는 바로 보여주고, HomePageContent만 Suspense로 감싸서 제공
export default function HomePage() {
  return (
    <>
      <Header />
      <Suspense
        fallback={
          <div className="container mx-auto px-4 py-8">
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
    </>
  );
}

// Next.js에게 이 페이지를 빌드 시 정적으로 생성하지 말고 런타임에 생성하도록 알림
export const dynamic = "force-dynamic";
