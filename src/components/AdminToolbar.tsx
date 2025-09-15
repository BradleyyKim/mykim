"use client";

import { useState } from "react";
import { toast } from "sonner";

interface AdminToolbarProps {
  isLoggedIn: boolean;
  onUploadPDFs?: () => Promise<void>;
  customActions?: React.ReactNode;
}

export default function AdminToolbar({ isLoggedIn, onUploadPDFs, customActions }: AdminToolbarProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>("");
  const [currentStep, setCurrentStep] = useState<string>("");

  const handleUploadAllPDFs = async () => {
    if (!onUploadPDFs) {
      toast.error("PDF 업로드 기능이 설정되지 않았습니다.");
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress("PDF 생성 및 업로드 중...");
      setCurrentStep("");

      await onUploadPDFs();
    } catch (error) {
      console.error("PDF 생성 및 업로드 실패:", error);
      toast.error("PDF 생성 및 업로드에 실패했습니다.");
    } finally {
      setIsUploading(false);
      setUploadProgress("");
      setCurrentStep("");
    }
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 min-w-[280px]">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            관리자 도구
          </h3>
          <div className="text-xs text-gray-400 dark:text-gray-500">
            v{process.env.NEXT_PUBLIC_APP_VERSION || "0.1.0"}
          </div>
        </div>

        {/* 버전 정보 */}
        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
            <div className="flex justify-between">
              <span>빌드 날짜:</span>
              <span className="font-mono">
                {process.env.NEXT_PUBLIC_BUILD_DATE || new Date().toISOString().split("T")[0]}
              </span>
            </div>
            <div className="flex justify-between">
              <span>빌드 시간:</span>
              <span className="font-mono">
                {process.env.NEXT_PUBLIC_BUILD_TIME || new Date().toISOString().split("T")[1].split(".")[0]}
              </span>
            </div>
            <div className="flex justify-between">
              <span>환경:</span>
              <span className="font-mono text-green-600 dark:text-green-400">
                {process.env.NODE_ENV === "production" ? "PROD" : "DEV"}
              </span>
            </div>
          </div>
        </div>

        {/* 액션 버튼들 */}
        <div className="space-y-2">
          {onUploadPDFs && (
            <button
              onClick={handleUploadAllPDFs}
              disabled={isUploading}
              className="w-full px-4 py-2 text-sm bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  PDF 생성 중...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  PDF 생성 및 업로드
                </>
              )}
            </button>
          )}

          {/* 커스텀 액션들 */}
          {customActions}
        </div>

        {/* 진행 상황 */}
        {isUploading && (
          <div className="mt-4 space-y-2">
            <div className="text-xs text-gray-600 dark:text-gray-300">{uploadProgress}</div>
            {currentStep && (
              <div className="text-xs text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
                {currentStep}
              </div>
            )}
            <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
              <div
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full animate-pulse"
                style={{ width: "100%" }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
