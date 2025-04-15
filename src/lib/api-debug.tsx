"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ApiField {
  path: string;
  value: unknown;
  type: string;
}

export function ApiDebugger() {
  const [apiResult, setApiResult] = useState<Record<string, unknown> | null>(null);
  const [fields, setFields] = useState<ApiField[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // API 데이터에서 모든 필드와 경로 추출
  const extractFields = (obj: unknown, basePath = ""): ApiField[] => {
    if (obj === null || obj === undefined) return [];
    if (typeof obj !== "object") {
      return [{ path: basePath, value: obj, type: typeof obj }];
    }

    let fields: ApiField[] = [];

    if (Array.isArray(obj)) {
      // 배열인 경우 첫 요소만 분석
      if (obj.length > 0) {
        const firstItem = obj[0];
        const itemFields = extractFields(firstItem, `${basePath}[0]`);
        fields = [...fields, ...itemFields];
      }
      return fields;
    }

    // 객체인 경우 모든 키를 순회
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const newPath = basePath ? `${basePath}.${key}` : key;
        const value = (obj as Record<string, unknown>)[key];

        if (value === null || value === undefined) {
          fields.push({ path: newPath, value: value, type: "null" });
        } else if (typeof value !== "object") {
          fields.push({ path: newPath, value, type: typeof value });
        } else {
          // 재귀적으로 객체 필드 탐색
          const nestedFields = extractFields(value, newPath);
          fields = [...fields, ...nestedFields];
        }
      }
    }

    return fields;
  };

  const testApiCall = async () => {
    setLoading(true);
    setError(null);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337/api";

    try {
      // 포스트 목록 가져오기
      const response = await fetch(`${API_URL}/posts?populate=*`, {
        cache: "no-store"
      });

      if (!response.ok) {
        throw new Error(`API 오류: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log("API 응답:", result);

      setApiResult(result as Record<string, unknown>);

      // 필드 분석
      if (result?.data) {
        const extractedFields = extractFields(result.data);
        setFields(extractedFields);
      } else {
        setFields([]);
      }
    } catch (err) {
      console.error("API 호출 오류:", err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h2 className="text-xl font-bold mb-4">API 필드 분석</h2>
      <Button onClick={testApiCall} disabled={loading} className="mb-4">
        {loading ? "로딩 중..." : "Strapi API 호출 테스트"}
      </Button>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {fields.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">발견된 필드:</h3>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2 text-left">필드 경로</th>
                <th className="border p-2 text-left">값</th>
                <th className="border p-2 text-left">타입</th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field, index) => (
                <tr key={index} className="border-b">
                  <td className="border p-2 font-mono text-xs">{field.path}</td>
                  <td className="border p-2 overflow-hidden text-ellipsis">
                    {typeof field.value === "string" ? (field.value.length > 30 ? field.value.substring(0, 30) + "..." : field.value) : String(field.value)}
                  </td>
                  <td className="border p-2">{field.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Raw API 응답:</h3>
        <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-[300px] text-xs">{apiResult ? JSON.stringify(apiResult, null, 2) : "API 응답 없음"}</pre>
      </div>
    </div>
  );
}
