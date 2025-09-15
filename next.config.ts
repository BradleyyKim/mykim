import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // tsconfig.build.json을 사용하도록 설정
    tsconfigPath: "tsconfig.build.json",
    // 타입 체크를 무시하고 빌드 진행
    ignoreBuildErrors: true
  },
  images: {
    // 이미지 최적화 설정
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30 // 30일 캐시
  },
  // Vercel Puppeteer 최적화: 서버 번들에서 제외
  serverExternalPackages: ["@sparticuz/chromium", "puppeteer-core"]
};

export default nextConfig;
