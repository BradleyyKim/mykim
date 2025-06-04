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
  link?: string;
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
        name: "지능형 카메라 스마트 대시보드 & 모니터링 시스템",
        period: "2025.01 - 2025.05",
        overview: "화성시 교통안전센터에 설치되는 스마트 대시보드 및 모니터링 웹 소프트웨어 개발",
        achievements: [
          "사용자의 몰입도를 높이는 Framer-motion기반 동적 UI 구현으로 사용자 만족도 개선",
          "컨텍스트 기반 필터링으로 최소한의 전역 상태를 활용해 로딩 최소화",
          "선택적 쿼리 활성화 및 캐싱으로 네트워크 효율성 극대화",
          "LocalStorage와 서버 API 이중 저장으로 사용자 편의 극대화",
          "Husky를 활용해 빌드 에러 방지 기능 추가"
        ],
        references: ["https://www.youtube.com/watch?v=J5T5rq83yUo"],
        techStack: [
          "React",
          "TypeScript",
          "Tanstack-query",
          "Jotai",
          "socket.io-client",
          "framer-motion",
          "Matine UI",
          "CSS Modules",
          "dnd-kit",
          "echarts",
          "husky",
          "Vite",
          "i18next"
        ]
      },
      {
        id: 2,
        name: "노후차량 운행제한 관리 및 모니터링 시스템",
        period: "2024.01 - 2024.06",
        overview: "노후차량 데이터를 관리하고 관리 감독을 위한 웹 모니터링 시스템 개발",
        achievements: [
          "좌표계 변환 알고리즘(2D Affine Transformation)을 통한 동적 마커 위치 계산 및 배치",
          "자동화된 모니터링 시스템 구현(마커 위치 순환, 카메라 이미지 순환)",
          "Apache Echarts를 활용한 데이터 시각화 구현"
        ],
        references: ["https://youtu.be/y530yT1ESoE"],
        techStack: ["React", "TypeScript", "Bootstrap", "echarts", "recoil", "Scss"]
      },
      {
        id: 3,
        name: "지능형 교통 카메라 임베디드 소프트웨어 개발",
        period: "2024.01 - 2024.06",
        overview: "지능형 교통 카메라를 관리하고 기능 설정을 할 수 있는 관리 웹 소프트웨어 개발",
        achievements: [
          "서버 메타데이터 기반의 동적 인터페이스 구현(Server Driven UI)",
          "HOC를 활용한 컴포넌트 재사용성 향상",
          "Canvas 기반 지능형 검지 영역 편집 시스템 수정 및 유지 보수",
          "Janus gateway + WebRTC를 활용한 멀티채널 영상 스트리밍 구현"
        ],
        references: ["https://www.youtube.com/watch?v=RuzbzvoUqwM"],
        techStack: ["React", "TypeScript", "Bootstrap", "Scss", "recoil", "zod", "echarts", "swiper"]
      }
    ]
  },
  {
    name: "개인 프로젝트",
    // link: "",
    period: "2025.03 - 현재",
    position: "Full Stack Developer",
    projects: [
      {
        id: 4,
        name: "MY Kim Blog",
        period: "2025.03 - 현재",
        overview: "Next.js 15 + React(Front-end), Strapi Cloud(Back-end) 기반 블로그 플랫폼 개발",
        achievements: [
          "Next.js 15 기반 블로그 플랫폼 개발",
          "SEO 최적화로 검색 노출 증대",
          "PWA 적용으로 모바일 앱 수준의 UX 제공",
          "i18next를 활용한 다국어 지원 구현"
        ],
        references: ["https://mykim.in"],
        techStack: ["Next.js", "TypeScript", "Tailwind CSS", "i18next", "Shadcn UI", "Vercel", "Strapi Cloud"]
      }
    ]
  }
];

export default function CareerPage() {
  return <CareerPageClient careerData={careerData} />;
}
