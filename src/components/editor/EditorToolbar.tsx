"use client";

import React from "react";
import { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Code2,
  ImageIcon,
  Link,
  Unlink
} from "lucide-react";

interface EditorToolbarProps {
  editor: Editor | null;
  onImageButtonClick: () => void;
  onLinkClick: () => void;
  onUnlinkClick: () => void;
  isLinkActive: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function EditorToolbar({
  editor,
  onImageButtonClick,
  onLinkClick,
  onUnlinkClick,
  isLinkActive,
  fileInputRef,
  onFileSelect
}: EditorToolbarProps) {
  if (!editor) {
    return null;
  }

  return (
    <div className="border-b border-gray-200 p-2">
      <div className="flex flex-wrap gap-1">
        {/* 텍스트 포맷 */}
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive("bold") ? "bg-gray-200" : ""}`}
          title="굵게"
        >
          <Bold className="w-4 h-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive("italic") ? "bg-gray-200" : ""}`}
          title="기울임"
        >
          <Italic className="w-4 h-4" />
        </button>

        <div className="w-px h-8 bg-gray-300 mx-1" />

        {/* 제목 */}
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`px-3 py-2 rounded hover:bg-gray-100 text-sm font-medium ${editor.isActive("heading", { level: 1 }) ? "bg-gray-200" : ""}`}
          title="제목 1"
        >
          H1
        </button>

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-3 py-2 rounded hover:bg-gray-100 text-sm font-medium ${editor.isActive("heading", { level: 2 }) ? "bg-gray-200" : ""}`}
          title="제목 2"
        >
          H2
        </button>

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`px-3 py-2 rounded hover:bg-gray-100 text-sm font-medium ${editor.isActive("heading", { level: 3 }) ? "bg-gray-200" : ""}`}
          title="제목 3"
        >
          H3
        </button>

        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive("paragraph") ? "bg-gray-200" : ""}`}
          title="본문"
        >
          <Type className="w-4 h-4" />
        </button>

        <div className="w-px h-8 bg-gray-300 mx-1" />

        {/* 정렬 */}
        <button
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive({ textAlign: "left" }) ? "bg-gray-200" : ""}`}
          title="왼쪽 정렬"
        >
          <AlignLeft className="w-4 h-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive({ textAlign: "center" }) ? "bg-gray-200" : ""}`}
          title="가운데 정렬"
        >
          <AlignCenter className="w-4 h-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive({ textAlign: "right" }) ? "bg-gray-200" : ""}`}
          title="오른쪽 정렬"
        >
          <AlignRight className="w-4 h-4" />
        </button>

        <div className="w-px h-8 bg-gray-300 mx-1" />

        {/* 리스트 */}
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive("bulletList") ? "bg-gray-200" : ""}`}
          title="불릿 리스트"
        >
          <List className="w-4 h-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive("orderedList") ? "bg-gray-200" : ""}`}
          title="숫자 리스트"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <div className="w-px h-8 bg-gray-300 mx-1" />

        {/* 인용문 */}
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive("blockquote") ? "bg-gray-200" : ""}`}
          title="인용문"
        >
          <Quote className="w-4 h-4" />
        </button>

        {/* 코드 블록 */}
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-2 rounded hover:bg-gray-100 ${editor.isActive("codeBlock") ? "bg-gray-200" : ""}`}
          title="코드 블록"
        >
          <Code2 className="w-4 h-4" />
        </button>

        <div className="w-px h-8 bg-gray-300 mx-1" />

        {/* 이미지 */}
        <button onClick={onImageButtonClick} className="p-2 rounded hover:bg-gray-100" title="이미지 삽입">
          <ImageIcon className="w-4 h-4" />
        </button>

        {/* 링크 */}
        <button
          onClick={onLinkClick}
          className={`p-2 rounded hover:bg-gray-100 ${isLinkActive ? "bg-gray-200" : ""}`}
          title="링크"
        >
          <Link className="w-4 h-4" />
        </button>

        <button
          onClick={onUnlinkClick}
          className="p-2 rounded hover:bg-gray-100"
          title="링크 제거"
          disabled={!isLinkActive}
        >
          <Unlink className="w-4 h-4" />
        </button>

        <div className="w-px h-8 bg-gray-300 mx-1" />

        {/* 실행 취소/재실행 */}
        <button
          onClick={() => editor.chain().focus().undo().run()}
          className="p-2 rounded hover:bg-gray-100"
          disabled={!editor.can().undo()}
          title="실행 취소"
        >
          <Undo className="w-4 h-4" />
        </button>

        <button
          onClick={() => editor.chain().focus().redo().run()}
          className="p-2 rounded hover:bg-gray-100"
          disabled={!editor.can().redo()}
          title="재실행"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>

      {/* 숨겨진 파일 입력 */}
      <input ref={fileInputRef} type="file" accept="image/*" onChange={onFileSelect} className="hidden" />
    </div>
  );
}
