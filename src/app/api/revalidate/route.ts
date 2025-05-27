import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

// 보안을 위한 시크릿 키 검증 (환경 변수에서 시크릿 가져옴)
// 실제 환경변수는 .env.local 파일에 설정해야 합니다: REVALIDATE_SECRET=your_secret_key
const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET || "default_secret_key_change_this";

export async function POST(request: Request) {
  try {
    // 요청에서 시크릿 키 확인
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get("secret");

    // 시크릿 키가 없거나 일치하지 않으면 401 에러
    if (!secret || secret !== REVALIDATE_SECRET) {
      return NextResponse.json(
        {
          revalidated: false,
          message: "유효하지 않은 재검증 요청입니다."
        },
        { status: 401 }
      );
    }

    // 태그 파라미터 확인 (어떤 태그를 재검증할지)
    const tag = searchParams.get("tag") || "posts";

    // 태그 기반 캐시 재검증
    revalidateTag(tag);

    return NextResponse.json({
      revalidated: true,
      message: `${tag} 태그가 성공적으로 재검증되었습니다.`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    // 에러 발생시 500 응답
    return NextResponse.json(
      {
        revalidated: false,
        message: "재검증 과정에서 오류가 발생했습니다.",
        error: (error as Error).message
      },
      { status: 500 }
    );
  }
}
