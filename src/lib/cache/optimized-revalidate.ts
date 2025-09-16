/**
 * ISR Writes 최적화된 재검증 시스템
 * 불필요한 재검증을 줄이고 효율성을 높임
 */

// 재검증 시크릿 키
const REVALIDATE_SECRET = process.env.NEXT_PUBLIC_REVALIDATE_SECRET || "default_secret_key_change_this";

// 재검증 요청을 배치로 처리하기 위한 큐
let revalidateQueue: string[] = [];
let isProcessing = false;

/**
 * 배치 재검증 처리
 * 여러 재검증 요청을 하나로 묶어서 처리
 */
async function processRevalidateQueue() {
  if (isProcessing || revalidateQueue.length === 0) return;

  isProcessing = true;

  try {
    // 중복 제거
    const uniqueTags = [...new Set(revalidateQueue)];
    revalidateQueue = [];

    console.log(`[Batch Revalidate] 처리할 태그들: ${uniqueTags.join(", ")}`);

    // 배치로 재검증 실행
    const promises = uniqueTags.map(tag =>
      fetch(`/api/revalidate?tag=${tag}&secret=${REVALIDATE_SECRET}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      }).catch(error => {
        console.error(`[Batch Revalidate] 태그 ${tag} 재검증 실패:`, error);
        return null;
      })
    );

    await Promise.allSettled(promises);
    console.log(`[Batch Revalidate] ${uniqueTags.length}개 태그 재검증 완료`);
  } catch (error) {
    console.error("[Batch Revalidate] 배치 재검증 실패:", error);
  } finally {
    isProcessing = false;

    // 큐에 새로운 요청이 있으면 다시 처리
    if (revalidateQueue.length > 0) {
      setTimeout(processRevalidateQueue, 100);
    }
  }
}

/**
 * 지연된 재검증 (배치 처리)
 * @param tag 재검증할 태그
 * @param delay 지연 시간 (ms)
 */
export function revalidateTagDelayed(tag: string, delay: number = 1000) {
  console.log(`[Delayed Revalidate] 태그 ${tag}를 ${delay}ms 후 재검증 예약`);

  setTimeout(() => {
    revalidateQueue.push(tag);
    processRevalidateQueue();
  }, delay);
}

/**
 * 즉시 재검증 (중요한 경우에만 사용)
 * @param tag 재검증할 태그
 */
export async function revalidateTagImmediate(tag: string): Promise<boolean> {
  try {
    console.log(`[Immediate Revalidate] 태그 ${tag} 즉시 재검증`);

    const response = await fetch(`/api/revalidate?tag=${tag}&secret=${REVALIDATE_SECRET}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    });

    if (!response.ok) {
      console.error(`[Immediate Revalidate] 재검증 실패: ${response.status}`);
      return false;
    }

    const result = await response.json();
    console.log(`[Immediate Revalidate] 재검증 성공:`, result);
    return result.revalidated;
  } catch (error) {
    console.error("[Immediate Revalidate] 재검증 오류:", error);
    return false;
  }
}

/**
 * 스마트 재검증 (조건부)
 * @param tag 재검증할 태그
 * @param condition 재검증 조건
 */
export function revalidateTagSmart(tag: string, condition: boolean = true) {
  if (!condition) {
    console.log(`[Smart Revalidate] 조건 불만족으로 태그 ${tag} 재검증 스킵`);
    return;
  }

  // 중요도에 따라 즉시 또는 지연 재검증
  const isImportant = ["posts", "categories"].includes(tag);

  if (isImportant) {
    revalidateTagImmediate(tag);
  } else {
    revalidateTagDelayed(tag, 2000); // 2초 지연
  }
}

/**
 * 게시물 관련 최적화된 재검증
 */
export function revalidatePostsOptimized() {
  // 게시물 목록만 즉시 재검증
  revalidateTagImmediate("posts");

  // 카테고리는 지연 재검증
  revalidateTagDelayed("categories", 3000);
}

/**
 * 특정 게시물 최적화된 재검증
 */
export function revalidatePostOptimized(slug: string) {
  // 해당 게시물만 즉시 재검증
  revalidateTagImmediate(`post-${slug}`);

  // 게시물 목록은 지연 재검증
  revalidateTagDelayed("posts", 2000);
}
