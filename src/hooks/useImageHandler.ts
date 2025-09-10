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

  // 애니메이션 이미지 여부 확인
  const isAnimatedImage = useCallback((file: File): boolean => {
    return file.type === "image/gif" || file.type === "image/webp" || file.name.toLowerCase().endsWith(".gif");
  }, []);

  // 파일 크기 검증
  const validateFileSize = useCallback(
    (file: File): { valid: boolean; message?: string } => {
      const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
      const MAX_ANIMATED_SIZE = 15 * 1024 * 1024; // 15MB (애니메이션은 조금 더 허용)

      if (isAnimatedImage(file)) {
        if (file.size > MAX_ANIMATED_SIZE) {
          return {
            valid: false,
            message: `애니메이션 이미지는 ${MAX_ANIMATED_SIZE / 1024 / 1024}MB 이하만 지원됩니다. (현재: ${(file.size / 1024 / 1024).toFixed(1)}MB)`
          };
        }
      } else {
        if (file.size > MAX_FILE_SIZE) {
          return {
            valid: false,
            message: `이미지는 ${MAX_FILE_SIZE / 1024 / 1024}MB 이하만 지원됩니다. (현재: ${(file.size / 1024 / 1024).toFixed(1)}MB)`
          };
        }
      }

      return { valid: true };
    },
    [isAnimatedImage]
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

  // 애니메이션 이미지 전용 업로드 (압축 없이)
  const handleAnimatedImageUpload = useCallback(
    async (file: File, source: "file" | "paste" | "drop") => {
      if (!editor) return;

      try {
        if (source === "file") {
          // 서버 업로드 (압축 없이)
          const formData = new FormData();
          formData.append("image", file); // 압축하지 않음

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
              alt: file.name,
              title: file.name
            })
            .run();

          // 애니메이션 속성 추가 (안전한 방식)
          try {
            const { state } = editor;
            const { selection } = state;
            if (selection && selection.from !== selection.to) {
              editor
                .chain()
                .setNodeSelection(selection.from)
                .updateAttributes("image", { "data-animated": "true" })
                .run();
            }
          } catch (error) {
            console.warn("애니메이션 속성 설정 실패:", error);
            // 속성 설정 실패해도 이미지는 정상 삽입됨
          }

          console.log("애니메이션 이미지 서버 업로드 완료:", file.name);
          setIsUploading(false);
        } else {
          // Base64 방식 (압축 없이)
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64data = reader.result as string;
            editor
              .chain()
              .focus()
              .setImage({
                src: base64data,
                alt: file.name,
                title: file.name
              })
              .run();

            // 애니메이션 속성 추가 (안전한 방식)
            try {
              const { state } = editor;
              const { selection } = state;
              if (selection && selection.from !== selection.to) {
                editor
                  .chain()
                  .setNodeSelection(selection.from)
                  .updateAttributes("image", { "data-animated": "true" })
                  .run();
              }
            } catch (error) {
              console.warn("애니메이션 속성 설정 실패:", error);
              // 속성 설정 실패해도 이미지는 정상 삽입됨
            }

            console.log("애니메이션 이미지 Base64 업로드 완료:", file.name);
            setIsUploading(false);
          };

          reader.onerror = () => {
            setError("애니메이션 이미지 처리 중 오류가 발생했습니다.");
            setIsUploading(false);
          };

          reader.readAsDataURL(file); // 압축 없이 직접 처리
        }
      } catch (error) {
        console.error("애니메이션 이미지 업로드 실패:", error);

        // 구체적인 에러 메시지 제공
        let errorMessage = "애니메이션 이미지 처리 중 오류가 발생했습니다.";

        if (error instanceof Error) {
          if (error.message.includes("서버 업로드에 실패")) {
            errorMessage = "서버 업로드에 실패했습니다. 네트워크 연결을 확인해주세요.";
          } else if (error.message.includes("FileReader")) {
            errorMessage = "파일 읽기에 실패했습니다. 파일이 손상되었을 수 있습니다.";
          } else {
            errorMessage = error.message;
          }
        }

        setError(errorMessage);
        setIsUploading(false);
      }
    },
    [editor]
  );

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
    [editor, handleBase64Upload]
  );

  // 통합 이미지 업로드 핸들러
  const handleImageUpload = useCallback(
    async (file: File, source: "file" | "paste" | "drop" = "paste") => {
      if (!editor) return;

      // 파일 크기 검증
      const sizeValidation = validateFileSize(file);
      if (!sizeValidation.valid) {
        setError(sizeValidation.message || "파일 크기가 너무 큽니다.");
        return;
      }

      setIsUploading(true);
      setError(null);

      try {
        if (isAnimatedImage(file)) {
          // 애니메이션 이미지는 압축하지 않고 직접 처리
          await handleAnimatedImageUpload(file, source);
        } else {
          // 정적 이미지는 기존 압축 로직 사용
          if (source === "file") {
            // 파일 첨부 (모바일 포함): 실제 파일 업로드 시도
            await handleRealFileUpload(file);
          } else {
            // 복사 붙여넣기/드롭: Base64 방식 사용
            await handleBase64Upload(file);
          }
        }
      } catch (error) {
        console.error("이미지 업로드 오류:", error);
        setError(error instanceof Error ? error.message : "이미지 처리 중 오류가 발생했습니다.");
        setIsUploading(false);
      }
    },
    [editor, handleRealFileUpload, handleBase64Upload, handleAnimatedImageUpload, isAnimatedImage, validateFileSize]
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
    onDragEnter: (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(true);
    },
    onDragLeave: (e: React.DragEvent) => {
      if (!e.currentTarget.contains(e.relatedTarget as Node)) {
        setIsDragOver(false);
      }
    },
    onDragOver: (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(true);
    },
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer?.files || []);
      const imageFiles = files.filter(file => file.type.startsWith("image/"));

      if (imageFiles.length > 0) {
        const imageFile = imageFiles[0];
        handleImageUpload(imageFile, "drop");
      }
    }
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
