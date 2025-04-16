/**
 * 프론트엔드에서 사용하는 API 클라이언트 유틸리티
 */

// API 요청 함수들
export const apiClient = {
  /**
   * 새 포스트 생성
   */
  async createPost(data: { title: string; content: string; category?: string; tags?: string[] }) {
    const response = await fetch("/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "API 요청 실패");
    }

    return response.json();
  },

  /**
   * 포스트 목록 가져오기
   */
  async getPosts() {
    const response = await fetch("/api/posts", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "포스트 목록을 가져오는데 실패했습니다");
    }

    return response.json();
  }
};
