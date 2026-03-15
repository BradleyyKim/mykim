import { NextRequest, NextResponse } from "next/server";
import { getAllTags, getTagByName } from "@/lib/mdx";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const nameFilter = searchParams.get("name");

  if (nameFilter) {
    const tag = getTagByName(nameFilter);
    return NextResponse.json({ data: tag ? [tag] : [] });
  }

  const tags = getAllTags();
  return NextResponse.json({ data: tags });
}
