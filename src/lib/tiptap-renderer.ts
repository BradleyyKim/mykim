import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Document from "@tiptap/extension-document";
import { createLowlight } from "lowlight";
// 주요 언어들 import
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import python from "highlight.js/lib/languages/python";
import java from "highlight.js/lib/languages/java";
import css from "highlight.js/lib/languages/css";
import html from "highlight.js/lib/languages/xml";
import json from "highlight.js/lib/languages/json";
import bash from "highlight.js/lib/languages/bash";
import sql from "highlight.js/lib/languages/sql";
import markdown from "highlight.js/lib/languages/markdown";

// lowlight 인스턴스 생성 및 언어 등록
const lowlight = createLowlight();
lowlight.register("javascript", javascript);
lowlight.register("typescript", typescript);
lowlight.register("python", python);
lowlight.register("java", java);
lowlight.register("css", css);
lowlight.register("html", html);
lowlight.register("json", json);
lowlight.register("bash", bash);
lowlight.register("sql", sql);
lowlight.register("markdown", markdown);

// Tiptap 확장 설정
const extensions = [
  Document.configure({
    // 빈 줄 허용을 위한 설정
  }),
  StarterKit.configure({
    // 기본 CodeBlock을 비활성화하고 CodeBlockLowlight로 대체
    codeBlock: false,
    document: false // Document 확장을 별도로 설정했으므로 비활성화
  }),
  CodeBlockLowlight.configure({
    lowlight,
    defaultLanguage: "plaintext",
    HTMLAttributes: {
      class: "code-block-container"
    }
  }),
  Image.configure({
    HTMLAttributes: {
      class: "rounded-lg shadow-md max-w-full h-auto"
    }
  }),
  Link.configure({
    openOnClick: false,
    HTMLAttributes: {
      class: "text-blue-600 hover:text-blue-800 underline"
    }
  }),
  TextAlign.configure({
    types: ["heading", "paragraph"]
  })
];

/**
 * Tiptap JSON 콘텐츠를 HTML로 변환
 * @param content - Tiptap JSON 형식의 콘텐츠 또는 문자열
 * @returns HTML 문자열
 */
export function renderTiptapContent(content: string | object): string {
  try {
    // 문자열인 경우 JSON 파싱 시도
    let jsonContent: object;

    if (typeof content === "string") {
      try {
        jsonContent = JSON.parse(content);
      } catch {
        // JSON 파싱 실패 시 일반 텍스트로 처리
        return `<p>${content}</p>`;
      }
    } else {
      jsonContent = content;
    }

    // Tiptap JSON을 HTML로 변환
    const html = generateHTML(jsonContent, extensions);

    return html;
  } catch (error) {
    console.error("Error rendering Tiptap content:", error);
    // 에러 발생 시 원본 콘텐츠를 텍스트로 반환
    return typeof content === "string" ? `<p>${content}</p>` : "<p>콘텐츠를 불러올 수 없습니다.</p>";
  }
}

/**
 * Tiptap JSON 콘텐츠에서 플레인 텍스트 추출 (SEO 메타 설명용)
 * @param content - Tiptap JSON 형식의 콘텐츠 또는 문자열
 * @param maxLength - 최대 길이 (기본값: 160)
 * @returns 플레인 텍스트 문자열
 */
export function extractPlainText(content: string | object, maxLength: number = 160): string {
  try {
    let jsonContent: object;

    if (typeof content === "string") {
      try {
        jsonContent = JSON.parse(content);
      } catch {
        // JSON 파싱 실패 시 일반 텍스트로 처리
        return content.substring(0, maxLength);
      }
    } else {
      jsonContent = content;
    }

    // HTML로 변환 후 태그 제거
    const html = generateHTML(jsonContent, extensions);
    const plainText = html
      .replace(/<[^>]*>/g, "")
      .replace(/\s+/g, " ")
      .trim();

    return plainText.length > maxLength ? plainText.substring(0, maxLength) + "..." : plainText;
  } catch (error) {
    console.error("Error extracting plain text:", error);
    return typeof content === "string" ? content.substring(0, maxLength) : "콘텐츠를 불러올 수 없습니다.";
  }
}

/**
 * Tiptap JSON 콘텐츠에서 첫 번째 이미지 URL 추출
 * @param content - Tiptap JSON 형식의 콘텐츠 또는 문자열
 * @returns 첫 번째 이미지 URL 또는 null
 */
export function extractFirstImageFromTiptapContent(content: string | object): string | null {
  try {
    let jsonContent: unknown;

    if (typeof content === "string") {
      try {
        jsonContent = JSON.parse(content);
      } catch {
        // JSON 파싱 실패 시 HTML에서 이미지 추출 시도
        const imgRegex = /<img[^>]+src="([^">]+)"/;
        const imgMatch = content.match(imgRegex);
        const imageUrl = imgMatch?.[1] || null;

        // TODO: 향후 Base64 이미지를 Vercel Blob으로 자동 변환 예정
        // 현재는 Base64도 썸네일로 허용 (사용자 요청)
        return imageUrl;
      }
    } else {
      jsonContent = content;
    }

    // Tiptap JSON 구조에서 이미지 노드 찾기
    function findImageInNode(node: unknown): string | null {
      if (!node || typeof node !== "object") return null;

      const nodeObj = node as Record<string, unknown>;

      // 현재 노드가 이미지 노드인지 확인
      if (nodeObj.type === "image" && nodeObj.attrs && typeof nodeObj.attrs === "object" && nodeObj.attrs !== null) {
        const attrs = nodeObj.attrs as Record<string, unknown>;
        if (typeof attrs.src === "string") {
          // TODO: 향후 Base64 이미지를 Vercel Blob으로 자동 변환 예정
          // 현재는 Base64도 썸네일로 허용 (사용자 요청)
          return attrs.src;
        }
      }

      // 자식 노드들을 재귀적으로 검색
      if (nodeObj.content && Array.isArray(nodeObj.content)) {
        for (const childNode of nodeObj.content) {
          const imageUrl = findImageInNode(childNode);
          if (imageUrl) return imageUrl;
        }
      }

      return null;
    }

    return findImageInNode(jsonContent);
  } catch (error) {
    console.error("Error extracting first image from Tiptap content:", error);
    return null;
  }
}
