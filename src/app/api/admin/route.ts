import { NextRequest, NextResponse } from "next/server";

// Edge Runtime 사용 (더 빠른 응답)
export const runtime = "edge";

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

    const { action } = await request.json();

    // 액션별 처리
    switch (action) {
      case "test":
        return NextResponse.json({
          success: true,
          message: "관리자 API가 정상적으로 작동합니다."
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
