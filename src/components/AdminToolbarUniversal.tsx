"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";

interface AdminAction {
  label: string;
  onClick: () => Promise<void> | void;
  icon?: React.ReactNode;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
}

interface AdminToolbarUniversalProps {
  actions?: AdminAction[];
  showVersionInfo?: boolean;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  className?: string;
}

export default function AdminToolbarUniversal({
  actions = [],
  showVersionInfo = true,
  position = "bottom-right",
  className = ""
}: AdminToolbarUniversalProps) {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const { isLoggedIn } = useAuth();

  const handleAction = async (action: AdminAction, index: number) => {
    const actionKey = `action-${index}`;

    try {
      setLoadingStates(prev => ({ ...prev, [actionKey]: true }));
      await action.onClick();
    } catch (error) {
      console.error(`Action ${action.label} failed:`, error);
      toast.error(`${action.label} 실행에 실패했습니다.`);
    } finally {
      setLoadingStates(prev => ({ ...prev, [actionKey]: false }));
    }
  };

  const getPositionClasses = () => {
    switch (position) {
      case "bottom-left":
        return "fixed bottom-6 left-6";
      case "top-right":
        return "fixed top-6 right-6";
      case "top-left":
        return "fixed top-6 left-6";
      default:
        return "fixed bottom-6 right-6";
    }
  };

  const getButtonVariantClasses = (variant: AdminAction["variant"] = "primary") => {
    switch (variant) {
      case "secondary":
        return "bg-gray-600 hover:bg-gray-700 text-white";
      case "danger":
        return "bg-red-600 hover:bg-red-700 text-white";
      default:
        return "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white";
    }
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className={`${getPositionClasses()} z-50 ${className}`}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 min-w-[280px]">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            관리자 도구
          </h3>
          {showVersionInfo && (
            <div className="text-xs text-gray-400 dark:text-gray-500">
              v{process.env.NEXT_PUBLIC_APP_VERSION || "0.1.0"}
            </div>
          )}
        </div>

        {/* 버전 정보 */}
        {showVersionInfo && (
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
        )}

        {/* 액션 버튼들 */}
        {actions.length > 0 && (
          <div className="space-y-2">
            {actions.map((action, index) => {
              const actionKey = `action-${index}`;
              const isLoading = loadingStates[actionKey] || false;

              return (
                <button
                  key={index}
                  onClick={() => handleAction(action, index)}
                  disabled={isLoading || action.disabled}
                  className={`w-full px-4 py-2 text-sm rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 ${getButtonVariantClasses(action.variant)}`}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      처리 중...
                    </>
                  ) : (
                    <>
                      {action.icon}
                      {action.label}
                    </>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* 액션이 없는 경우 기본 메시지 */}
        {actions.length === 0 && (
          <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">
            사용 가능한 관리자 액션이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
