import { NextRequest, NextResponse } from "next/server";

const STRAPI_API_URL = process.env.STRAPI_API_URL || "http://localhost:1337/api";
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

const headers = {
  "Content-Type": "application/json",
  ...(STRAPI_TOKEN && { Authorization: `Bearer ${STRAPI_TOKEN}` })
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("filters[name][$eq]");

    let url = `${STRAPI_API_URL}/tags`;

    if (name) {
      url += `?filters[name][$eq]=${encodeURIComponent(name)}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers
    });

    if (!response.ok) {
      console.error(`Strapi API error: ${response.status}`);
      return NextResponse.json({ error: "Failed to fetch tags" }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching tags:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
