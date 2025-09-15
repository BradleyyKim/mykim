import { NextRequest, NextResponse } from "next/server";
import { generateCareerPDF } from "@/lib/pdf-generator";
import { uploadPDFToStrapi, deleteOldPDFsFromStrapi } from "@/lib/strapi-utils";

// Node.js Runtime 사용 (Puppeteer 호환성을 위해)
// export const runtime = "edge"; // Edge Runtime은 Puppeteer와 호환되지 않음

export async function POST(request: NextRequest) {
  try {
    // 쿠키에서 JWT 토큰 확인
    const adminToken = request.cookies.get("adminToken")?.value;

    if (!adminToken) {
      return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
    }

    // Strapi에서 사용자 정보 확인
    const STRAPI_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:1337";
    const userResponse = await fetch(`${STRAPI_BASE_URL}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${adminToken}`
      }
    });

    if (!userResponse.ok) {
      return NextResponse.json({ error: "유효하지 않은 토큰입니다." }, { status: 401 });
    }

    const { action, careerData, careerDataEn } = await request.json();

    // 디버깅: 전달된 데이터 확인
    console.log("=== PDF 생성 요청 데이터 확인 ===");
    console.log("한국어 데이터 개수:", careerData?.length);
    console.log("영어 데이터 개수:", careerDataEn?.length);
    console.log("한국어 첫 번째 회사명:", careerData?.[0]?.name);
    console.log("영어 첫 번째 회사명:", careerDataEn?.[0]?.name);

    // 액션별 처리
    switch (action) {
      case "upload-all-pdfs":
        if (!careerData || !careerDataEn) {
          return NextResponse.json({ error: "한국어 및 영어 경력 데이터가 필요합니다." }, { status: 400 });
        }

        const results = [];

        // 한국어 PDF 생성 및 업로드
        console.log("한국어 PDF 생성 시작...");
        await deleteOldPDFsFromStrapi("ko");
        const koPdfBuffer = await generateCareerPDF(careerData, "ko");
        const koTimestamp = new Date().toISOString().split("T")[0];
        const koFileName = `career-portfolio-ko-${koTimestamp}.pdf`;
        const koUploadResult = await uploadPDFToStrapi(koPdfBuffer, koFileName);
        results.push({ language: "ko", file: koUploadResult });
        console.log("한국어 PDF 생성 및 업로드 완료");

        // 영어 PDF 생성 및 업로드
        console.log("영어 PDF 생성 시작...");
        await deleteOldPDFsFromStrapi("en");
        const enPdfBuffer = await generateCareerPDF(careerDataEn, "en");
        const enTimestamp = new Date().toISOString().split("T")[0];
        const enFileName = `career-portfolio-en-${enTimestamp}.pdf`;
        const enUploadResult = await uploadPDFToStrapi(enPdfBuffer, enFileName);
        results.push({ language: "en", file: enUploadResult });
        console.log("영어 PDF 생성 및 업로드 완료");

        return NextResponse.json({
          success: true,
          message: "한국어 및 영어 PDF가 성공적으로 업로드되었습니다.",
          files: results
        });

      default:
        return NextResponse.json({ error: "지원하지 않는 액션입니다." }, { status: 400 });
    }
  } catch (error) {
    console.error("관리자 API 오류:", error);
    return NextResponse.json(
      {
        error: "요청 처리에 실패했습니다.",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
