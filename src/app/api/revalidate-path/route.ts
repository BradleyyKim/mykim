import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

// 보안을 위한 시크릿 키 설정
const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET || "default_secret_key_change_this";

/**
 * 특정 경로의 페이지를 재검증하는 API 엔드포인트
 */
export async function POST(request: Request) {
  console.log("[revalidate-path API] 요청 시작");

  try {
    // URL에서 path와 secret 파라미터 추출
    const { searchParams } = new URL(request.url);
    const path = searchParams.get("path") || "/";
    const secret = searchParams.get("secret");

    console.log(`[revalidate-path API] 재검증 경로: ${path}`);

    // 시크릿 키 검증
    if (!secret || secret !== REVALIDATE_SECRET) {
      console.error("[revalidate-path API] 시크릿 키 불일치");
      return NextResponse.json(
        {
          revalidated: false,
          message: "유효하지 않은 재검증 요청입니다."
        },
        { status: 401 }
      );
    }

    // Next.js의 revalidatePath 함수 호출
    console.log(`[revalidate-path API] 경로 '${path}' 재검증 시작`);
    revalidatePath(path);
    console.log(`[revalidate-path API] 경로 '${path}' 재검증 완료`);

    return NextResponse.json({
      revalidated: true,
      message: `경로 ${path}가 성공적으로 재검증되었습니다.`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("[revalidate-path API] 오류 발생:", error);

    return NextResponse.json(
      {
        revalidated: false,
        message: "재검증 과정에서 오류가 발생했습니다.",
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
