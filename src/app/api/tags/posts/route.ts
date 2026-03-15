import { NextRequest, NextResponse } from "next/server";
import { getPostsByTag } from "@/lib/mdx";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const tagName = searchParams.get("name") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);

  const result = getPostsByTag(tagName, page);
  return NextResponse.json(result);
}
