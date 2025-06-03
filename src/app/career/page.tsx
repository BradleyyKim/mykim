import CareerPageClient from "@/components/CareerPageClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Career - MYKim",
  description: "경력 및 프로젝트 경험"
};

// 경력 데이터 타입 정의
export type Project = {
  id: number;
  name: string;
  period: string;
  overview: string;
  achievements: string[];
  references?: string[];
  techStack?: string[];
};

export type Company = {
  name: string;
  link: string;
  period: string;
  position: string;
  projects: Project[];
};

// 더미 데이터 (나중에 API나 CMS로 교체 가능)
const careerData: Company[] = [
  {
    name: "Rexgen",
    link: "https://www.rexgen.co.kr/",
    period: "2022.12 - 현재",
    position: "Frontend Developer",
    projects: [
      {
        id: 1,
        name: "화성 스마트 대시보드 & 모니터링",
        period: "2025.01 - 2025.05",
        overview: "React와 TypeScript를 사용한 대규모 웹 애플리케이션 개발",
        achievements: ["사용자 경험 개선으로 페이지 로딩 속도 40% 향상", "컴포넌트 재사용성 향상으로 개발 효율성 30% 증대", "반응형 디자인 적용으로 모바일 사용자 만족도 향상"],
        references: ["https://project-a.example.com", "GitHub Repository"],
        techStack: ["React", "TypeScript", "Next.js", "Tailwind CSS"]
      },
      {
        id: 2,
        name: "프로젝트 B",
        period: "2024.01 - 현재",
        overview: "마이크로서비스 아키텍처 기반 관리자 대시보드 구축",
        achievements: ["실시간 데이터 처리 시스템 구현", "사용자 권한 관리 시스템 개발", "데이터 시각화 대시보드 구현"],
        references: ["https://project-b.example.com"],
        techStack: ["React", "TypeScript", "D3.js", "Socket.io"]
      }
    ]
  },
  {
    name: "회사명 B",
    link: "https://www.rexgen.co.kr/",
    period: "2021.06 - 2023.02",
    position: "Frontend Developer",
    projects: [
      {
        id: 3,
        name: "프로젝트 C",
        period: "2021.06 - 2022.05",
        overview: "Vue.js 기반 전자상거래 플랫폼 개발",
        achievements: ["장바구니 및 결제 시스템 구현", "SEO 최적화로 검색 노출 증대", "PWA 적용으로 모바일 앱 수준의 UX 제공"],
        references: ["https://project-c.example.com"],
        techStack: ["Vue.js", "Nuxt.js", "Vuex", "SCSS"]
      }
    ]
  }
];

export default function CareerPage() {
  return <CareerPageClient careerData={careerData} />;
}
