import { useCallback } from "react";
import { Editor } from "@tiptap/react";

interface UseLinkHandlerProps {
  editor: Editor | null;
}

export function useLinkHandler({ editor }: UseLinkHandlerProps) {
  // 링크 설정 핸들러
  const setLink = useCallback(() => {
    if (!editor) return;

    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    // 취소된 경우
    if (url === null) {
      return;
    }

    // URL이 비어있는 경우 링크 제거
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    // 링크 설정
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  // 링크 제거 핸들러
  const unsetLink = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().unsetLink().run();
  }, [editor]);

  // 링크 관련 상태 확인
  const isLinkActive = editor?.isActive("link") ?? false;

  return {
    setLink,
    unsetLink,
    isLinkActive
  };
}
