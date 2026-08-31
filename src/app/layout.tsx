import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Suspense } from "react";
import { cookies } from "next/headers";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Header } from "@/components/layout";
import { InfoCopyRight } from "@/components/layout";
import { Toaster } from "@/components/ui/sonner";
import { getGAMeasurementId, isGAEnabled } from "@/lib/analytics";
import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider";
import { VercelAnalyticsProvider } from "@/components/providers/analytics-provider";
import { MAIN } from "@/lib/constants";

export const metadata: Metadata = {
  metadataBase: new URL(MAIN.url),
  title: {
    default: MAIN.title,
    template: `%s | ${MAIN.title}`,
  },
  description: MAIN.description,
  keywords: MAIN.keywords,
  authors: [{ name: MAIN.author }],
  creator: MAIN.author,
  publisher: MAIN.author,
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: MAIN.url,
    title: MAIN.title,
    description: MAIN.description,
    siteName: MAIN.title,
    images: [
      {
        url: MAIN.image,
        width: 1200,
        height: 630,
        alt: MAIN.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: MAIN.title,
    description: MAIN.description,
    images: [MAIN.image],
    creator: MAIN.twitter,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  other: {
    "application/rss+xml": "/rss.xml",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value || "ko";

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link
          rel="alternate"
          type="application/rss+xml"
          title="MYKim Blog RSS Feed"
          href="/rss.xml"
        />
        <link rel="alternate" hrefLang="ko" href={MAIN.url} />
        <link rel="alternate" hrefLang="en" href={`${MAIN.url}/en`} />
        <link rel="alternate" hrefLang="x-default" href={MAIN.url} />
        <link
          rel="stylesheet"
          as="style"
          crossOrigin=""
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AnalyticsProvider>
            <VercelAnalyticsProvider>
              <Suspense
                fallback={
                  <div className="h-14 border-b bg-background/95"></div>
                }
              >
                <Header />
              </Suspense>
              <main className="min-h-screen flex flex-col">
                <div className="flex-1">{children}</div>
                <InfoCopyRight />
              </main>
            </VercelAnalyticsProvider>
          </AnalyticsProvider>
        </ThemeProvider>
        <Toaster position="top-center" richColors />
        {isGAEnabled() && getGAMeasurementId() && (
          <GoogleAnalytics gaId={getGAMeasurementId()!} />
        )}
      </body>
    </html>
  );
}
