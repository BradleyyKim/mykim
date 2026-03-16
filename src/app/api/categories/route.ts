import { NextResponse } from "next/server";
import { getCategories } from "@/lib/mdx";
import type { Locale } from "@/i18n";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = (searchParams.get("locale") || "ko") as Locale;
  const categories = getCategories(locale);
  return NextResponse.json({ data: categories });
}
