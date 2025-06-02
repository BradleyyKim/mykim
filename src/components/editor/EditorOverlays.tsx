"use client";

import React from "react";
import { Upload, X } from "lucide-react";

interface EditorOverlaysProps {
  isUploading: boolean;
  isDragOver: boolean;
  error: string | null;
  onErrorClose: () => void;
}

export function EditorOverlays({ isUploading, isDragOver, error, onErrorClose }: EditorOverlaysProps) {
  return (
    <>
      {/* 업로드 중 오버레이 */}
      {isUploading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-700">이미지 업로드 중...</span>
          </div>
        </div>
      )}

      {/* 드래그 오버 오버레이 */}
      {isDragOver && (
        <div className="absolute inset-0 bg-blue-50 bg-opacity-90 flex items-center justify-center z-40 border-2 border-dashed border-blue-400">
          <div className="text-center">
            <Upload className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <p className="text-blue-600 font-medium text-lg">이미지를 여기에 드롭하세요</p>
          </div>
        </div>
      )}

      {/* 에러 메시지 */}
      {error && (
        <div className="absolute top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg z-50 max-w-sm">
          <div className="flex items-start justify-between">
            <div>
              <strong className="font-bold">오류!</strong>
              <p className="text-sm mt-1">{error}</p>
            </div>
            <button onClick={onErrorClose} className="ml-3 text-red-700 hover:text-red-900">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
