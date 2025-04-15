import { ApiDebugger } from "@/lib/api-debug";

export default function DebugPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">API 디버깅 도구</h1>
      <p className="mb-6 text-gray-600">이 페이지는 Strapi API가 응답하는 데이터 구조를 분석하고 필드 이름을 확인하는데 도움을 줍니다.</p>
      <ApiDebugger />
    </div>
  );
}
