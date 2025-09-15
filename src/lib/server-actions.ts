"use server";

import { revalidateTag, revalidatePath } from "next/cache";

/**
 * 서버 액션을 통한 ISR 최적화
 * 클라이언트에서 직접 호출하지 않고 서버 액션으로 처리
 */

/**
 * 태그 기반 캐시 재검증 (서버 액션)
 */
export async function revalidateTagAction(tag: string) {
  try {
    console.log(`[Server Action] 태그 ${tag} 재검증 시작`);
    revalidateTag(tag);
    console.log(`[Server Action] 태그 ${tag} 재검증 완료`);
    return { success: true, tag };
  } catch (error) {
    console.error(`[Server Action] 태그 ${tag} 재검증 실패:`, error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

/**
 * 경로 기반 캐시 재검증 (서버 액션)
 */
export async function revalidatePathAction(path: string) {
  try {
    console.log(`[Server Action] 경로 ${path} 재검증 시작`);
    revalidatePath(path);
    console.log(`[Server Action] 경로 ${path} 재검증 완료`);
    return { success: true, path };
  } catch (error) {
    console.error(`[Server Action] 경로 ${path} 재검증 실패:`, error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

/**
 * 배치 재검증 (서버 액션)
 */
export async function revalidateBatchAction(tags: string[]) {
  try {
    console.log(`[Server Action] 배치 재검증 시작: ${tags.join(", ")}`);

    const results = await Promise.allSettled(tags.map(tag => revalidateTagAction(tag)));

    const successful = results.filter(result => result.status === "fulfilled" && result.value.success).length;

    console.log(`[Server Action] 배치 재검증 완료: ${successful}/${tags.length} 성공`);

    return {
      success: true,
      total: tags.length,
      successful,
      results: results.map((result, index) => ({
        tag: tags[index],
        success: result.status === "fulfilled" && result.value.success
      }))
    };
  } catch (error) {
    console.error("[Server Action] 배치 재검증 실패:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}
