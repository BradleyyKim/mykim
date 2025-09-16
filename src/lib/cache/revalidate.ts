// 재검증 시크릿 키 (환경 변수에서 가져옴)
const REVALIDATE_SECRET = process.env.NEXT_PUBLIC_REVALIDATE_SECRET || "default_secret_key_change_this";

/**
 * 특정 태그의 캐시를 재검증합니다.
 * @param tag 재검증할 캐시 태그 (기본값: 'posts')
 * @returns 재검증 결과
 */
export async function revalidateCache(tag: string = "posts"): Promise<boolean> {
  try {
    // 디버깅을 위해 사용 중인 시크릿 키 로깅 (개발 중에만)
    console.log(`[revalidateCache] 시작: tag=${tag}`);

    // 시크릿 키가 유효한지 확인
    if (!REVALIDATE_SECRET || REVALIDATE_SECRET === "default_secret_key_change_this") {
      console.error("[revalidateCache] 환경 변수 NEXT_PUBLIC_REVALIDATE_SECRET가 설정되지 않았습니다.");
    }

    // API 라우트를 호출하여 재검증 트리거
    const url = `/api/revalidate?tag=${tag}&secret=${REVALIDATE_SECRET}`;
    console.log(`[revalidateCache] 요청 URL 형식: /api/revalidate?tag=${tag}&secret=***`);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ tag }) // 명시적으로 body에도 추가
    });

    console.log(`[revalidateCache] 응답 상태 코드: ${response.status}`);

    if (!response.ok) {
      // 오류 응답 상세 로깅
      try {
        const errorData = await response.json();
        console.error("[revalidateCache] 재검증 실패:", response.status, errorData);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        console.error("[revalidateCache] 재검증 실패 (JSON 파싱 오류):", response.status);
      }
      return false;
    }

    const result = await response.json();
    console.log("[revalidateCache] 재검증 성공:", result);
    return result.revalidated;
  } catch (error) {
    console.error("[revalidateCache] 재검증 요청 중 오류:", error);
    return false;
  }
}

/**
 * 게시물 관련 캐시를 재검증합니다.
 * 새 게시물 생성, 수정, 삭제 후 호출해야 합니다.
 */
export async function revalidatePosts(): Promise<boolean> {
  console.log("[revalidatePosts] 게시물 재검증 시작");
  return revalidateCache("posts");
}

/**
 * 특정 게시물의 캐시를 재검증합니다.
 * @param postId 게시물 ID
 */
export async function revalidatePost(postId: string | number): Promise<boolean> {
  console.log(`[revalidatePost] 단일 게시물 재검증 시작: postId=${postId}`);
  return revalidateCache(`post-${postId}`);
}

/**
 * 카테고리 관련 캐시를 재검증합니다.
 */
export async function revalidateCategories(): Promise<boolean> {
  console.log("[revalidateCategories] 카테고리 재검증 시작");
  return revalidateCache("categories");
}

/**
 * 특정 경로의 페이지를 재검증합니다.
 * @param path 재검증할 경로 (기본값: '/')
 */
export async function revalidatePath(path: string = "/"): Promise<boolean> {
  console.log(`[revalidatePath] 경로 재검증 시작: path=${path}`);
  try {
    const url = `/api/revalidate-path?path=${encodeURIComponent(path)}&secret=${REVALIDATE_SECRET}`;
    console.log(`[revalidatePath] 요청 URL 형식: /api/revalidate-path?path=${path}&secret=***`);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    });

    console.log(`[revalidatePath] 응답 상태 코드: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[revalidatePath] 재검증 실패: ${response.status}`, errorText);
      return false;
    }

    const result = await response.json();
    console.log(`[revalidatePath] 재검증 성공:`, result);
    return true;
  } catch (error) {
    console.error(`[revalidatePath] 재검증 오류:`, error);
    return false;
  }
}
