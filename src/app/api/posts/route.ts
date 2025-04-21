import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Request body:", body);

    // Strapi API URL
    const STRAPI_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337/api";

    // JWT 토큰 쿠키 읽기
    const authToken = request.cookies.get("adminToken");

    // 헤더 구성
    const headers: Record<string, string> = {
      "Content-Type": "application/json"
    };

    // JWT 토큰이 있으면 Authorization 헤더에 추가
    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken.value}`;
      console.log("Using client JWT token for authorization");
    } else {
      // 없으면 서버 측 API 토큰 사용 (기존 방식 유지)
      const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;
      if (STRAPI_API_TOKEN) {
        headers["Authorization"] = `Bearer ${STRAPI_API_TOKEN}`;
        console.log("Using server API token for authorization");
      } else {
        console.log("No authorization provided");
      }
    }

    console.log("Request Headers:", {
      ...headers,
      Authorization: headers.Authorization ? `${headers.Authorization.substring(0, 20)}...` : "None"
    });

    // 요청 바디 타입 설정
    interface PostData {
      title: string;
      content: string;
      slug: string;
      description: string;
      publishedDate?: string | null;
      postStatus?: string | null;
      category?: string;
    }

    // 요청 바디 구성
    const requestBody = {
      data: {
        title: body.title,
        content: body.content,
        slug: body.title.toLowerCase().replace(/\s+/g, "-"),
        description: body.content.substring(0, 200) // 첫 200자를 설명으로 사용
      } as PostData
    };

    // 카테고리가 있으면 추가
    if (body.category) {
      // 카테고리 ID를 그대로 문자열로 유지
      requestBody.data.category = body.category;
    }

    console.log("Request Body:", requestBody);

    // API 요청
    const response = await fetch(`${STRAPI_API_URL}/posts`, {
      method: "POST",
      headers,
      body: JSON.stringify(requestBody)
    });

    // 응답 상태 및 헤더 로깅
    console.log("Response status:", response.status);
    console.log("Response status text:", response.statusText);

    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      let errorMessage = `Failed to create post: ${response.status}`;

      if (contentType && contentType.includes("application/json")) {
        try {
          const errorData = await response.json();
          console.error("Strapi API Error:", errorData);
          errorMessage = `Failed to create post: ${JSON.stringify(errorData)}`;
        } catch (jsonError) {
          console.error("Error parsing JSON error response:", jsonError);
        }
      } else {
        // JSON이 아닌 경우 텍스트로 처리
        try {
          const errorText = await response.text();
          console.error("Strapi API Error (text):", errorText);
          errorMessage = `Failed to create post: ${errorText}`;
        } catch (textError) {
          console.error("Error reading error response text:", textError);
        }
      }

      return NextResponse.json({ error: errorMessage }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      {
        error: "Failed to create post",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

// GET 요청 핸들러
export async function GET() {
  try {
    // Strapi API URL
    const STRAPI_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337/api";

    // 공개적으로 접근 가능한 데이터이므로 인증 토큰 필요 없음
    const response = await fetch(`${STRAPI_API_URL}/posts?populate=*`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      return NextResponse.json({ error: `Failed to fetch posts: ${response.status}` }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}
