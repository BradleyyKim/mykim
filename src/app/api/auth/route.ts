import { NextRequest, NextResponse } from "next/server";

// 로그인 엔드포인트
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Strapi API URL
    const STRAPI_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:1337";

    // Strapi 인증 요청
    const response = await fetch(`${STRAPI_BASE_URL}/api/auth/local`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.error?.message || "로그인에 실패했습니다" }, { status: response.status });
    }

    // JWT 토큰을 httpOnly 쿠키에 저장
    const response1 = NextResponse.json({
      user: data.user
    });

    response1.cookies.set({
      name: "adminToken",
      value: data.jwt,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // HTTPS에서만 전송
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 1주일
      path: "/"
    });

    // 사용자 정보는 httpOnly 없이 반환 (UI에 표시용)
    return response1;
  } catch (error) {
    console.error("로그인 처리 오류:", error);
    return NextResponse.json({ error: "로그인 처리 중 오류가 발생했습니다" }, { status: 500 });
  }
}

// 로그아웃 엔드포인트
export async function DELETE() {
  // JWT 토큰 쿠키 삭제
  const response = NextResponse.json({ success: true });
  response.cookies.delete("adminToken");

  return response;
}

// 로그인 상태 확인
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("adminToken");

    if (!token) {
      return NextResponse.json({ isLoggedIn: false }, { status: 401 });
    }

    // Strapi API URL
    const STRAPI_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:1337";

    // 토큰 유효성 검증 (Strapi의 users/me API 사용)
    const response = await fetch(`${STRAPI_BASE_URL}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    });

    if (!response.ok) {
      // 토큰이 유효하지 않으면 쿠키 삭제
      const errResponse = NextResponse.json({ isLoggedIn: false }, { status: 401 });
      errResponse.cookies.delete("adminToken");
      return errResponse;
    }

    const user = await response.json();
    return NextResponse.json({
      isLoggedIn: true,
      user
    });
  } catch (error) {
    console.error("인증 상태 확인 오류:", error);
    return NextResponse.json({ isLoggedIn: false }, { status: 500 });
  }
}
