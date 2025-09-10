import { useMemo } from "react";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import { common, createLowlight } from "lowlight";

// 커스텀 Image extension (애니메이션 지원)
const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      "data-animated": {
        default: null,
        parseHTML: element => element.getAttribute("data-animated"),
        renderHTML: attributes => {
          if (!attributes["data-animated"]) {
            return {};
          }
          return {
            "data-animated": attributes["data-animated"]
          };
        }
      }
    };
  }
});

interface UseEditorConfigProps {
  content: string;
  placeholder?: string;
  onUpdate?: (content: string) => void;
}

export function useEditorConfig({ content, placeholder = "내용을 입력하세요...", onUpdate }: UseEditorConfigProps) {
  // lowlight 인스턴스 생성 (common 언어들만 사용)
  const lowlight = useMemo(() => {
    return createLowlight(common);
  }, []);

  // 확장 프로그램들
  const extensions = useMemo(
    () => [
      StarterKit.configure({
        codeBlock: false // CodeBlockLowlight를 사용하므로 기본 codeBlock 비활성화
      }),
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: "plaintext"
      }),
      CustomImage.configure({
        HTMLAttributes: {
          class: "editor-image"
        }
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "editor-link"
        }
      }),
      Placeholder.configure({
        placeholder
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"]
      })
    ],
    [lowlight, placeholder]
  );

  // 에디터 인스턴스 생성
  const editor = useEditor({
    extensions,
    content,
    onUpdate: ({ editor }) => {
      onUpdate?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none"
      }
    }
  });

  return { editor, extensions };
}
