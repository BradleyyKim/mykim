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

  // 실제 파일을 서버에 업로드 (모바일 파일 첨부용)
  const handleRealFileUpload = useCallback(
    async (file: File) => {
      if (!editor) return;

      setIsUploading(true);
      setError(null);

      try {
        // 파일 압축
        const compressedFile = await imageCompression(file, {
          maxSizeMB: 2,
          maxWidthOrHeight: 1920,
          useWebWorker: true
        });

        // 실제 파일을 서버에 업로드
        const formData = new FormData();
        formData.append("image", compressedFile);

        const response = await fetch("/api/upload/image", {
          method: "POST",
          body: formData
        });

        if (!response.ok) {
          throw new Error("서버 업로드에 실패했습니다");
        }

        const uploadResult = await response.json();

        // 업로드된 URL로 이미지 삽입
        editor
          .chain()
          .focus()
          .setImage({
            src: uploadResult.url,
            alt: uploadResult.filename,
            title: uploadResult.filename
          })
          .run();

        console.log("실제 파일 업로드 완료:", uploadResult.filename);
        setIsUploading(false);
      } catch (error) {
        console.error("실제 파일 업로드 실패:", error);

        // 실패 시 Base64 방식으로 폴백
        console.log("Base64 방식으로 폴백 처리");
        await handleBase64Upload(file);
      }
    },
    [editor]
  );

  // Base64 방식 업로드 (복사 붙여넣기용)
  const handleBase64Upload = useCallback(
    async (file: File) => {
      if (!editor) return;

      try {
        // 이미지 압축
        const compressedFile = await imageCompression(file, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1200,
          useWebWorker: true
        });

        const generateImageFileName = (originalFile: File): string => {
          const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
          const extension = originalFile.type.split("/")[1] || "png";

          if (
            originalFile.name === "image.png" ||
            originalFile.name === "blob" ||
            originalFile.name.startsWith("image") ||
            originalFile.name === ""
          ) {
            return `pasted-image-${timestamp}.${extension}`;
          }

          return originalFile.name;
        };

        const improvedFileName = generateImageFileName(file);

        // FileReader로 Base64 변환
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result as string;

          editor
            .chain()
            .focus()
            .setImage({
              src: base64data,
              alt: improvedFileName,
              title: improvedFileName
            })
            .run();

          console.log("Base64 방식 업로드 완료:", improvedFileName);
          setIsUploading(false);
        };

        reader.onerror = () => {
          setError("이미지 처리 중 오류가 발생했습니다.");
          setIsUploading(false);
        };

        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error("Base64 업로드 오류:", error);
        setError(error instanceof Error ? error.message : "이미지 처리 중 오류가 발생했습니다.");
        setIsUploading(false);
      }
    },
    [editor]
  );

  // 통합 이미지 업로드 핸들러
  const handleImageUpload = useCallback(
    async (file: File, source: "file" | "paste" | "drop" = "paste") => {
      if (!editor) return;

      setIsUploading(true);
      setError(null);

      try {
        if (source === "file") {
          // 파일 첨부 (모바일 포함): 실제 파일 업로드 시도
          await handleRealFileUpload(file);
        } else {
          // 복사 붙여넣기/드롭: Base64 방식 사용
          await handleBase64Upload(file);
        }
      } catch (error) {
        console.error("이미지 업로드 오류:", error);
        setError(error instanceof Error ? error.message : "이미지 처리 중 오류가 발생했습니다.");
        setIsUploading(false);
      }
    },
    [editor, handleRealFileUpload, handleBase64Upload]
  );

  // 파일 선택 핸들러 (모바일 첨부)
  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file && file.type.startsWith("image/")) {
        // 파일 첨부는 실제 파일 업로드로 처리
        handleImageUpload(file, "file");
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
          // 붙여넣기는 Base64 방식으로 처리
          handleImageUpload(file, "paste");
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
        // 드롭은 Base64 방식으로 처리
        handleImageUpload(imageFile, "drop");
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
