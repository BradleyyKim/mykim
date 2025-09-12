import { NextRequest, NextResponse } from "next/server";
import { generateCareerPDF } from "@/lib/pdf-generator";
import { uploadPDFToStrapi, deleteOldPDFsFromStrapi } from "@/lib/strapi-utils";

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

    const { action, careerData } = await request.json();

    console.log(`[admin/route] API로 수신된 데이터:`, JSON.stringify(careerData, null, 2));

    // 액션별 처리
    switch (action) {
      case "upload-all-pdfs":
        if (!careerData) {
          return NextResponse.json({ error: "경력 데이터가 필요합니다." }, { status: 400 });
        }

        const results = [];

        // 한국어 PDF 업로드
        await deleteOldPDFsFromStrapi("ko");
        const koPdfBuffer = await generateCareerPDF(careerData, "ko");
        const koTimestamp = new Date().toISOString().split("T")[0];
        const koFileName = `career-portfolio-ko-${koTimestamp}.pdf`;
        const koUploadResult = await uploadPDFToStrapi(koPdfBuffer, koFileName);
        results.push({ language: "ko", file: koUploadResult });

        // 영어 PDF 업로드
        await deleteOldPDFsFromStrapi("en");
        const enPdfBuffer = await generateCareerPDF(careerData, "en");
        const enTimestamp = new Date().toISOString().split("T")[0];
        const enFileName = `career-portfolio-en-${enTimestamp}.pdf`;
        const enUploadResult = await uploadPDFToStrapi(enPdfBuffer, enFileName);
        results.push({ language: "en", file: enUploadResult });

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
    return NextResponse.json({ error: "요청 처리에 실패했습니다." }, { status: 500 });
  }
}
