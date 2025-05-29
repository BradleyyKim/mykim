import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Strapi API URL
    const STRAPI_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:1337";
    const STRAPI_API_URL = `${STRAPI_BASE_URL}/api`;

    // JWT 토큰 쿠키 읽기
    const authToken = request.cookies.get("adminToken");

    // 헤더 구성
    const headers: Record<string, string> = {
      "Content-Type": "application/json"
    };

    // JWT 토큰이 있으면 Authorization 헤더에 추가
    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken.value}`;
    }

    // 요청 바디 구성 - 기본 필드만
    const requestBody = {
      data: {
        title: body.title,
        content: body.content,
        slug: body.title.toLowerCase().replace(/\s+/g, "-")
      }
    };

    // API 요청
    const response = await fetch(`${STRAPI_API_URL}/posts`, {
      method: "POST",
      headers,
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: "Failed to create post", details: errorData }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}

// GET 요청 핸들러
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const searchParams = new URLSearchParams(url.search);
    const category = searchParams.get("category");

    // Strapi API URL
    const STRAPI_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:1337";
    const STRAPI_URL = `${STRAPI_BASE_URL}/api`;

    let queryString = "populate=*";
    if (category) {
      queryString += `&filters[category][slug][$eq]=${category}`;
    }

    const res = await fetch(`${STRAPI_URL}/posts?${queryString}`, {
      headers: {
        "Content-Type": "application/json"
      },
      next: { revalidate: 60 }
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
