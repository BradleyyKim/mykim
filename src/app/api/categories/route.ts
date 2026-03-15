import { NextResponse } from "next/server";
import { getCategories } from "@/lib/mdx";

export async function GET() {
  const categories = getCategories();
  return NextResponse.json({ data: categories });
}
