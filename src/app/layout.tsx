import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { TanstackProvider } from "@/lib/tanstack-query";
import { AuthProvider } from "@/lib/auth";
import { ThemeProvider } from "@/components/providers/theme-provider";
import Header from "@/components/Header";
import InfoCopyRight from "@/components/blog/InfoCopyRight";

const inter = Inter({ subsets: ["latin"] });

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
      </head>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <TanstackProvider>
            <AuthProvider>
              <Suspense fallback={<div className="h-14 border-b bg-background/95"></div>}>
                <Header />
              </Suspense>
              <main className="min-h-screen">{children}</main>
              <InfoCopyRight />
            </AuthProvider>
          </TanstackProvider>
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
