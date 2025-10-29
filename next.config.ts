import type { NextConfig } from "next";

// 빌드 시 버전 정보 생성
const buildDate = "2025-10-29";
const buildTime = "06:22:01";

const nextConfig: NextConfig = {
  // 환경 변수 설정
  env: {
    NEXT_PUBLIC_APP_VERSION: process.env.npm_package_version || "0.1.0",
    NEXT_PUBLIC_BUILD_DATE: buildDate,
    NEXT_PUBLIC_BUILD_TIME: buildTime
  },
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
  }
};

export default nextConfig;
