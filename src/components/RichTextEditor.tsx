"use client";

import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  Check,
  X,
  AlertCircle,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Quote,
  Code,
  Undo,
  Redo,
  FileText
} from "lucide-react";
import imageCompression from "browser-image-compression";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  onPlainTextChange?: (plainText: string) => void;
  placeholder?: string;
  maxLength?: number;
}

export const stripHtml = (html: string) => {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .trim();
};

export default function RichTextEditor({ content, onChange, onPlainTextChange, placeholder = "내용을 입력하세요...", maxLength }: RichTextEditorProps) {
  const [linkUrl, setLinkUrl] = useState("");
  const [showLinkMenu, setShowLinkMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);

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
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"],
        defaultAlignment: "left"
      }),
      Placeholder.configure({
        placeholder
      })
    ],
    content: content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);

      const plainText = stripHtml(html);
      setCharCount(plainText.length);
      setWordCount(plainText.split(/\s+/).filter(Boolean).length);

      if (onPlainTextChange) {
        const summary = plainText.substring(0, 160);
        onPlainTextChange(summary);
      }

      if (maxLength && plainText.length > maxLength) {
        setError(`최대 ${maxLength}자까지 입력 가능합니다.`);
      } else {
        if (error && error.includes("최대")) {
          setError(null);
        }
      }
    }
  });

  useEffect(() => {
    if (content) {
      const plainText = stripHtml(content);
      setCharCount(plainText.length);
      setWordCount(plainText.split(/\s+/).filter(Boolean).length);
    }
  }, [content]);

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

  const generateDescription = useCallback(() => {
    if (!editor) return;

    const plainText = stripHtml(editor.getHTML());
    const summary = plainText.substring(0, 160);

    if (onPlainTextChange) {
      onPlainTextChange(summary);
    }
  }, [editor, onPlainTextChange]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!editor || !event.target.files || event.target.files.length === 0) return;

    try {
      setError(null);
      setImageUploading(true);
      const file = event.target.files[0];

      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1200,
        useWebWorker: true
      };

      const compressedFile = await imageCompression(file, options);

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result as string;

        editor.chain().focus().setImage({ src: base64data, alt: file.name }).run();

        setImageUploading(false);
      };
      reader.readAsDataURL(compressedFile);

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
    <div className="relative border rounded-md overflow-hidden w-full h-full flex flex-col">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
          <AlertCircle className="h-4 w-4 mr-2" />
          {error}
          <button type="button" onClick={() => setError(null)} className="ml-auto">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="flex flex-wrap gap-1 p-2 bg-gray-50 dark:bg-gray-800 border-b">
        <Button type="button" size="sm" variant="outline" className="h-8 px-2" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
          <Undo className="h-4 w-4" />
        </Button>
        <Button type="button" size="sm" variant="outline" className="h-8 px-2" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
          <Redo className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>

        <Button type="button" size="sm" variant={editor.isActive("bold") ? "default" : "outline"} className="h-8 px-2" onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold className="h-4 w-4" />
        </Button>
        <Button type="button" size="sm" variant={editor.isActive("italic") ? "default" : "outline"} className="h-8 px-2" onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic className="h-4 w-4" />
        </Button>
        <Button type="button" size="sm" variant={editor.isActive("code") ? "default" : "outline"} className="h-8 px-2" onClick={() => editor.chain().focus().toggleCode().run()}>
          <Code className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>

        <Button
          type="button"
          size="sm"
          variant={editor.isActive("heading", { level: 1 }) ? "default" : "outline"}
          className="h-8 px-2"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive("heading", { level: 2 }) ? "default" : "outline"}
          className="h-8 px-2"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button type="button" size="sm" variant={editor.isActive("blockquote") ? "default" : "outline"} className="h-8 px-2" onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <Quote className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>

        <Button type="button" size="sm" variant={editor.isActive("bulletList") ? "default" : "outline"} className="h-8 px-2" onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List className="h-4 w-4" />
        </Button>
        <Button type="button" size="sm" variant={editor.isActive("orderedList") ? "default" : "outline"} className="h-8 px-2" onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>

        <Button type="button" size="sm" variant={editor.isActive({ textAlign: "left" }) ? "default" : "outline"} className="h-8 px-2" onClick={() => editor.chain().focus().setTextAlign("left").run()}>
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive({ textAlign: "center" }) ? "default" : "outline"}
          className="h-8 px-2"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive({ textAlign: "right" }) ? "default" : "outline"}
          className="h-8 px-2"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          <AlignRight className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive({ textAlign: "justify" }) ? "default" : "outline"}
          className="h-8 px-2"
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        >
          <AlignJustify className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1"></div>

        <Button type="button" size="sm" variant={editor.isActive("link") ? "default" : "outline"} className="h-8 px-2" onClick={() => setShowLinkMenu(true)}>
          <LinkIcon className="h-4 w-4" />
        </Button>

        <Button type="button" size="sm" variant="outline" className="h-8 px-2" onClick={() => fileInputRef.current?.click()} disabled={imageUploading}>
          {imageUploading ? (
            <span className="flex items-center">
              <span className="animate-spin h-4 w-4 mr-1 border-2 border-gray-500 border-t-transparent rounded-full"></span>
              <span className="text-xs">업로드 중...</span>
            </span>
          ) : (
            <ImageIcon className="h-4 w-4" />
          )}
        </Button>

        <Button type="button" size="sm" variant="outline" className="h-8 px-2" onClick={generateDescription} title="설명 자동 생성">
          <FileText className="h-4 w-4" />
        </Button>

        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleImageUpload}
          onClick={e => {
            e.stopPropagation();
          }}
        />
      </div>

      {showLinkMenu && (
        <div className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-700">
          <input
            type="text"
            value={linkUrl}
            onChange={e => setLinkUrl(e.target.value)}
            placeholder="https://example.com"
            className="flex h-9 w-full rounded-md border border-input bg-white dark:bg-gray-800 px-3 py-1 text-sm shadow-sm"
            onKeyDown={e => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleLinkSubmit();
              }
            }}
          />
          <Button type="button" size="sm" onClick={handleLinkSubmit}>
            <Check className="h-4 w-4" />
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={() => setShowLinkMenu(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <EditorContent editor={editor} className="flex-1 overflow-auto" />

      <div className="text-xs text-gray-500 dark:text-gray-400 p-2 border-t flex justify-between items-center">
        <div>{wordCount} 단어</div>
        <div>{maxLength ? `${charCount}/${maxLength}자` : `${charCount}자`}</div>
      </div>

      <style jsx global>{`
        .ProseMirror {
          min-height: 300px;
          height: 100%;
          padding: 1rem;
          outline: none;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #adb5bd;
          pointer-events: none;
          height: 0;
        }
        .ProseMirror img {
          max-width: 100%;
          height: auto;
          margin: 1rem 0;
        }
        .ProseMirror blockquote {
          border-left: 3px solid #ddd;
          padding-left: 1rem;
          font-style: italic;
          margin: 1rem 0;
        }
        .ProseMirror code {
          background-color: rgba(97, 97, 97, 0.1);
          color: #616161;
          padding: 0.2rem 0.4rem;
          border-radius: 3px;
          font-family: monospace;
        }
        .ProseMirror p[style*="text-align:center"],
        .ProseMirror h1[style*="text-align:center"],
        .ProseMirror h2[style*="text-align:center"] {
          text-align: center;
        }
        .ProseMirror p[style*="text-align:right"],
        .ProseMirror h1[style*="text-align:right"],
        .ProseMirror h2[style*="text-align:right"] {
          text-align: right;
        }
        .ProseMirror p[style*="text-align:justify"],
        .ProseMirror h1[style*="text-align:justify"],
        .ProseMirror h2[style*="text-align:justify"] {
          text-align: justify;
        }
      `}</style>

      {editor.isActive("link") && (
        <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
          <div className="flex items-center gap-1 p-1 rounded-md bg-white shadow border dark:bg-gray-800 dark:border-gray-700">
            <span className="px-2 text-xs max-w-[200px] truncate">{editor.getAttributes("link").href}</span>
            <Button type="button" size="sm" variant="ghost" className="h-6 px-2 py-0" onClick={() => window.open(editor.getAttributes("link").href, "_blank")}>
              <LinkIcon className="h-3 w-3" />
            </Button>
            <Button type="button" size="sm" variant="ghost" className="h-6 px-2 py-0" onClick={() => editor.chain().focus().extendMarkRange("link").unsetLink().run()}>
              <X className="h-3 w-3" />
            </Button>
          </div>
        </BubbleMenu>
      )}
    </div>
  );
}
