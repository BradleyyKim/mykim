import { useState, useCallback, useRef } from "react";
import { Editor } from "@tiptap/react";
import imageCompression from "browser-image-compression";

interface UseImageHandlerProps {
  editor: Editor | null;
}

export function useImageHandler({ editor }: UseImageHandlerProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 이미지 업로드 핸들러
  const handleImageUpload = useCallback(
    async (file: File) => {
      if (!editor) return;

      setIsUploading(true);
      setError(null);

      try {
        // 이미지 압축 옵션
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1200,
          useWebWorker: true
        };

        // 이미지 압축
        const compressedFile = await imageCompression(file, options);

        // FileReader로 Base64 변환
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result as string;

          // 에디터에 이미지 삽입
          editor.chain().focus().setImage({ src: base64data, alt: file.name }).run();

          setIsUploading(false);
        };

        reader.onerror = () => {
          setError("이미지 처리 중 오류가 발생했습니다.");
          setIsUploading(false);
        };

        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error("이미지 처리 오류:", error);
        setError(error instanceof Error ? error.message : "이미지 처리 중 오류가 발생했습니다.");
        setIsUploading(false);
      }
    },
    [editor]
  );

  // 파일 선택 핸들러
  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file && file.type.startsWith("image/")) {
        handleImageUpload(file);
      }
      // 파일 input 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [handleImageUpload]
  );

  // 드래그 이벤트 핸들러들
  const dragHandlers = {
    onDragEnter: () => setIsDragOver(true),
    onDragLeave: (e: React.DragEvent) => {
      if (!e.currentTarget.contains(e.relatedTarget as Node)) {
        setIsDragOver(false);
      }
    },
    onDragOver: (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(true);
    },
    onDrop: () => setIsDragOver(false)
  };

  // 에디터 프롭스에서 사용할 핸들러들
  const editorHandlers = {
    handlePaste: (view: unknown, event: ClipboardEvent) => {
      const items = Array.from(event.clipboardData?.items || []);
      const imageItems = items.filter(item => item.type.startsWith("image/"));

      if (imageItems.length > 0) {
        const imageItem = imageItems[0];
        const file = imageItem.getAsFile();

        if (file) {
          handleImageUpload(file);
          return true;
        }
      }

      return false;
    },
    handleDrop: (view: unknown, event: DragEvent) => {
      const files = Array.from(event.dataTransfer?.files || []);
      const imageFiles = files.filter(file => file.type.startsWith("image/"));

      if (imageFiles.length > 0) {
        const imageFile = imageFiles[0];
        handleImageUpload(imageFile);
        return true;
      }

      return false;
    }
  };

  return {
    // 상태
    isUploading,
    isDragOver,
    error,
    setError,
    fileInputRef,

    // 핸들러들
    handleImageUpload,
    handleFileSelect,
    dragHandlers,
    editorHandlers
  };
}
