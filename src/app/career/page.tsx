import { CareerPageClient } from "@/components/layout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Career - MYKim",
  description: "경력 및 프로젝트 경험"
};

// 경력 데이터 타입 정의
export type Project = {
  name: string;
  period: string;
  overview: string;
  responsibilities: string[]; // 주요 업무 - 담당했던 구체적 업무 및 기술적 구현
  achievements: string[]; // 성과 - 비즈니스 임팩트, 개선 결과
  metrics?: string[]; // 성과 지표 - 구체적인 수치 데이터
  techStack?: string[];
  references?: string[];
};

export type Company = {
  name: string;
  link?: string;
  period: string;
  position: string;
  projects: Project[];
};

// 한국어 데이터
const careerData: Company[] = [
  {
    name: "렉스젠(주)",
    link: "https://www.rexgen.co.kr/",
    period: "2022.12 - 현재",
    position: "프론트엔드 개발",
    projects: [
      {
        name: "지능형 카메라 스마트 대시보드 & 모니터링 시스템",
        period: "2025.01 - 현재",
        overview:
          "교통 체증 분석과 AI 선별 예측으로 교통 지체를 줄이기 위한 스마트 대시보드 및 모니터링 웹 소프트웨어 개발",
        responsibilities: [
          "Socket.io 기반 실시간 교통 이벤트 데이터 수신 및 업데이트 시스템 구현",
          "Framer-motion 기반 Dynamic Widget UI 시스템 설계 및 구현",
          "React Query 선택적 쿼리 활성화 및 캐싱 전략 수립",
          "Jotai 기반 컨텍스트 필터링으로 최소한의 전역 상태 관리 구조 설계",
          "Echarts 커스터마이징을 통한 실시간 교통 데이터 시각화 대시보드 구현",
          "LocalStorage와 서버 API 이중 저장 시스템 구축",
          "Husky Git Hook을 활용한 빌드 자동화 및 에러 방지 체계 구축"
        ],
        achievements: [
          "직관적인 Widget UI로 사용자 몰입도 및 만족도 향상",
          "최소한의 전역 상태 관리로 애플리케이션 로딩 속도 개선",
          "선택적 쿼리 전략으로 네트워크 효율성 극대화 및 서버 부하 감소",
          "이중 저장 시스템으로 데이터 손실 방지 및 사용자 편의성 증대"
        ],
        metrics: ["화성시 교통안전센터에서 실시간 교통 모니터링 시스템으로 운영 중"],
        techStack: [
          "React",
          "TypeScript",
          "Tanstack/react-query",
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
        ],
        references: ["https://www.youtube.com/watch?v=J5T5rq83yUo"]
      },
      {
        name: "노후차량 운행제한 관리 및 모니터링 시스템",
        period: "2024.04 - 현재",
        overview: "노후차량 데이터를 관리하고 관리 감독을 위한 웹 모니터링 시스템 개발",
        responsibilities: [
          "CSS를 활용해 지도 이미지 내 오차 범위가 낮은 동적 마커 위치 계산 시스템 구현",
          "자동화된 모니터링 순환 시스템 개발 (마커 위치 자동 순환, 카메라 이미지 자동 순환)",
          "Apache Echarts 기반 노후차량 통계 및 단속 현황 데이터 시각화 구현",
          "Recoil 기반 전역 상태 관리 및 필터링 시스템 구축"
        ],
        achievements: [
          "자동화된 모니터링 시스템으로 관리자의 업무 효율성 증대",
          "직관적인 데이터 시각화로 의사결정 지원 강화"
        ],
        metrics: ["부산시청 교통과에서 노후차량 관리 시스템으로 운영 중"],
        techStack: ["React", "TypeScript", "Bootstrap", "echarts", "recoil", "Scss"],
        references: ["https://youtu.be/y530yT1ESoE"]
      },
      {
        name: "지능형 교통 카메라 임베디드 소프트웨어 개발",
        period: "2024.01 - 현재",
        overview: "지능형 교통 카메라를 관리하고 기능 설정을 할 수 있는 관리 웹 소프트웨어 개발",
        responsibilities: [
          "Janus Gateway + WebRTC를 활용한 멀티채널 실시간 CCTV 영상 스트리밍 시스템 구현",
          "Server Driven UI 패턴을 활용한 동적 인터페이스 시스템 설계 및 구현",
          "HOC 패턴 기반 재사용 가능한 공통 컴포넌트 라이브러리 구축",
          "Canvas API 기반 지능형 검지 영역 편집 시스템 수정 및 유지 보수",
          "Zod 스키마 기반 타입 안전 폼 검증 시스템 구축",
          "Recoil을 활용한 카메라 설정 상태 관리 시스템 구현"
        ],
        achievements: [
          "서버 중심 UI 패턴으로 클라이언트 재배포 없이 UI 업데이트 가능한 유연한 시스템 구축",
          "HOC 패턴 적용으로 코드 중복 제거 및 유지보수성 향상",
          "실시간 멀티채널 영상 스트리밍으로 원격 카메라 모니터링 효율성 증대"
        ],
        metrics: ["수원시 교통 카메라에 설치되어 운영 중"],
        techStack: [
          "React",
          "TypeScript",
          "WebRTC",
          "Janus Gateway",
          "Bootstrap",
          "Scss",
          "recoil",
          "zod",
          "echarts",
          "swiper"
        ],
        references: ["https://www.youtube.com/watch?v=RuzbzvoUqwM"]
      },
      {
        name: "Rex Smart Portal for Global - 실시간 교통 모니터링 및 단속 관리 시스템",
        period: "2023.03 - 현재",
        overview:
          "해외 수출용 지능형 CCTV 기반 교통 관제 시스템으로 실시간 영상 모니터링, 교통 위반 단속, 고지서 발급 및 납부, 통계 분석 기능 등을 제공하는 웹 플랫폼 개발",
        responsibilities: [
          "Socket.IO 기반 실시간 교통 위반 이벤트 수신 및 처리 시스템 구현",
          "HLS 프로토콜 기반 라이브 CCTV 멀티채널 영상 스트리밍 시스템 구축 (H.264 코덱 지원)",
          "Video.js를 활용한 실시간 영상 재생 및 제어 기능 구현",
          "Google Maps API를 활용한 CCTV 카메라 위치 관리 및 커스텀 마커 클러스터링 시스템 구현",
          "실시간 차량 경로 추적 및 지도 시각화 시스템 개발",
          "i18next를 활용한 4개국 다국어 지원 시스템 구축 (KO/EN/RU/TH)",
          "Recoil을 활용한 전역 상태 관리 시스템 구현",
          "ApexCharts/ECharts 기반 교통 통계 및 단속 현황 대시보드 구현",
          "Material UI 기반 UI 시스템 구축"
        ],
        achievements: [
          "실시간 이벤트 처리로 교통 위반 즉시 알림 및 신속한 대응 체계 구축",
          "직관적인 지도 기반 인터페이스로 관제센터 운영 효율성 향상",
          "4개국 다국어 지원으로 글로벌 시장 진출 기반 마련",
          "데이터 시각화 대시보드로 교통 정책 의사결정 지원 강화"
        ],
        metrics: [
          "타지키스탄 정부에서 실시간 교통 관제 시스템으로 운영 중",
          "태국 정부 현지 설치 완료",
          "베트남과 계약 체결 진행 중"
        ],
        techStack: [
          "React",
          "TypeScript",
          "Vite",
          "Material UI",
          "Recoil",
          "Redux Toolkit",
          "Socket.IO",
          "HLS",
          "H.264 Codec",
          "Video.js",
          "Google Maps API",
          "ApexCharts",
          "ECharts",
          "Styled-Components",
          "Emotion",
          "i18next"
        ],
        references: ["https://youtu.be/VdZq5tIw20g"]
      }
    ]
  },
  {
    name: "개인 프로젝트",
    // link: "",
    period: "2025.03 - 현재",
    position: "풀스택 개발",
    projects: [
      {
        name: "MY Kim Blog - 개인 블로그 플랫폼",
        period: "2025.01 - 현재",
        overview:
          "Next.js 15 + React 19 기반의 현대적인 블로그 플랫폼. Strapi Cloud를 백엔드로 활용한 Headless CMS 아키텍처 구현",
        responsibilities: [
          "Next.js 15 App Router + React 19를 활용한 SSR/ISR 하이브리드 렌더링 시스템 구현",
          "TipTap(ProseMirror 기반) 리치텍스트 에디터로 GUI 문서 편집 시스템(WYSIWYG) 구현",
          "Tanstack/react-query 기반 서버 상태 관리 및 캐싱 전략 수립",
          "WebP 이미지 자동 변환 및 Next.js Image 최적화 시스템 구현",
          "shadcn/ui + Tailwind CSS 4.0 기반 다크모드 지원 반응형 디자인 시스템 구축",
          "Vercel 자동 배포 파이프라인 구축 및 ISR 기반 SEO 최적화",
          "React Hook Form + Zod를 활용한 타입 안전 폼 검증 시스템 구축",
          "Strapi Cloud Headless CMS 연동 및 RESTful API 구현",
          "ESLint + Prettier + Husky 기반 코드 품질 관리 자동화 시스템 구축"
        ],
        achievements: [
          "하이브리드 편집 시스템으로 유연한 콘텐츠 작성 환경 제공",
          "캐싱 최적화 및 이미지 최적화로 페이지 로딩 속도 대폭 개선",
          "ISR 전략으로 SEO 최적화 및 검색 엔진 노출 향상",
          "Headless CMS 아키텍처로 콘텐츠 관리 효율성 증대"
        ],
        metrics: ["개인 블로그 플랫폼 https://mykim.in 운영 중", "GitHub 오픈소스 프로젝트로 공개"],
        techStack: [
          "Next.js 15",
          "React 19",
          "TypeScript 5",
          "Tailwind CSS 4",
          "Tanstack/react-query",
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
        ],
        references: ["https://mykim.in", "https://github.com/BradleyyKim"]
      }
    ]
  },
  {
    name: "개발 외 경험",
    period: "2019 - 2020",
    position: "파트 매니저",
    projects: [
      {
        name: "삼성전자 미국지사 모바일 생산 부문 협력사 인턴십",
        period: "2019 - 2020 (약 1년)",
        overview: "자재 및 물류 출입고 관리 담당. 매니저 역할 수행",
        responsibilities: [
          "생산 라인별 필요 자재 파악 및 적시 공급",
          "자재 부족 시 추가 발주 및 긴급 조달 처리",
          "재고 물리적 분류 및 정리 작업 수행",
          "입고 자재 실물 검사 및 Cross-tracing 검증",
          "MS Office 기반 주간 업무 완료 폼 및 우선순위 템플릿 제작",
          "다국적 팀원(남미, 아프리카, 동남아시아, 네팔 출신) 일정 관리 및 업무 배분",
          "지게차(리치) 운전을 통한 자재 이동 및 배치 작업",
          "SAP 시스템 도입 준비 및 자재 데이터 입력"
        ],
        achievements: [
          "체계적인 재고 정리로 생산 라인 자재 공급 안정성 확보",
          "자재 손실 및 생산 중단 최소화로 생산 효율성 향상",
          "인턴 최초로 삼성전자 본사 전체 생산 미팅 참석 및 2박 3일 출장 기회 획득",
          "8,000개 제품 재패키징 프로젝트 성공적 완수",
          "다국적 팀원들과의 협업 및 리더십 발휘로 팀 결속력 강화"
        ],
        metrics: [
          "래거시 재고 6만 개 → 0개로 정리",
          "재고 부족 이슈 99% 제거",
          "추가 발주 미스매치 99% 제거",
          "자재 관련 생산 플로우 블로킹 99% 제거"
        ],
        techStack: ["지게차(리치) 운전", "MS Office", "SAP System"],
        references: [
          "https://www.mykim.in/posts/internship-in-america",
          "https://www.mykim.in/posts/internship-in-america2"
        ]
      }
    ]
  }
];

