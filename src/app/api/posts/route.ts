import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Request body:", body);

    // Strapi API URL 및 토큰
    const STRAPI_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337/api";
    const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

    console.log("Using API URL:", STRAPI_API_URL);
    console.log("API Token exists:", !!STRAPI_API_TOKEN);

    // API 요청
    const response = await fetch(`${STRAPI_API_URL}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // API 토큰 추가
        Authorization: `Bearer ${STRAPI_API_TOKEN}`
      },
      body: JSON.stringify({
        data: {
          title: body.title,
          content: body.content,
          slug: body.title.toLowerCase().replace(/\s+/g, "-"),
          description: body.content.substring(0, 200) // 첫 200자를 설명으로 사용
        }
      })
    });
    console.log("API Token:", STRAPI_API_TOKEN?.substring(0, 5) + "...");
    console.log("Request Headers:", {
      "Content-Type": "application/json",
      Authorization: `Bearer ${STRAPI_API_TOKEN}`
    });

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

      return NextResponse.json({ error: errorMessage }, { status: 500 });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
