import React from "react";
import { Metadata } from "next";
import UnderConstruction from "@/components/ui/UnderConstruction";

export const metadata: Metadata = {
  title: "About - MYKim",
  description: "소개 페이지 - 현재 개발 중입니다."
};

function AboutPage() {
  return <UnderConstruction title="🚧 About 페이지 공사중 🚧" message="더 멋진 페이지를 준비하고 있어요! 조금만 기다려주세요 😊" />;
}

export default AboutPage;
