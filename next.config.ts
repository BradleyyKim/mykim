import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // tsconfig.build.json을 사용하도록 설정
    tsconfigPath: "tsconfig.build.json",
    // 타입 체크를 무시하고 빌드 진행
    ignoreBuildErrors: true
  }
};

export default nextConfig;
