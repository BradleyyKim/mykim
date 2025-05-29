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
      category?: string | number | { id: number | string };
      featuredImage?: { url: string; alternativeText?: string };
    }

    // 요청 바디 구성
    const requestBody = {
      data: {
        title: body.title,
        content: body.content,
        slug: createSlug(body.title),
        description: body.description || body.content.substring(0, 200),
        featuredImage: body.featuredImage,
        publishedDate: body.publishedDate
      } as PostData
    };

    // 카테고리가 있으면 추가
    if (body.category) {
      // Strapi v4에서는 관계 필드를 ID로 설정
      // 카테고리 ID가 숫자로 들어오면 그대로 사용, 문자열이면 숫자로 변환 시도
      if (typeof body.category === "string" && /^\d+$/.test(body.category)) {
        // 카테고리가 숫자 형태의 문자열인 경우
        requestBody.data.category = parseInt(body.category);
      } else if (typeof body.category === "number") {
        // 카테고리가 숫자인 경우
        requestBody.data.category = body.category;
      } else if (typeof body.category === "object" && body.category !== null && "id" in body.category) {
        // 카테고리가 객체인 경우
        requestBody.data.category = body.category.id;
      } else {
        // 기타 카테고리 값(문자열 등)은 그대로 전달
        requestBody.data.category = body.category;
      }

      console.log("카테고리 값:", requestBody.data.category);
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
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const searchParams = new URLSearchParams(url.search);
    const category = searchParams.get("category");

    const STRAPI_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337/api";
    const POPULATE = "populate=*";

    // 카테고리 필터링이 있는 경우 쿼리 추가
    let queryString = `${POPULATE}`;
    if (category) {
      queryString += `&filters[category][slug][$eq]=${category}`;
    }

    const res = await fetch(`${STRAPI_URL}/posts?${queryString}`, {
      headers: {
        "Content-Type": "application/json"
      },
      next: { revalidate: 60 } // 60초마다 재검증
    });

    if (!res.ok) {
      return Response.json({ error: "Failed to fetch posts" }, { status: res.status });
    }

    const data = await res.json();
    return Response.json(data.data);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// 슬러그 생성 유틸리티 함수
function createSlug(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // 공백을 대시로 바꾸기
    .replace(/[^\w가-힣-]+/g, "") // 영문자, 숫자, 대시, 밑줄, 한글만 남기기
    .replace(/--+/g, "-") // 연속된 대시 제거
    .replace(/^-+|-+$/g, ""); // 시작과 끝의 대시 제거
}
