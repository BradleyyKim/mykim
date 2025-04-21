"use client";

import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Bold, Italic, Heading1, Heading2, List, ListOrdered, Link as LinkIcon, Image as ImageIcon, Check, X, AlertCircle } from "lucide-react";
import imageCompression from "browser-image-compression";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ content, onChange, placeholder = "내용을 입력하세요..." }: RichTextEditorProps) {
  const [linkUrl, setLinkUrl] = useState("");
  const [showLinkMenu, setShowLinkMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-500 underline cursor-pointer"
        }
      }),
      Placeholder.configure({
        placeholder
      })
    ],
    content: content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    }
  });

  const handleLinkSubmit = useCallback(() => {
    if (!editor) return;

    if (linkUrl) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: addHttpIfNeeded(linkUrl) })
        .run();
    } else {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    }
    setShowLinkMenu(false);
    setLinkUrl("");
  }, [editor, linkUrl]);

  const addHttpIfNeeded = (url: string) => {
    if (!/^https?:\/\//i.test(url)) {
      return `https://${url}`;
    }
    return url;
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!editor || !event.target.files || event.target.files.length === 0) return;

    try {
      setError(null);
      setImageUploading(true);
      const file = event.target.files[0];

      // 이미지 압축 옵션
      const options = {
        maxSizeMB: 1, // 최대 1MB
        maxWidthOrHeight: 1200, // 최대 가로 세로 1200px
        useWebWorker: true
      };

      // 이미지 압축 실행
      const compressedFile = await imageCompression(file, options);

      // 압축된 이미지를 base64로 변환
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result as string;

        // 에디터에 이미지 삽입
        editor.chain().focus().setImage({ src: base64data, alt: file.name }).run();

        setImageUploading(false);
      };
      reader.readAsDataURL(compressedFile);

      // 파일 인풋 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error("Image upload failed:", err);
      setError("이미지 업로드 중 오류가 발생했습니다.");
      setImageUploading(false);
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="relative border rounded-md overflow-hidden">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
          <AlertCircle className="h-4 w-4 mr-2" />
          {error}
          <button onClick={() => setError(null)} className="ml-auto">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="flex flex-wrap gap-1 p-2 bg-gray-50 border-b">
        <Button size="sm" variant={editor.isActive("bold") ? "default" : "outline"} className="h-8 px-2" onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold className="h-4 w-4" />
        </Button>

        <Button size="sm" variant={editor.isActive("italic") ? "default" : "outline"} className="h-8 px-2" onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic className="h-4 w-4" />
        </Button>

        <Button size="sm" variant={editor.isActive("heading", { level: 1 }) ? "default" : "outline"} className="h-8 px-2" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
          <Heading1 className="h-4 w-4" />
        </Button>

        <Button size="sm" variant={editor.isActive("heading", { level: 2 }) ? "default" : "outline"} className="h-8 px-2" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          <Heading2 className="h-4 w-4" />
        </Button>

        <Button size="sm" variant={editor.isActive("bulletList") ? "default" : "outline"} className="h-8 px-2" onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List className="h-4 w-4" />
        </Button>

        <Button size="sm" variant={editor.isActive("orderedList") ? "default" : "outline"} className="h-8 px-2" onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered className="h-4 w-4" />
        </Button>

        <Button size="sm" variant={editor.isActive("link") ? "default" : "outline"} className="h-8 px-2" onClick={() => setShowLinkMenu(true)}>
          <LinkIcon className="h-4 w-4" />
        </Button>

        <div className="relative">
          <Button size="sm" variant="outline" className="h-8 px-2" onClick={() => fileInputRef.current?.click()} disabled={imageUploading}>
            {imageUploading ? (
              <span className="flex items-center">
                <span className="animate-spin h-4 w-4 mr-1 border-2 border-gray-500 border-t-transparent rounded-full"></span>
                업로드 중...
              </span>
            ) : (
              <ImageIcon className="h-4 w-4" />
            )}
          </Button>
          <input type="file" className="hidden" ref={fileInputRef} accept="image/*" onChange={handleImageUpload} />
        </div>
      </div>

      {showLinkMenu && (
        <div className="flex items-center gap-2 p-2 bg-gray-100">
          <input
            type="text"
            value={linkUrl}
            onChange={e => setLinkUrl(e.target.value)}
            placeholder="https://example.com"
            className="flex h-9 w-full rounded-md border border-input bg-white px-3 py-1 text-sm shadow-sm"
          />
          <Button size="sm" onClick={handleLinkSubmit}>
            <Check className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => setShowLinkMenu(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <EditorContent editor={editor} className="prose max-w-none p-4 min-h-[300px] focus:outline-none" />

      {editor.isActive("link") && (
        <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
          <div className="flex items-center gap-1 p-1 rounded-md bg-white shadow border">
            <span className="px-2 text-sm">{editor.getAttributes("link").href}</span>
            <Button size="sm" variant="ghost" className="h-7 px-2" onClick={() => editor.chain().focus().extendMarkRange("link").unsetLink().run()}>
              <X className="h-3 w-3" />
            </Button>
          </div>
        </BubbleMenu>
      )}
    </div>
  );
}
