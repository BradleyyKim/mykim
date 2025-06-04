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
        name: "지능형 카메라 스마트 대시보드 & 모니터링 시스템",
        period: "2025.01 - 2025.05",
        overview: "화성시 교통안전센터에 설치되는 스마트 대시보드 및 모니터링 웹 소프트웨어 개발",
        achievements: [
          "사용자의 몰입도를 높이는 interactive, dynamic UI/UX 구현 (Framer-motion기반 위젯 시스템)",
          "복잡한 상태 흐름을 최소한의 전역 상태를 활용해 효율적으로 구조화 및 계층화",
          "실시간 데이터를 통해 UI 업데이트 및 데이터 시각화를 적용한 모니터링 페이지 구현",
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
          "카메라 설치 지점의 위도, 경도를 분석해 이미지 내 마커 생성 기능 제작",
          "노후차량 운행제한 시스템 구현"
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
          "고객사에서 커스터마이징 가능하도록 formatting JSON을 통해 Server Driven UI 구현",
          "canvas를 이용한 검지 영역 설정 기능 구현",
          "Janus gateway + WebRTC를 활용한 멀티채널 영상 스트리밍 구현"
        ],
        references: ["https://www.youtube.com/watch?v=RuzbzvoUqwM"],
        techStack: ["React", "TypeScript", "Bootstrap", "Scss", "recoil", "zod", "echarts", "swiper"]
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
        achievements: [
          "장바구니 및 결제 시스템 구현",
          "SEO 최적화로 검색 노출 증대",
          "PWA 적용으로 모바일 앱 수준의 UX 제공"
        ],
        references: ["https://project-c.example.com"],
        techStack: ["Vue.js", "Nuxt.js", "Vuex", "SCSS"]
      }
    ]
  }
];

export default function CareerPage() {
  return <CareerPageClient careerData={careerData} />;
}
