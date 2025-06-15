"use client";

import React from "react";
import { EditorContent } from "@tiptap/react";

// 유틸리티
import { stripHtml } from "@/lib/text-utils";

// 커스텀 훅들
import { useImageHandler } from "@/hooks/useImageHandler";
import { useLinkHandler } from "@/hooks/useLinkHandler";
import { useEditorConfig } from "@/hooks/useEditorConfig";

// 컴포넌트들
import { EditorToolbar } from "@/components/editor/EditorToolbar";
import { EditorOverlays } from "@/components/editor/EditorOverlays";

// 스타일
import "@/styles/editor-styles.css";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  onPlainTextChange?: (plainText: string) => void;
  maxLength?: number;
}

export default function RichTextEditor({
  content,
  onChange,
  placeholder = "내용을 입력하세요...",
  onPlainTextChange,
  maxLength
}: RichTextEditorProps) {
  // 에디터 내용이 변경될 때 처리
  const handleUpdate = React.useCallback(
    (newContent: string) => {
      // HTML 내용 업데이트
      onChange(newContent);

      // Plain text 업데이트 (있는 경우)
      if (onPlainTextChange) {
        const plainText = stripHtml(newContent);
        onPlainTextChange(plainText);
      }
    },
    [onChange, onPlainTextChange]
  );

  // 에디터 설정
  const { editor } = useEditorConfig({
    content,
    placeholder,
    onUpdate: handleUpdate
  });

  // 이미지 처리 훅
  const { isUploading, isDragOver, error, setError, fileInputRef, handleFileSelect, dragHandlers, handleImageUpload } =
    useImageHandler({ editor });

  // 링크 처리 훅
  const { setLink, unsetLink, isLinkActive } = useLinkHandler({ editor });

  // 붙여넣기 이벤트 처리
  const handlePaste = React.useCallback(
    (event: React.ClipboardEvent) => {
      const clipboardData = event.clipboardData;
      if (!clipboardData) return;

      // 1. 이미지 파일/데이터 확인
      const items = Array.from(clipboardData.items);
      const imageItems = items.filter(item => item.type.startsWith("image/"));

      if (imageItems.length > 0) {
        event.preventDefault();
        const imageItem = imageItems[0];
        const file = imageItem.getAsFile();

        if (file) {
          handleImageUpload(file);
          return;
        }
      }

      // 2. 텍스트 데이터에서 이미지 URL 확인
      const textData = clipboardData.getData("text/plain");
      if (textData && isImageUrl(textData)) {
        event.preventDefault();
        insertImageFromUrl(textData);
        return;
      }
    },
    [handleImageUpload]
  );

  // 이미지 URL 여부 확인
  const isImageUrl = (text: string): boolean => {
    try {
      const url = new URL(text);
      // 이미지 파일 확장자 또는 이미지 호스팅 서비스 도메인 확인
      const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)(\?.*)?$/i;
      const imageHosts = [
        "imgur.com",
        "i.imgur.com",
        "cdn.pixabay.com",
        "images.unsplash.com",
        "cdn.jsdelivr.net",
        "raw.githubusercontent.com",
        "i.postimg.cc",
        "postimg.cc",
        "imagedelivery.net", // Cloudflare Images
        "res.cloudinary.com", // Cloudinary
        "storage.googleapis.com", // Google Cloud Storage
        "amazonaws.com", // AWS S3
        "blob.core.windows.net" // Azure Blob Storage
      ];

      return imageExtensions.test(url.pathname) || imageHosts.some(host => url.hostname.includes(host));
    } catch {
      return false;
    }
  };

  // URL에서 이미지 삽입
  const insertImageFromUrl = (imageUrl: string) => {
    if (!editor) return;

    // URL에서 파일명 추출 시도
    const getFileNameFromUrl = (url: string): string => {
      try {
        const urlObj = new URL(url);
        const pathname = urlObj.pathname;
        const filename = pathname.split("/").pop() || "";

        if (filename && filename.includes(".")) {
          return filename;
        }

        // 파일명이 없으면 호스트명 기반으로 생성
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const extension = url.toLowerCase().includes(".webp")
          ? "webp"
          : url.toLowerCase().includes(".jpg")
            ? "jpg"
            : url.toLowerCase().includes(".png")
              ? "png"
              : "jpg";
        return `image-${timestamp}.${extension}`;
      } catch {
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        return `image-${timestamp}.jpg`;
      }
    };

    const fileName = getFileNameFromUrl(imageUrl);

    editor
      .chain()
      .focus()
      .setImage({
        src: imageUrl,
        alt: fileName,
        title: fileName
      })
      .run();
  };

  // 드롭 이벤트 처리
  const handleDrop = React.useCallback(
    (event: React.DragEvent) => {
      const files = Array.from(event.dataTransfer?.files || []);
      const imageFiles = files.filter(file => file.type.startsWith("image/"));

      if (imageFiles.length > 0) {
        event.preventDefault();
        const imageFile = imageFiles[0];
        handleImageUpload(imageFile);
      }
    },
    [handleImageUpload]
  );

  // 이미지 버튼 클릭 핸들러
  const handleImageButtonClick = () => {
    fileInputRef.current?.click();
  };

  // 에러 닫기 핸들러
  const handleErrorClose = () => {
    setError(null);
  };

  // 문자 수 계산 (maxLength가 있는 경우)
  const charCount = editor?.storage.characterCount?.characters() ?? stripHtml(content).length;
  const wordCount =
    editor?.storage.characterCount?.words() ??
    stripHtml(content)
      .split(/\s+/)
      .filter(word => word.length > 0).length;

  return (
    <div className="editor-container dark:bg-gray-800" {...dragHandlers} onPaste={handlePaste} onDrop={handleDrop}>
      {/* 툴바 */}
      <EditorToolbar
        editor={editor}
        onImageButtonClick={handleImageButtonClick}
        onLinkClick={setLink}
        onUnlinkClick={unsetLink}
        isLinkActive={isLinkActive}
        fileInputRef={fileInputRef as React.RefObject<HTMLInputElement>}
        onFileSelect={handleFileSelect}
      />

      {/* 에디터 컨텐츠 */}
      <div className="editor-content">
        <EditorContent editor={editor} />
      </div>

      {/* 문자 수 표시 (maxLength가 있는 경우) */}
      {maxLength && (
        <div className="text-xs text-gray-500 dark:text-gray-400 p-2 border-t flex justify-between items-center">
          <div>{wordCount} 단어</div>
          <div className={charCount > maxLength ? "text-red-500" : ""}>
            {charCount}/{maxLength}자
          </div>
        </div>
      )}

      {/* 오버레이들 */}
      <EditorOverlays isUploading={isUploading} isDragOver={isDragOver} error={error} onErrorClose={handleErrorClose} />
    </div>
  );
}
