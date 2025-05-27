import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";

// Tiptap 확장 설정
const extensions = [
  StarterKit,
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
