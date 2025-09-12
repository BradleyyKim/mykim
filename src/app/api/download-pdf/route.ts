import { NextRequest, NextResponse } from "next/server";
import { getPDFFromStrapi } from "@/lib/strapi-utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const language = searchParams.get("language");

    if (!language || !["ko", "en"].includes(language)) {
      return NextResponse.json({ error: "유효하지 않은 언어입니다." }, { status: 400 });
    }

    // Strapi에서 PDF 가져오기
    const pdfFile = await getPDFFromStrapi(language);

    if (!pdfFile) {
      return NextResponse.json(
        { error: `${language === "ko" ? "한국어" : "영어"} PDF를 찾을 수 없습니다.` },
        { status: 404 }
      );
    }

    console.log(`[download-pdf] 찾은 PDF 파일 정보:`, {
      name: pdfFile.name,
      url: pdfFile.url,
      id: pdfFile.id
    });

    // Strapi에서 PDF 다운로드
    // 상대 경로인 경우 Strapi Base URL과 결합
    const STRAPI_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:1337";
    const pdfUrl = pdfFile.url.startsWith("http") ? pdfFile.url : `${STRAPI_BASE_URL}${pdfFile.url}`;

    console.log(`[download-pdf] PDF URL:`, pdfUrl);

    const response = await fetch(pdfUrl);

    if (!response.ok) {
      return NextResponse.json({ error: "PDF 다운로드에 실패했습니다." }, { status: 500 });
    }

    const pdfBuffer = await response.arrayBuffer();

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="career-portfolio-${language}.pdf"`,
        "Content-Length": pdfBuffer.byteLength.toString(),
        "Cache-Control": "public, max-age=3600" // 1시간 캐시
      }
    });
  } catch (error) {
    console.error("PDF 다운로드 실패:", error);
    return NextResponse.json({ error: "PDF 다운로드에 실패했습니다." }, { status: 500 });
  }
}
