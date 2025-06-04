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
        overview:
          "교통 체증 분석과 AI 선별 예측으로 교통 지체를 줄이기 위한 스마트 대시보드 및 모니터링 웹 소프트웨어 개발 (현재 화성시 교통안전센터에서 실사용중)",
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
          "Mantine UI",
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
        period: "2024.04 - 2024.09",
        overview:
          "노후차량 데이터를 관리하고 관리 감독을 위한 웹 모니터링 시스템 개발 (부산시청 교통과에 설치되어 사용중)",
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
        overview:
          "지능형 교통 카메라를 관리하고 기능 설정을 할 수 있는 관리 웹 소프트웨어 개발 (수원시 교통 카메라에 설치되어 사용중)",
        achievements: [
          "서버 메타데이터 기반의 동적 인터페이스 구현(Server Driven UI)",
          "HOC를 활용한 컴포넌트 재사용성 향상",
          "Canvas 기반 지능형 검지 영역 편집 시스템 수정 및 유지 보수",
          "Janus gateway + WebRTC를 활용한 멀티채널 영상 스트리밍 구현"
        ],
        references: ["https://www.youtube.com/watch?v=RuzbzvoUqwM"],
        techStack: ["React", "TypeScript", "Bootstrap", "Scss", "recoil", "zod", "echarts", "swiper"]
      },
      {
        id: 4,
        name: "Rex Smart Portal for Global - 실시간 교통 모니터링 및 단속 관리 시스템",
        period: "2023.03 - 2023.10",
        overview:
          "해외 수출용 지능형 교통 관제 시스템으로 실시간 CCTV 모니터링, 교통 위반 단속, 고지서 발급 및 납부, 통계 분석 기능 등을 제공하는 웹 플랫폼 개발 (현재 타지키스탄 정부에서 실사용중이며, 태국, 베트남과 계약 체결중)",
        achievements: [
          "Socket.IO 기반 실시간 교통 위반 이벤트 처리로 즉시 알림 및 대응 체계 구축",
          "Google Maps API와 Restful API를 활용해 실제 설치된 지능형 카메라 위치 관리 및 데이터 시각화",
          "커스터마이징 마커 클러스터링 지도 고도화 및 실시간 차량 경로 추적 구현",
          "HLS 프로토콜 기반 라이브 CCTV 스트리밍으로 원격 실시간 모니터링 시스템 구축",
          "4개국 다국어 지원(한/영/러/태)으로 글로벌 시장 진출 기반 마련",
          "Recoil + Redux 하이브리드 상태 관리로 복잡한 실시간 데이터 플로우 최적화",
          "ApexCharts/ECharts 기반 대시보드로 교통 통계 데이터 시각화 및 의사결정 지원",
          "Vite 빌드 시스템과 다중 환경 배포로 개발/스테이징/운영 환경 자동화",
          "Material-UI 기반 반응형 Enterprise UI로 관제센터 운영자 UX 최적화"
        ],
        references: [], // 실제 프로젝트 URL이나 데모 링크가 있다면 추가
        techStack: [
          "React",
          "TypeScript",
          "Vite",
          "Material-UI (MUI)",
          "Recoil",
          "Redux Toolkit",
          "Socket.IO",
          "Google Maps API",
          "Video.js",
          "ApexCharts",
          "ECharts",
          "Styled-Components",
          "Emotion",
          "i18next"
        ]
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
        id: 5,
        name: "MY Kim Blog - 개인 블로그 플랫폼",
        period: "2025.01 - 현재",
        overview:
          "Next.js 15 + React 19 기반의 현대적인 블로그 플랫폼. Strapi Cloud를 백엔드로 활용한 Headless CMS 아키텍처 구현",
        achievements: [
          "Next.js 15 App Router + React 19 최신 기술을 활용한 SSR/ISR 하이브리드 렌더링 구현",
          "TipTap(ProseMirror 기반) 리치텍스트 에디터로 마크다운 + WYSIWYG 하이브리드 편집 시스템 구현",
          "Tanstack React Query를 활용한 서버 상태 관리 및 캐싱 최적화로 로딩 속도 개선",
          "WebP 이미지 자동 변환 및 Next.js Image 최적화로 페이지 로딩 속도 향상",
          "shadcn/ui + Tailwind CSS 4.0으로 다크모드 지원 및 반응형 디자인 구현",
          "Vercel 자동 배포 파이프라인 구축 및 ISR을 통한 SEO 최적화 달성",
          "React Hook Form + Zod를 활용한 타입 안전 폼 검증 시스템 구축",
          "Strapi Cloud API 연동으로 컨텐츠 관리 자동화 및 RESTful API 구현",
          "시간대별 동적 배경 및 일일 아바타 로테이션 등 사용자 경험 개선 기능 구현",
          "ESLint + Prettier + Husky 기반 코드 품질 관리 자동화 시스템 구축"
        ],
        references: ["https://mykim.in", "https://github.com/BradleyyKim"],
        techStack: [
          "Next.js 15",
          "React 19",
          "TypeScript 5",
          "Tailwind CSS 4",
          "Tanstack React Query",
          "TipTap",
          "React Hook Form",
          "Zod",
          "shadcn/ui",
          "Strapi Cloud",
          "Vercel",
          "WebP Optimization",
          "next-themes",
          "Lucide React",
          "Husky"
        ]
      }
    ]
  }
];

export default function CareerPage() {
  return <CareerPageClient careerData={careerData} />;
}
