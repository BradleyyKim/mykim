import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  try {
    const { path } = await request.json();

    if (!path || typeof path !== "string") {
      return NextResponse.json({ error: "Path is required and must be a string" }, { status: 400 });
    }

    // 지정된 경로의 캐시 무효화
    revalidatePath(path);

    return NextResponse.json({
      revalidated: true,
      message: `Path ${path} revalidated successfully`
    });
  } catch (error) {
    console.error("Error during revalidation:", error);
    return NextResponse.json(
      {
        revalidated: false,
        message: "Failed to revalidate",
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