// 영어 데이터
const careerDataEn: Company[] = [
  {
    name: "Rexgen",
    link: "https://www.rexgen.co.kr/",
    period: "Dec 2022 - Present",
    position: "Frontend Developer",
    projects: [
      {
        name: "Intelligent Camera Smart Dashboard & Monitoring System",
        period: "Jan 2025 - Present",
        overview:
          "Development of smart dashboard and monitoring web software for traffic congestion analysis and AI-based prediction to reduce traffic delays",
        responsibilities: [
          "Implemented real-time traffic event data reception and update system based on Socket.io",
          "Designed and implemented dynamic Widget UI system based on Framer-motion",
          "Established selective query activation and caching strategies using React Query",
          "Designed minimal global state management architecture with Jotai-based context filtering",
          "Implemented real-time traffic data visualization dashboard through Echarts customization",
          "Built dual storage system with LocalStorage and server API",
          "Established build automation and error prevention system using Husky Git Hooks"
        ],
        achievements: [
          "Enhanced user engagement and satisfaction through intuitive Widget UI",
          "Improved application loading speed with minimal global state management",
          "Maximized network efficiency and reduced server load through selective query strategy",
          "Prevented data loss and enhanced user convenience with dual storage system"
        ],
        metrics: ["Operational as real-time traffic monitoring system at Hwaseong City Traffic Safety Center"],
        techStack: [
          "React",
          "TypeScript",
          "Tanstack/react-query",
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
        ],
        references: ["https://www.youtube.com/watch?v=J5T5rq83yUo"]
      },
      {
        name: "Aged Vehicle Operation Restriction Management & Monitoring System",
        period: "Apr 2024 - Present",
        overview: "Development of web monitoring system for managing aged vehicle data and administrative oversight",
        responsibilities: [
          "Implemented dynamic marker position calculation system with low error rate on map images using CSS",
          "Developed automated monitoring circulation system (automatic marker position cycling, automatic camera image cycling)",
          "Implemented aged vehicle statistics and enforcement status data visualization based on Apache Echarts",
          "Built global state management and filtering system based on Recoil"
        ],
        achievements: [
          "Increased administrator operational efficiency through automated monitoring system",
          "Strengthened decision-making support through intuitive data visualization"
        ],
        metrics: ["Operational as aged vehicle management system at Busan City Hall Transportation Department"],
        techStack: ["React", "TypeScript", "Bootstrap", "echarts", "recoil", "Scss"],
        references: ["https://youtu.be/y530yT1ESoE"]
      },
      {
        name: "Intelligent Traffic Camera Embedded Software Development",
        period: "Jan 2024 - Present",
        overview:
          "Development of management web software for managing intelligent traffic cameras and setting functions",
        responsibilities: [
          "Implemented multi-channel real-time CCTV video streaming system using Janus Gateway + WebRTC",
          "Designed and implemented dynamic interface system utilizing Server Driven UI pattern",
          "Built reusable common component library based on HOC pattern",
          "Modified and maintained Canvas API-based intelligent detection area editing system",
          "Built type-safe form validation system based on Zod schema",
          "Implemented camera settings state management system using Recoil"
        ],
        achievements: [
          "Built flexible system enabling UI updates without client redeployment through server-centric UI pattern",
          "Improved code maintainability by eliminating code duplication through HOC pattern application",
          "Enhanced remote camera monitoring efficiency through real-time multi-channel video streaming"
        ],
        metrics: ["Operational on Suwon City traffic cameras"],
        techStack: [
          "React",
          "TypeScript",
          "WebRTC",
          "Janus Gateway",
          "Bootstrap",
          "Scss",
          "recoil",
          "zod",
          "echarts",
          "swiper"
        ],
        references: ["https://www.youtube.com/watch?v=RuzbzvoUqwM"]
      },
      {
        name: "Rex Smart Portal for Global - Real-time Traffic Monitoring & Enforcement System",
        period: "Mar 2023 - Present",
        overview:
          "Development of intelligent CCTV-based traffic control system for global export providing real-time video monitoring, traffic violation enforcement, fine issuance and payment, and statistical analysis features",
        responsibilities: [
          "Implemented real-time traffic violation event reception and processing system based on Socket.IO",
          "Built live CCTV multi-channel video streaming system based on HLS protocol (H.264 codec support)",
          "Implemented real-time video playback and control features using Video.js",
          "Implemented CCTV camera location management and custom marker clustering system using Google Maps API",
          "Developed real-time vehicle route tracking and map visualization system",
          "Built multi-language support system for 4 countries using i18next (KO/EN/RU/TH)",
          "Implemented global state management system using Recoil",
          "Implemented traffic statistics and enforcement status dashboard based on ApexCharts/ECharts",
          "Built UI system based on Material UI"
        ],
        achievements: [
          "Established immediate notification and rapid response system for traffic violations through real-time event processing",
          "Enhanced control center operational efficiency through intuitive map-based interface",
          "Established foundation for global market entry through multi-language support for 4 countries",
          "Strengthened traffic policy decision-making support through data visualization dashboard"
        ],
        metrics: [
          "Operational as real-time traffic control system for Tajikistan government",
          "Thailand government on-site installation completed",
          "Contract finalization in progress with Vietnam"
        ],
        techStack: [
          "React",
          "TypeScript",
          "Vite",
          "Material UI",
          "Recoil",
          "Redux Toolkit",
          "Socket.IO",
          "HLS",
          "H.264 Codec",
          "Video.js",
          "Google Maps API",
          "ApexCharts",
          "ECharts",
          "Styled-Components",
          "Emotion",
          "i18next"
        ],
        references: ["https://youtu.be/VdZq5tIw20g"]
      }
    ]
  },
  {
    name: "Personal Projects",
    period: "Jan 2025 - Present",
    position: "Full Stack Developer",
    projects: [
      {
        name: "MY Kim Blog - Personal Blog Platform",
        period: "Jan 2025 - Present",
        overview:
          "Modern blog platform based on Next.js 15 + React 19. Implemented Headless CMS architecture using Strapi Cloud as backend",
        responsibilities: [
          "Implemented SSR/ISR hybrid rendering system using Next.js 15 App Router + React 19",
          "Implemented GUI document editing system (WYSIWYG) using TipTap (ProseMirror-based) rich text editor",
          "Established server state management and caching strategies based on Tanstack/react-query",
          "Implemented automatic WebP image conversion and Next.js Image optimization system",
          "Built dark mode supporting responsive design system based on shadcn/ui + Tailwind CSS 4.0",
          "Built Vercel automatic deployment pipeline and ISR-based SEO optimization",
          "Built type-safe form validation system using React Hook Form + Zod",
          "Implemented Strapi Cloud Headless CMS integration and RESTful API",
          "Built automated code quality management system based on ESLint + Prettier + Husky"
        ],
        achievements: [
          "Provided flexible content creation environment through hybrid editing system",
          "Significantly improved page loading speed through caching and image optimization",
          "Enhanced SEO optimization and search engine visibility through ISR strategy",
          "Increased content management efficiency through Headless CMS architecture"
        ],
        metrics: ["Operating personal blog platform at https://mykim.in", "Published as open-source project on GitHub"],
        techStack: [
          "Next.js 15",
          "React 19",
          "TypeScript 5",
          "Tailwind CSS 4",
          "Tanstack/react-query",
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
        ],
        references: ["https://mykim.in", "https://github.com/BradleyyKim"]
      }
    ]
  },
  {
    name: "Non-Development Experience",
    period: "2019 - 2020",
    position: "Parts & Logistics Management",
    projects: [
      {
        name: "Samsung Electronics USA Mobile Production Partner Company - Material & Logistics Management",
        period: "2019 - 2020 (Approximately 1 year)",
        overview: "Managed material and logistics operations with Manager-level responsibilities",
        responsibilities: [
          "Identified required materials by production line and ensured timely supply",
          "Processed additional orders and emergency procurement when materials were insufficient",
          "Performed physical classification and organization of inventory items",
          "Conducted physical inspection of incoming materials and Cross-tracing verification",
          "Created MS Office-based weekly task completion forms and priority templates",
          "Managed schedules and distributed tasks for multinational team members (from South America, Africa, Southeast Asia, Nepal)",
          "Operated forklift (reach truck) for material movement and placement operations",
          "Prepared for SAP system implementation and entered material data"
        ],
        achievements: [
          "Secured production line material supply stability through systematic inventory organization",
          "Improved production efficiency by minimizing material loss and production interruptions",
          "First intern to attend Samsung Electronics headquarters global production meeting and earned 2-night 3-day business trip opportunity",
          "Successfully completed 8,000 product repackaging project",
          "Strengthened team cohesion through collaboration and leadership with multinational team members"
        ],
        metrics: [
          "Legacy inventory 60,000 items → 0 items organized",
          "Inventory shortage issues eliminated by 99%",
          "Additional order mismatches eliminated by 99%",
          "Material-related production flow blocking eliminated by 99%"
        ],
        techStack: ["Forklift (Reach Truck) Operation", "MS Office", "SAP System"],
        references: [
          "https://www.mykim.in/posts/internship-in-america",
          "https://www.mykim.in/posts/internship-in-america2"
        ]
      }
    ]
  }
];

export default function CareerPage() {
  return <CareerPageClient careerData={careerData} careerDataEn={careerDataEn} />;
}
