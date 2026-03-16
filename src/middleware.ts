import { NextRequest, NextResponse } from "next/server";

const locales = ["ko", "en"];
const defaultLocale = "ko";

function getLocaleFromHeaders(request: NextRequest): string {
  const acceptLang = request.headers.get("accept-language");
  if (!acceptLang) return defaultLocale;
  const preferred = acceptLang.split(",").map(l => l.split(";")[0].trim().split("-")[0]);
  return preferred.find(l => locales.includes(l)) || defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static files, API, _next, etc.
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images") ||
    pathname.includes(".") ||
    pathname.startsWith("/rss.xml")
  ) {
    return NextResponse.next();
  }

  // /en/* paths - set English locale cookie
  if (pathname.startsWith("/en")) {
    const response = NextResponse.next();
    response.cookies.set("locale", "en", { path: "/", maxAge: 60 * 60 * 24 * 365 });
    return response;
  }

  // All other paths - Korean default
  const response = NextResponse.next();
  const currentLocale = request.cookies.get("locale")?.value;
  if (!currentLocale) {
    const detectedLocale = getLocaleFromHeaders(request);
    response.cookies.set("locale", detectedLocale, { path: "/", maxAge: 60 * 60 * 24 * 365 });
    // Redirect English-speaking first-time visitors to /en
    if (detectedLocale === "en" && pathname === "/") {
      return NextResponse.redirect(new URL("/en", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
