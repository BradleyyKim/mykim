/**
 * 프론트엔드에서 사용하는 API 클라이언트 유틸리티
 */
// revalidate 함수들은 서버 사이드에서만 사용 가능하므로 제거
// 대신 API 엔드포인트를 통해 호출

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
    try {
      console.log("[apiClient] 인증 상태 확인 중");
      const response = await fetch("/api/auth", {
        credentials: "include" // 쿠키 포함
      });

      if (!response.ok) {
        console.log("[apiClient] 인증되지 않음");
        return { isLoggedIn: false };
      }

      const result = await response.json();
      console.log("[apiClient] 인증 상태:", result);
      return result;
    } catch (error) {
      console.error("[apiClient] 인증 상태 확인 오류:", error);
      return { isLoggedIn: false };
    }
  },

  /**
   * 관리자 로그인
   */
  async login(credentials: { identifier: string; password: string }) {
    console.log("[apiClient] 로그인 시도");
    const response = await fetch("/api/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(credentials)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("[apiClient] 로그인 실패:", errorData);
      throw new Error(errorData.error || "로그인에 실패했습니다");
    }

    const result = await response.json();
    console.log("[apiClient] 로그인 성공");
    return result;
  },

  /**
   * 로그아웃
   */
  async logout() {
    console.log("[apiClient] 로그아웃 시도");
    const response = await fetch("/api/auth", {
      method: "DELETE",
      credentials: "include" // 쿠키 포함
    });

    if (!response.ok) {
      console.error("[apiClient] 로그아웃 실패");
      throw new Error("로그아웃에 실패했습니다");
    }

    console.log("[apiClient] 로그아웃 성공");
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
    slug?: string;
    featuredImage?: {
      url: string;
      alternativeText?: string;
    } | null;
    publishedDate?: string;
    tags?: string[];
  }) {
    console.log("[apiClient] 새 포스트 생성 시도");

    // 빈 문자열인 필드들을 제거
    const cleanData = { ...data };
    if (cleanData.publishedDate === "") {
      delete cleanData.publishedDate;
    }
    if (cleanData.description === "") {
      delete cleanData.description;
    }

    const response = await fetch(
      "/api/posts",
      createFetchOptions("POST", cleanData, true) // 인증 필요
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("[apiClient] 포스트 생성 실패:", errorData);
      throw new Error(errorData.error || "API 요청 실패");
    }

    const result = await response.json();
    console.log("[apiClient] 포스트 생성 성공, ID:", result.id);

    // 포스트 생성 성공 후 재검증 실행 (API 엔드포인트를 통해)
    console.log("[apiClient] 재검증 시작");

    try {
      // ISR 캐시 무효화를 위한 API 호출
      const revalidatePromises = [
        // 전체 포스트 목록 재검증
        fetch(`/api/revalidate?tag=posts`, { method: "POST" })
      ];

      // 특정 포스트 재검증 (slug가 있는 경우)
      if (result?.data?.slug) {
        revalidatePromises.push(fetch(`/api/revalidate?tag=post-${result.data.slug}`, { method: "POST" }));
      }

      // 모든 재검증 요청을 병렬로 실행
      await Promise.allSettled(revalidatePromises);

      console.log("[apiClient] 재검증 완료");
    } catch (error) {
      console.error("[apiClient] 재검증 실패:", error);
      // 재검증 실패해도 포스트 생성은 성공했으므로 계속 진행
    }

    return result;
  },

  /**
   * 포스트 목록 가져오기 (인증 불필요)
   */
  async getPosts() {
    console.log("[apiClient] 포스트 목록 요청");
    const response = await fetch(
      "/api/posts",
      createFetchOptions("GET", null, false) // 인증 불필요
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("[apiClient] 포스트 목록 요청 실패:", errorData);
      throw new Error(errorData.error || "포스트 목록을 가져오는데 실패했습니다");
    }

    const result = await response.json();
    console.log(`[apiClient] 포스트 목록 가져옴: ${result.posts?.length || 0}개`);
    return result;
  },

  /**
   * 포스트 수정 (인증 필요)
   */
  async updatePost(
    id: number,
    data: { title?: string; content?: string; description?: string; category?: number; tags?: string[] }
  ) {
    console.log(`[apiClient] 포스트 수정 시도: ID=${id}`);
    const response = await fetch(
      `/api/posts/${id}`,
      createFetchOptions("PUT", data, true) // 인증 필요
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("[apiClient] 포스트 수정 실패:", errorData);
      throw new Error(errorData.error || "포스트 수정에 실패했습니다");
    }

    const result = await response.json();
    console.log(`[apiClient] 포스트 수정 성공: ID=${id}`);

    // 수정 후 재검증 실행 (API 엔드포인트를 통해)
    try {
      const revalidatePromises = [
        fetch(`/api/revalidate?tag=posts`, { method: "POST" }),
        fetch(`/api/revalidate?tag=post-${id}`, { method: "POST" })
      ];

      await Promise.allSettled(revalidatePromises);
      console.log("[apiClient] 포스트 수정 후 재검증 완료");
    } catch (error) {
      console.error("[apiClient] 수정 후 재검증 실패:", error);
    }

    return result;
  },

  /**
   * 포스트 삭제 (인증 필요)
   */
  async deletePost(id: number) {
    console.log(`[apiClient] 포스트 삭제 시도: ID=${id}`);
    const response = await fetch(
      `/api/posts/${id}`,
      createFetchOptions("DELETE", null, true) // 인증 필요
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("[apiClient] 포스트 삭제 실패:", errorData);
      throw new Error(errorData.error || "포스트 삭제에 실패했습니다");
    }

    const result = await response.json();
    console.log(`[apiClient] 포스트 삭제 성공: ID=${id}`);

    // 삭제 후 재검증 실행 (API 엔드포인트를 통해)
    try {
      await fetch(`/api/revalidate?tag=posts`, { method: "POST" });
      console.log("[apiClient] 포스트 삭제 후 재검증 완료");
    } catch (error) {
      console.error("[apiClient] 삭제 후 재검증 실패:", error);
    }

    return result;
  },

  /**
   * 포스트 수정 (slug 기반)
   */
  async updatePostBySlug(
    slug: string,
    data: {
      title?: string;
      content?: string;
      description?: string;
      category?: number | string;
      slug?: string;
      featuredImage?: { url: string; alternativeText?: string } | null;
      publishedDate?: string;
      tags?: string[];
    }
  ) {
    console.log(`[apiClient] 포스트 수정 시도: slug=${slug}`);
    const response = await fetch(
      `/api/posts/${slug}`,
      createFetchOptions("PUT", data, true) // 인증 필요
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("[apiClient] 포스트 수정 실패:", errorData);
      throw new Error(errorData.error || "포스트 수정에 실패했습니다");
    }

    const result = await response.json();
    console.log(`[apiClient] 포스트 수정 성공: slug=${slug}`);

    // 수정 후 재검증 실행 (API 엔드포인트를 통해)
    try {
      // ISR 캐시 무효화를 위한 API 호출
      const revalidatePromises = [
        // 특정 포스트 캐시 태그 재검증
        fetch(`/api/revalidate?tag=post-${slug}`, { method: "POST" })
      ];

      // 새 slug가 다른 경우 기존 slug도 재검증
      if (data.slug && data.slug !== slug) {
        revalidatePromises.push(fetch(`/api/revalidate?tag=post-${data.slug}`, { method: "POST" }));
      }

      // 전체 포스트 목록 재검증
      revalidatePromises.push(fetch(`/api/revalidate?tag=posts`, { method: "POST" }));

      // 모든 재검증 요청을 병렬로 실행
      await Promise.allSettled(revalidatePromises);

      console.log("[apiClient] 포스트 수정 후 재검증 완료");
    } catch (error) {
      console.error("[apiClient] 수정 후 재검증 실패:", error);
    }

    return result;
  },

  /**
   * 포스트 삭제 (slug 기반)
   */
  async deletePostBySlug(slug: string) {
    console.log(`[apiClient] 포스트 삭제 시도: slug=${slug}`);
    const response = await fetch(
      `/api/posts/${slug}`,
      createFetchOptions("DELETE", undefined, true) // 인증 필요
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("[apiClient] 포스트 삭제 실패:", errorData);
      throw new Error(errorData.error || "포스트 삭제에 실패했습니다");
    }

    const result = await response.json();
    console.log(`[apiClient] 포스트 삭제 성공: slug=${slug}`);

    // 삭제 후 재검증 실행 (API 엔드포인트를 통해)
    try {
      const revalidatePromises = [
        fetch(`/api/revalidate?tag=posts`, { method: "POST" }),
        fetch(`/api/revalidate?tag=post-${slug}`, { method: "POST" })
      ];

      await Promise.allSettled(revalidatePromises);
      console.log("[apiClient] 포스트 삭제 후 재검증 완료");
    } catch (error) {
      console.error("[apiClient] 삭제 후 재검증 실패:", error);
    }

    return result;
  }
};
