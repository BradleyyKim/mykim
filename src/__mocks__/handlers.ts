import { http, HttpResponse } from "msw";

// 모킹할 API 엔드포인트들
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:1337";

export const handlers = [
  // 카테고리 조회 API 모킹
  http.get(`${API_BASE_URL}/api/categories`, () => {
    return HttpResponse.json({
      data: [
        {
          id: 1,
          attributes: {
            name: "기술",
            slug: "tech",
            description: "기술 관련 글"
          }
        },
        {
          id: 2,
          attributes: {
            name: "일상",
            slug: "daily",
            description: "일상 관련 글"
          }
        }
      ]
    });
  }),

  // 포스트 생성 API 모킹
  http.post(`${API_BASE_URL}/api/posts`, async ({ request }) => {
    const body = (await request.json()) as {
      title: string;
      content: string;
      description?: string;
      category?: string;
      slug?: string;
    };

    return HttpResponse.json(
      {
        data: {
          id: Math.floor(Math.random() * 1000),
          attributes: {
            ...body,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        }
      },
      { status: 201 }
    );
  }),

  // 포스트 목록 조회 API 모킹
  http.get(`${API_BASE_URL}/api/posts`, () => {
    return HttpResponse.json({
      data: [
        {
          id: 1,
          attributes: {
            title: "테스트 포스트",
            content: "테스트 내용",
            slug: "test-post",
            createdAt: "2024-01-01T00:00:00.000Z",
            category: {
              data: {
                id: 1,
                attributes: { name: "기술", slug: "tech" }
              }
            }
          }
        }
      ]
    });
  }),

  // 로그인 API 모킹
  http.post(`${API_BASE_URL}/api/auth/local`, async ({ request }) => {
    const body = (await request.json()) as { identifier: string; password: string };

    // 간단한 로그인 검증
    if (body.identifier === "admin@test.com" && body.password === "password") {
      return HttpResponse.json({
        jwt: "mock-jwt-token",
        user: {
          id: 1,
          username: "admin",
          email: "admin@test.com"
        }
      });
    }

    return HttpResponse.json({ error: { message: "Invalid credentials" } }, { status: 400 });
  })
];
