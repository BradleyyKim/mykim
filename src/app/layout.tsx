import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TanstackProvider } from "@/lib/tanstack-query";
import { AuthProvider } from "@/lib/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My Blog",
  description: "내 블로그에 오신 것을 환영합니다!"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <TanstackProvider>
          <AuthProvider>{children}</AuthProvider>
        </TanstackProvider>
      </body>
    </html>
  );
}
