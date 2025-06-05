import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Suspense } from "react";
import "./globals.css";
import { TanstackProvider } from "@/lib/tanstack-query";
import { AuthProvider } from "@/lib/auth";
import { ThemeProvider } from "@/components/providers/theme-provider";
import Header from "@/components/Header";
import InfoCopyRight from "@/components/blog/InfoCopyRight";

export const metadata: Metadata = {
  title: "My Kim",
  description: "내 블로그에 오신 것을 환영합니다!",
  other: {
    "application/rss+xml": "/rss.xml"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link rel="alternate" type="application/rss+xml" title="MYKim Blog RSS Feed" href="/rss.xml" />
        <link
          rel="stylesheet"
          as="style"
          crossOrigin=""
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <TanstackProvider>
            <AuthProvider>
              <Suspense fallback={<div className="h-14 border-b bg-background/95"></div>}>
                <Header />
              </Suspense>
              <main className="min-h-screen flex flex-col">
                <div className="flex-1">{children}</div>
                <InfoCopyRight />
              </main>
            </AuthProvider>
          </TanstackProvider>
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
