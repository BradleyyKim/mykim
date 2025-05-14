/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/lib/constants";

export default function StrapiQueryTestPage() {
  const [results, setResults] = useState<{ [key: string]: any }>({});
  const [isLoading, setIsLoading] = useState(false);

  // 다양한 방식의 Strapi 쿼리 테스트
  const testQueries = async () => {
    setIsLoading(true);
    setResults({});

    const queries = [
      // 기본 형식
      {
        name: "basic",
        url: `${API_BASE_URL}/posts`
      },
      // 단일 포스트 조회
      {
        name: "singlePost",
        url: `${API_BASE_URL}/posts/1`
      },
      // 페이지네이션 (네이티브 형식)
      {
        name: "paginationNative",
        url: `${API_BASE_URL}/posts?pagination[page]=1&pagination[pageSize]=2`
      },
      // 페이지네이션 (점 형식)
      {
        name: "paginationDot",
        url: `${API_BASE_URL}/posts?pagination.page=1&pagination.pageSize=2`
      },
      // populate 네이티브 형식
      {
        name: "populateNative",
        url: `${API_BASE_URL}/posts?populate=category`
      },
      // populate 네이티브 형식 (여러 필드)
      {
        name: "populateMultiple",
        url: `${API_BASE_URL}/posts?populate=category,tags`
      },
      // populate 별도 파라미터
      {
        name: "populateSeparate",
        url: `${API_BASE_URL}/posts?populate[0]=category&populate[1]=tags`
      },
      // 단순 populate
      {
        name: "populateSimple",
        url: `${API_BASE_URL}/posts?populate=*`
      }
    ];

    const results: { [key: string]: any } = {};

    for (const query of queries) {
      try {
        console.log(`테스트: ${query.name} - URL: ${query.url}`);
        const response = await fetch(query.url);

        const status = response.status;
        let data = null;

        try {
          data = await response.json();
        } catch (e) {
          console.error(`JSON 파싱 실패: ${query.name}`, e);
        }

        results[query.name] = {
          status,
          successful: response.ok,
          data: data ? (typeof data === "object" ? "(JSON 객체)" : data) : null,
          hasData: data && data.data ? true : false,
          firstItemHasCategory: data && data.data && data.data[0] ? (data.data[0].attributes?.category || data.data[0]?.category ? true : false) : false
        };
      } catch (error) {
        console.error(`쿼리 실패: ${query.name}`, error);
        results[query.name] = { error: (error as Error).message, successful: false };
      }
    }

    setResults(results);
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Strapi API 쿼리 테스트 페이지</h1>

      <div className="mb-8">
        <Button onClick={testQueries} disabled={isLoading} className="mb-4">
          {isLoading ? "테스트 중..." : "다양한 API 쿼리 테스트 실행"}
        </Button>

        <p className="text-sm text-gray-500 mb-4">Strapi API에 다양한 형식의 쿼리를 테스트하여 어떤 방식이 작동하는지 확인합니다.</p>

        {Object.keys(results).length > 0 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">테스트 결과</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(results).map(([name, result]) => (
                <div key={name} className={`p-4 rounded-lg border ${(result as any).successful ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
                  <h3 className="font-medium mb-2">{name}</h3>
                  <div className="space-y-1 text-sm">
                    <p>상태: {(result as any).status || "N/A"}</p>
                    <p>성공: {(result as any).successful ? "✅" : "❌"}</p>
                    <p>데이터 있음: {(result as any).hasData ? "✅" : "❌"}</p>
                    <p>카테고리 포함: {(result as any).firstItemHasCategory ? "✅" : "❌"}</p>
                    {(result as any).error && <p className="text-red-600">오류: {(result as any).error}</p>}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-gray-50 rounded-lg mt-6">
              <h3 className="font-medium mb-2">결론</h3>
              <p>
                성공한 쿼리를 확인하여 프로젝트에 적용할 쿼리 형식을 선택하세요. 일반적으로 Strapi v4에서 권장하는 형식은 <code>populate=*</code> 또는 <code>populate=field1,field2</code> 입니다.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
