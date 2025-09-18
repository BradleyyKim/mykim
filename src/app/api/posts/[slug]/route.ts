import { NextRequest, NextResponse } from "next/server";
import type { PostUpdateRequest } from "@/lib/types/post";

// 포스트 수정 (PUT) - slug 기반
export async function PUT(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const body = await request.json();
    const { slug: postSlug } = await params;

    // 안전한 slug 처리: 인코딩되어 있다면 디코딩, 아니라면 그대로 사용
    const decodedSlug = postSlug.includes("%") ? decodeURIComponent(postSlug) : postSlug;
    console.log(`[PUT /api/posts/${decodedSlug}] 포스트 수정 요청`);

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
      // 없으면 서버 측 API 토큰 사용
      const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;
      if (STRAPI_API_TOKEN) {
        headers["Authorization"] = `Bearer ${STRAPI_API_TOKEN}`;
        console.log("Using server API token for authorization");
      } else {
        return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
      }
    }

    // 1. 먼저 slug로 포스트 찾기 (안전하게 인코딩하여 검색)
    const findUrl = `${STRAPI_API_URL}/posts?filters[slug][$eq]=${encodeURIComponent(decodedSlug)}&populate=*`;
    console.log(`[PUT] Strapi 검색 URL:`, findUrl);
    console.log(`[PUT] 검색할 slug:`, decodedSlug);
    console.log(`[PUT] 인코딩된 slug:`, encodeURIComponent(decodedSlug));

    const findResponse = await fetch(findUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: headers["Authorization"]
      }
    });

    console.log(`[PUT] 포스트 검색 응답 상태:`, findResponse.status);

    if (!findResponse.ok) {
      const errorText = await findResponse.text();
      console.error(`[PUT] 포스트 검색 실패:`, errorText);
      return NextResponse.json({ error: "포스트를 찾을 수 없습니다" }, { status: 404 });
    }

    const findData = await findResponse.json();
    console.log(`[PUT] 검색 결과:`, JSON.stringify(findData, null, 2));

    if (!findData.data || findData.data.length === 0) {
      console.error(`[PUT] slug "${decodedSlug}"로 포스트를 찾을 수 없습니다`);
      return NextResponse.json({ error: "포스트를 찾을 수 없습니다" }, { status: 404 });
    }

    const post = findData.data[0];
    const postId = post.id;
    const documentId = post.documentId; // Strapi v5에서 사용

    console.log(`[PUT] Found post ID: ${postId}, documentId: ${documentId} for slug: ${decodedSlug}`);

    // 2. 포스트 수정
    const requestBody = {
      data: {
        title: body.title,
        content: body.content,
        description: body.description,
        publishedDate: body.publishedDate,
        slug: body.slug || body.title.toLowerCase().replace(/\s+/g, "-")
      } as PostUpdateRequest
    };

    // 빈 문자열인 필드들을 제거
    if (requestBody.data.publishedDate === "") {
      delete requestBody.data.publishedDate;
    }
    if (requestBody.data.description === "") {
      delete requestBody.data.description;
    }

    // 카테고리가 있으면 추가
    if (body.category) {
      if (typeof body.category === "string" && /^\d+$/.test(body.category)) {
        requestBody.data.category = parseInt(body.category);
      } else if (typeof body.category === "number") {
        requestBody.data.category = body.category;
      } else if (typeof body.category === "object" && body.category !== null && "id" in body.category) {
        requestBody.data.category = body.category.id;
      } else {
        requestBody.data.category = body.category;
      }
      console.log("카테고리 값:", requestBody.data.category);
    }

    // featuredImage가 있으면 추가
    if (body.featuredImage) {
      requestBody.data.featuredImage = body.featuredImage;
    }

    // 태그가 있으면 처리
    if (body.tags && Array.isArray(body.tags) && body.tags.length > 0) {
      console.log("태그 처리 시작:", body.tags);

      // 태그들을 Strapi에 생성하거나 기존 태그와 연결
      const tagPromises = body.tags.map(async (tagName: string) => {
        try {
          // 기존 태그 검색
          const existingTagResponse = await fetch(
            `${STRAPI_API_URL}/tags?filters[name][$eq]=${encodeURIComponent(tagName)}`,
            {
              method: "GET",
              headers
            }
          );

          if (existingTagResponse.ok) {
            const existingTagData = await existingTagResponse.json();
            if (existingTagData.data && existingTagData.data.length > 0) {
              console.log(`기존 태그 발견: ${tagName} (ID: ${existingTagData.data[0].id})`);
              return existingTagData.data[0].id;
            }
          }

          // 새 태그 생성
          const newTagResponse = await fetch(`${STRAPI_API_URL}/tags`, {
            method: "POST",
            headers,
            body: JSON.stringify({
              data: {
                name: tagName
              }
            })
          });

          if (newTagResponse.ok) {
            const newTagData = await newTagResponse.json();
            console.log(`새 태그 생성: ${tagName} (ID: ${newTagData.data.id})`);
            return newTagData.data.id;
          } else {
            console.error(`태그 생성 실패: ${tagName}`, await newTagResponse.text());
            return null;
          }
        } catch (error) {
          console.error(`태그 처리 오류: ${tagName}`, error);
          return null;
        }
      });

      // 모든 태그 처리 완료 대기
      const tagIds = await Promise.all(tagPromises);
      const validTagIds = tagIds.filter(id => id !== null);

      if (validTagIds.length > 0) {
        requestBody.data.tags = validTagIds;
        console.log("연결할 태그 IDs:", validTagIds);
      } else {
        console.log("유효한 태그가 없습니다.");
        requestBody.data.tags = [];
      }
    } else {
      console.log("태그가 없거나 빈 배열입니다.");
      requestBody.data.tags = [];
    }

    console.log(`[PUT] Request Body:`, requestBody);

    // Strapi API로 수정 요청 (documentId 사용)
    const response = await fetch(`${STRAPI_API_URL}/posts/${documentId}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(requestBody)
    });

    console.log(`[PUT] Response status: ${response.status}`);
    console.log(`[PUT] 사용된 endpoint: ${STRAPI_API_URL}/posts/${documentId}`);

    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      let errorMessage = `Failed to update post: ${response.status}`;

      if (contentType && contentType.includes("application/json")) {
        try {
          const errorData = await response.json();
          console.error("Strapi API Error:", errorData);
          errorMessage = `Failed to update post: ${JSON.stringify(errorData)}`;
        } catch (jsonError) {
          console.error("Error parsing JSON error response:", jsonError);
        }
      } else {
        try {
          const errorText = await response.text();
          console.error("Strapi API Error (text):", errorText);
          errorMessage = `Failed to update post: ${errorText}`;
        } catch (textError) {
          console.error("Error reading error response text:", textError);
        }
      }

      return NextResponse.json({ error: errorMessage }, { status: response.status });
    }

    const data = await response.json();
    console.log(`[PUT] 포스트 수정 성공: slug=${decodedSlug}, ID=${postId}`);

    return NextResponse.json(data);
  } catch (error) {
    console.error(`[PUT] Error updating post:`, error);
    return NextResponse.json(
      {
        error: "Failed to update post",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

// 포스트 삭제 (DELETE) - slug 기반
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug: postSlug } = await params;

    // 안전한 slug 처리: 인코딩되어 있다면 디코딩, 아니라면 그대로 사용
    const decodedSlug = postSlug.includes("%") ? decodeURIComponent(postSlug) : postSlug;
    console.log(`[DELETE /api/posts/${decodedSlug}] 포스트 삭제 요청`);

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
      // 없으면 서버 측 API 토큰 사용
      const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;
      if (STRAPI_API_TOKEN) {
        headers["Authorization"] = `Bearer ${STRAPI_API_TOKEN}`;
        console.log("Using server API token for authorization");
      } else {
        return NextResponse.json({ error: "인증이 필요합니다" }, { status: 401 });
      }
    }

    // 1. 먼저 slug로 포스트 찾기 (안전하게 인코딩하여 검색)
    const findUrl = `${STRAPI_API_URL}/posts?filters[slug][$eq]=${encodeURIComponent(decodedSlug)}&populate=*`;
    console.log(`[DELETE] Strapi 검색 URL:`, findUrl);

    const findResponse = await fetch(findUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: headers["Authorization"]
      }
    });

    if (!findResponse.ok) {
      return NextResponse.json({ error: "포스트를 찾을 수 없습니다" }, { status: 404 });
    }

    const findData = await findResponse.json();
    if (!findData.data || findData.data.length === 0) {
      return NextResponse.json({ error: "포스트를 찾을 수 없습니다" }, { status: 404 });
    }

    const post = findData.data[0];
    const postId = post.id;
    const documentId = post.documentId; // Strapi v5에서 사용

    console.log(`[DELETE] Found post ID: ${postId}, documentId: ${documentId} for slug: ${decodedSlug}`);

    // 2. 포스트 삭제 (documentId 사용)
    const response = await fetch(`${STRAPI_API_URL}/posts/${documentId}`, {
      method: "DELETE",
      headers
    });

    console.log(`[DELETE] Response status: ${response.status}`);
    console.log(`[DELETE] 사용된 endpoint: ${STRAPI_API_URL}/posts/${documentId}`);

    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      let errorMessage = `Failed to delete post: ${response.status}`;

      if (contentType && contentType.includes("application/json")) {
        try {
          const errorData = await response.json();
          console.error("Strapi API Error:", errorData);
          errorMessage = `Failed to delete post: ${JSON.stringify(errorData)}`;
        } catch (jsonError) {
          console.error("Error parsing JSON error response:", jsonError);
        }
      } else {
        try {
          const errorText = await response.text();
          console.error("Strapi API Error (text):", errorText);
          errorMessage = `Failed to delete post: ${errorText}`;
        } catch (textError) {
          console.error("Error reading error response text:", textError);
        }
      }

      return NextResponse.json({ error: errorMessage }, { status: response.status });
    }

    console.log(`[DELETE] 포스트 삭제 성공: slug=${decodedSlug}, ID=${postId}`);
    return NextResponse.json({ message: "포스트가 성공적으로 삭제되었습니다" });
  } catch (error) {
    console.error(`[DELETE] Error deleting post:`, error);
    return NextResponse.json(
      {
        error: "Failed to delete post",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

// 단일 포스트 조회 (GET) - slug 기반
export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug: postSlug } = await params;

    // 디버깅 정보 출력
    console.log(`[GET] 원본 params.slug:`, postSlug);
    console.log(`[GET] 인코딩 여부 확인:`, postSlug.includes("%"));
    console.log(`[GET] 디코딩된 형태:`, decodeURIComponent(postSlug));
    console.log(`[GET] request.url:`, request.url);

    console.log(`[GET /api/posts/${postSlug}] 포스트 조회 요청`);

    // Strapi API URL
    const STRAPI_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337/api";

    // 안전한 slug 처리: 인코딩되어 있다면 디코딩, 아니라면 그대로 사용
    const decodedSlug = postSlug.includes("%") ? decodeURIComponent(postSlug) : postSlug;
    console.log(`[GET] Strapi 검색용 slug:`, decodedSlug);

    // Strapi API로 조회 요청 (디코딩된 slug 사용)
    const strapiUrl = `${STRAPI_API_URL}/posts?filters[slug][$eq]=${encodeURIComponent(decodedSlug)}&populate=*`;
    console.log(`[GET] Strapi 요청 URL:`, strapiUrl);

    const response = await fetch(strapiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
      next: { revalidate: 60 } // 60초마다 재검증
    });

    console.log(`[GET] Response status: ${response.status}`);

    if (!response.ok) {
      return NextResponse.json({ error: `Failed to fetch post: ${response.status}` }, { status: response.status });
    }

    const data = await response.json();

    if (!data.data || data.data.length === 0) {
      return NextResponse.json({ error: "포스트를 찾을 수 없습니다" }, { status: 404 });
    }

    console.log(`[GET] 포스트 조회 성공: slug=${decodedSlug}`);

    return NextResponse.json({ data: data.data[0] });
  } catch (error) {
    console.error(`[GET] Error fetching post:`, error);
    return NextResponse.json(
      {
        error: "Failed to fetch post",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
