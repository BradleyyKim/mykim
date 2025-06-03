import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Strapi API URL - Posts, Auth와 동일한 방식으로 처리
    const STRAPI_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:1337";
    const STRAPI_API_URL = `${STRAPI_BASE_URL}/api`;

    // 카테고리 데이터 요청
    const response = await fetch(`${STRAPI_API_URL}/categories?populate=*`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
      cache: "no-store"
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch categories: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}
