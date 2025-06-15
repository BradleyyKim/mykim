import { NextRequest, NextResponse } from "next/server";

/**
 * Strapi 미디어 라이브러리를 통한 이미지 업로드
 * 모바일 파일 첨부 시 실제 파일로 업로드하여 썸네일 생성 가능
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get("image") as File;

    if (!imageFile) {
      return NextResponse.json({ error: "이미지 파일이 필요합니다" }, { status: 400 });
    }

    // Strapi API URL
    const STRAPI_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337/api";
    const STRAPI_BASE_URL = STRAPI_API_URL.replace("/api", "");

    // JWT 토큰 또는 API 토큰 가져오기
    const authToken = request.cookies.get("adminToken");
    const headers: Record<string, string> = {};

    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken.value}`;
    } else {
      const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;
      if (STRAPI_API_TOKEN) {
        headers["Authorization"] = `Bearer ${STRAPI_API_TOKEN}`;
      } else {
        return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
      }
    }

    // Strapi 미디어 라이브러리에 업로드할 FormData 생성
    const strapiFormData = new FormData();
    strapiFormData.append("files", imageFile, imageFile.name);

    // Strapi Upload API 호출
    const uploadResponse = await fetch(`${STRAPI_BASE_URL}/api/upload`, {
      method: "POST",
      headers,
      body: strapiFormData
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error("Strapi 업로드 실패:", errorText);
      return NextResponse.json({ error: "Strapi 업로드에 실패했습니다" }, { status: uploadResponse.status });
    }

    const uploadResult = await uploadResponse.json();
    console.log("Strapi 업로드 성공:", uploadResult);

    // 첫 번째 업로드된 파일 정보 가져오기
    const uploadedFile = uploadResult[0];

    if (!uploadedFile) {
      return NextResponse.json({ error: "업로드된 파일 정보를 찾을 수 없습니다" }, { status: 500 });
    }

    // 성공 응답
    return NextResponse.json({
      success: true,
      url: uploadedFile.url.startsWith("http") ? uploadedFile.url : `${STRAPI_BASE_URL}${uploadedFile.url}`,
      filename: uploadedFile.name,
      size: uploadedFile.size,
      mime: uploadedFile.mime,
      id: uploadedFile.id,
      dimensions:
        uploadedFile.width && uploadedFile.height
          ? {
              width: uploadedFile.width,
              height: uploadedFile.height
            }
          : undefined
    });
  } catch (error) {
    console.error("이미지 업로드 API 오류:", error);
    return NextResponse.json(
      {
        error: "이미지 업로드 중 오류가 발생했습니다",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
