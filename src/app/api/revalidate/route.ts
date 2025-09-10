import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

/**
 * ISR 캐시 무효화 API
 * 특정 태그에 대한 캐시를 무효화하여 최신 데이터를 가져오도록 함
 */
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tag = searchParams.get("tag");

    if (!tag) {
      return NextResponse.json({ error: "tag parameter is required" }, { status: 400 });
    }
    // Next.js ISR 캐시 무효화
    revalidateTag(tag);

    return NextResponse.json({
      success: true,
      message: `Cache invalidated for tag: ${tag}`,
      tag
    });
  } catch (error) {
    console.error("[Revalidate API] 캐시 무효화 실패:", error);
    return NextResponse.json(
      {
        error: "Failed to revalidate cache",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
