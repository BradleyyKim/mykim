import { NextRequest, NextResponse } from "next/server";
import { generateCareerPDF } from "@/lib/pdf-generator";
import { uploadPDFToStrapi } from "@/lib/strapi-utils";

export async function POST(request: NextRequest) {
  try {
    // 인증 확인
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    // Strapi에서 사용자 정보 확인
    const userResponse = await fetch(`${process.env.STRAPI_URL}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!userResponse.ok) {
      return NextResponse.json({ error: "유효하지 않은 토큰입니다." }, { status: 401 });
    }

    const { language, careerData } = await request.json();

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
  } catch (error) {
    console.error("PDF 업로드 실패:", error);
    return NextResponse.json({ error: "PDF 업로드에 실패했습니다." }, { status: 500 });
  }
}
