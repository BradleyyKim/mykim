import type { Company } from "@/app/career/page";
import { cssPDFGenerator } from "./css-pdf-generator";

/**
 * CSS Print Media 방식으로 PDF 생성
 * Pozafly의 아티클을 참고하여 최적화된 구현
 */
export async function generateClientPDF(data: Company[], language: "ko" | "en"): Promise<void> {
  try {
    await cssPDFGenerator.generatePDF(data, language);
  } catch (error) {
    console.error("CSS PDF 생성 실패:", error);
    throw new Error(`PDF 생성에 실패했습니다: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

/**
 * PDF 미리보기 (인쇄 대화상자 없이)
 */
export async function previewPDF(data: Company[], language: "ko" | "en"): Promise<void> {
  try {
    await cssPDFGenerator.previewPDF(data, language);
  } catch (error) {
    console.error("PDF 미리보기 실패:", error);
    throw new Error(`PDF 미리보기에 실패했습니다: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}
