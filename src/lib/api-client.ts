/**
 * 프론트엔드에서 사용하는 API 클라이언트 유틸리티
 */

// API 요청 옵션 생성
const createFetchOptions = (method: string, body?: Record<string, unknown> | null, isAuthRequired: boolean = false) => {
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json"
    },
    // 인증이 필요한 경우 credentials 포함 (쿠키 전송)
    credentials: isAuthRequired ? "include" : "same-origin"
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  return options;
};

// API 요청 함수들
export const apiClient = {
  /**
   * 로그인 상태 확인
   */
  async checkAuthStatus() {
    const response = await fetch("/api/auth", {
      credentials: "include" // 쿠키 포함
    });

    if (!response.ok) {
      return { isLoggedIn: false };
    }

    return response.json();
  },

  /**
   * 관리자 로그인
   */
  async login(credentials: { identifier: string; password: string }) {
    const response = await fetch("/api/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(credentials)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "로그인에 실패했습니다");
    }

    return response.json();
  },

  /**
   * 로그아웃
   */
  async logout() {
    const response = await fetch("/api/auth", {
      method: "DELETE",
      credentials: "include" // 쿠키 포함
    });

    if (!response.ok) {
      throw new Error("로그아웃에 실패했습니다");
    }

    return { success: true };
  },

  /**
   * 새 포스트 생성 (인증 필요)
   */
  async createPost(data: {
    title: string;
    content: string;
    description?: string;
    category?: string;
    featuredImage?: {
      url: string;
      alternativeText?: string;
    } | null;
  }) {
    const response = await fetch(
      "/api/posts",
      createFetchOptions("POST", data, true) // 인증 필요
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "API 요청 실패");
    }

    // API 응답 받은 후 메인 페이지 데이터 재검증 시도
    try {
      await fetch("/api/revalidate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ path: "/" })
      });
    } catch (error) {
      console.error("Failed to revalidate:", error);
    }

    return response.json();
  },

  /**
   * 포스트 목록 가져오기 (인증 불필요)
   */
  async getPosts() {
    const response = await fetch(
      "/api/posts",
      createFetchOptions("GET", null, false) // 인증 불필요
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "포스트 목록을 가져오는데 실패했습니다");
    }

    return response.json();
  },

  /**
   * 포스트 수정 (인증 필요)
   */
  async updatePost(id: number, data: { title?: string; content?: string; description?: string; category?: number; tags?: string[] }) {
    const response = await fetch(
      `/api/posts/${id}`,
      createFetchOptions("PUT", data, true) // 인증 필요
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "포스트 수정에 실패했습니다");
    }

    return response.json();
  },

  /**
   * 포스트 삭제 (인증 필요)
   */
  async deletePost(id: number) {
    const response = await fetch(
      `/api/posts/${id}`,
      createFetchOptions("DELETE", null, true) // 인증 필요
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "포스트 삭제에 실패했습니다");
    }

    return response.json();
  }
};
