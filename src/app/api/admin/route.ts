import { NextRequest, NextResponse } from "next/server";
import { generateCareerPDF } from "@/lib/pdf-generator";
import { uploadPDFToStrapi } from "@/lib/strapi-utils";

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

    const { action, language, careerData } = await request.json();

    // 액션별 처리
    switch (action) {
      case "upload-pdf":
        if (!language || !careerData) {
          return NextResponse.json({ error: "언어와 경력 데이터가 필요합니다." }, { status: 400 });
        }

        // PDF 생성
        const pdfBuffer = await generateCareerPDF(careerData, language);

        // 파일명 생성 (타임스탬프 포함)
        const timestamp = new Date().toISOString().split("T")[0];
        const fileName = `career-portfolio-${language}-${timestamp}.pdf`;

        // Strapi에 업로드
        const uploadResult = await uploadPDFToStrapi(pdfBuffer, fileName);

        return NextResponse.json({
          success: true,
          message: `${language === "ko" ? "한국어" : "영어"} PDF가 성공적으로 업로드되었습니다.`,
          file: {
            url: uploadResult.url,
            id: uploadResult.id,
            name: fileName
          }
        });

      default:
        return NextResponse.json({ error: "지원하지 않는 액션입니다." }, { status: 400 });
    }
  } catch (error) {
    console.error("관리자 API 오류:", error);
    return NextResponse.json({ error: "요청 처리에 실패했습니다." }, { status: 500 });
  }
}
