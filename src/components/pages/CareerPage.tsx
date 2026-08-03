import { Metadata } from "next";
import { CareerPageClient } from "@/components/layout";
import type { Locale } from "@/i18n";

// Career data type definitions
export type Project = {
  name: string;
  period: string;
  overview: string;
  responsibilities: string[];
  achievements: string[];
  metrics?: string[];
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

export function generateCareerMetadata(locale: Locale): Metadata {
  if (locale === "en") {
    return {
      title: "Career - MYKim",
      description: "Career and project experience"
    };
  }
  return {
    title: "Career - MYKim",
    description: "경력 및 프로젝트 경험"
  };
}

// Korean career data
const careerData: Company[] = [
  {
    name: "렉스젠(주)",
    link: "https://www.rexgen.co.kr/",
    period: "2022.12 - 현재",
    position: "프론트엔드 개발",
    projects: [
      {
        name: "REXGEN TOPA - 멀티로봇 통합관제(C2) 플랫폼",
        period: "2026.02 - 현재",
        overview:
          "지구본에서 시설, 구역, 개별 로봇까지 내려가는 계층 내비게이션 위에 멀티로봇 플릿 상태·3D 시설 트윈·라이브 영상을 통합 표출하고, 이벤트 감지 → 출동 요청 → 배차·이동·완료를 한 화면에서 지휘하는 관제 콘솔. 외부 4족로봇 운영사와의 연동을 전제로 설계했으며, 음성 LLM 에이전트를 운영자 보조 레이어로 얹음",
        responsibilities: [
          "로봇을 직접 조종하는 디지털 트윈에서 감지·지휘(C2) 중심 관제 콘솔로 아키텍처 피벗 주도 — 조종 대상이 아니라 감독 대상으로 로봇을 재정의",
          "FleetSource 어댑터 인터페이스 설계 — 자체 시뮬레이터/목업/외부 실연동을 드롭인 교체 가능하게 분리해, 협력사 API 확정 전에도 개발과 시연을 진행할 수 있는 구조 확보",
          "운영 상태 SSOT 설계 — 형식이 서로 다른 두 데이터 출처를 어댑터 경계에서 9개 정규 상태로 한 번만 변환하고, 마커 색·배지·요약 카운트가 모두 단일 정의에서 파생되도록 통일",
          "Mapbox GL 지구본과 Three.js/React Three Fiber 3D 시설 뷰를 잇는 계층 내비게이션 구현",
          "NestJS 백엔드에 로봇팔(6축 FK/IK)·AGV(웨이포인트 추종)·컨베이어·드론 시뮬레이터 구현 — 틱 루프 기반 상태 갱신과 WebSocket 텔레메트리 방출",
          "WebRTC(ffmpeg + werift)와 HTTP Range 기반 라이브 영상월 구현, 시청용 경로와 분석용(이벤트 JSON 수신) 경로를 아키텍처 상 분리",
          "Web Speech API(STT/TTS) + LLM 게이트웨이(SSE 스트리밍) 기반 음성 관제 에이전트 구현, API 키를 백엔드에 격리",
          "위험 명령 2단계 확인 등 관제 안전장치 설계 및 시나리오별 시연 대본 작성",
          "Jotai 기반 단방향 데이터 흐름(WS/목업 → 어댑터 → atom → 컴포넌트) 정착"
        ],
        achievements: [
          "외부 협력사 로봇이 오프라인인 상황에서도 목업 소스로 전체 시나리오를 끊김 없이 시연할 수 있는 구조를 만들어, 실연동 지연이 개발과 전시 준비를 막지 않도록 함",
          "상태 표현을 한 곳으로 모아 다운스트림의 raw 문자열 분기를 제거 — 신규 로봇 타입이나 상태를 추가할 때 변경 지점이 한 파일로 축소됨",
          "산업 시설 이상 감지·경계 감시 등 관제 시나리오 4종을 구현해 전시 시연 대본으로 확정",
          "프론트엔드 개발자에서 관제 도메인 설계자로 역할 확장 — 요구 명세·인터랙션 모델·외부 API 매핑 문서를 직접 작성해 협력사 협의 자료로 사용"
        ],
        metrics: [
          "해외 방산·보안 전시 출품 목표 과제로 진행 중",
          "테스트 133개 / 18개 스위트 (프론트엔드 77 · 백엔드 56)"
        ],
        techStack: [
          "React 19",
          "TypeScript",
          "Vite",
          "Three.js",
          "React Three Fiber",
          "Mapbox GL",
          "Jotai",
          "Mantine 8",
          "framer-motion",
          "NestJS 11",
          "WebSocket",
          "WebRTC (werift)",
          "ffmpeg",
          "Web Speech API",
          "LLM (Groq)",
          "Vitest",
          "Jest",
          "Playwright",
          "Docker Compose"
        ],
        references: ["https://youtu.be/Z2xFxJ1zjZs", "https://www.mykim.in/posts/from-teleoperation-to-supervision"]
      },
      {
        name: "공과장 - 공사현장 사진 자동분류 및 공정관리 플랫폼",
        period: "2026.07 - 현재",
        overview:
          "TF팀 합류 후 첫 풀스택 프로젝트. 협력사가 현장에서 올린 사진을 GPS로 자동 분류하고, 렉스젠 PM 검수를 거쳐 발주처 주무관이 진행 현황을 실시간 조회하는 공정관리 플랫폼. 기획 참여부터 DB 설계, 프론트엔드, 서버 배포, 버전 운영까지 단독으로 담당하며 프로토타입에서 실서버 운영 단계까지 진행",
        responsibilities: [
          "Next.js App Router 기반 풀스택 아키텍처 설계 (화면과 서버 액션/API Routes를 단일 애플리케이션으로 구성)",
          "협력사(모바일)·렉스젠 PM(PC)·발주처 주무관 3개 사용자군의 화면과 권한 체계 설계 — 현장 반장님 대상 화면은 앱 설치·회원가입 없이 문자 링크만으로 진입하도록 구성",
          "사진 원본을 이동하지 않고 DB 메타데이터로만 배치를 관리하는 가상 폴더 구조 설계",
          "사진·기록의 물리 삭제를 DB 제약으로 금지(교체·비활성만 허용)해 준공 증빙 유실을 스키마 레벨에서 차단",
          "exifr 기반 EXIF GPS 추출과 VWorld 지오코딩 연동으로 개소 자동 매칭 구현, 좌표 보정용 핀 드래그 지도 제공",
          "발주처 실양식(사진대지) 엑셀 자동 생성 — 지점별 시트, 필수 캡션 틀, 대표 사진 자동 배치",
          "비파괴 사진 보정(회전·수평 미세조정·확대) 구현 — 원본 파일은 그대로 두고 모든 화면과 엑셀 출력에 일괄 반영",
          "공정 프리셋 저장·병합 적용·대분류 사후 편집 등 공정 구성 재사용 체계 구현",
          "오픈소스 CLIP 분류 서버를 stateless 외부 서비스로 연동 — 신뢰도 기준 자동 추정/미지정 분기와 사람 검수 워크플로 설계",
          "Supabase 기반 프로토타입에서 온프레미스 PostgreSQL로 이전 (서버/클라이언트 스토리지 어댑터를 분리해둔 덕에 표시 레이어 변경 없이 전환)",
          "pm2 + nginx + SSL 기반 사내 서버 배포 파이프라인 구축, DB 마이그레이션이 포함된 배포 절차를 런북으로 문서화",
          "Web Push 알림, 웹 사용 매뉴얼, 버전별 업데이트 소식 등 운영 도구 구축"
        ],
        achievements: [
          "업로드 → 자동 배치 → 검수 → 주무관 조회 → 엑셀 보고까지 전체 흐름을 단독 구현해 사내 운영 서버 실배포 및 버전 단위 운영 단계 진입",
          "실제 현장 사진 77장으로 오픈소스 CLIP 자동분류 정확도(평균 신뢰도 0.85)를 검증해 외부 유료 AI 없이 자체 운영 가능함을 실데이터로 확인",
          "사진 원본은 그대로 두고 메타데이터만 바꾸는 구조 덕에 클라우드에서 온프레미스로의 이전을 구조 변경 없이 완료",
          "기능 간 의존 관계를 문서로 지도화해, 한 기능의 변경이 어떤 화면·데이터에 파급되는지 착수 전에 확인하는 규칙을 팀 규칙으로 정착",
          "DB 마이그레이션 순서 오류로 발생한 운영 장애를 계기로 배포 절차에 신호 규칙을 추가해 재발 방지 체계 마련",
          "프론트엔드 중심 경력에서 DB 스키마·인증·배포 인프라·장애 대응까지 전 영역을 단독 담당하는 풀스택 경험 확보"
        ],
        metrics: ["사내 운영 서버 실배포 후 버전 단위로 운영 중", "안양시 대상 파일럿 시연 완료 및 상급자 방향 승인"],
        techStack: [
          "Next.js",
          "React 19",
          "TypeScript",
          "Mantine UI",
          "PostgreSQL",
          "Supabase",
          "CLIP (오픈소스 VLM)",
          "exceljs",
          "exifr",
          "VWorld API",
          "Web Push",
          "Docker Compose",
          "pm2",
          "nginx"
        ],
        references: ["https://www.mykim.in/posts/first-fullstack-operation"]
      },
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
    period: "2025.03 - 현재",
    position: "풀스택 개발",
    projects: [
      {
        name: "MY Kim Blog - 개인 블로그 플랫폼",
        period: "2025.01 - 현재",
        overview:
          "Next.js 15 App Router + React 19 기반의 MDX 파일 기반 정적 블로그 플랫폼. 한국어/영어 i18n 지원, Cloudinary 이미지 호스팅, Vercel 배포",
        responsibilities: [
          "Next.js 15 App Router + React 19를 활용한 SSG/ISR 하이브리드 렌더링 시스템 구현",
          "MDX 파일 기반 콘텐츠 관리 시스템 설계 및 구현 (gray-matter + react-markdown)",
          "Route Group 기반 한국어/영어 i18n 아키텍처 설계 및 구현 (커스텀 경량 i18n)",
          "Accept-Language 감지 미들웨어 및 쿠키 기반 locale 유지 시스템 구축",
          "hreflang alternates, locale별 sitemap, OG locale 등 다국어 SEO 최적화",
          "Cloudinary 기반 이미지 호스팅 및 Next.js Image 최적화 시스템 구현",
          "shadcn/ui + Tailwind CSS 4.0 기반 다크모드 지원 반응형 디자인 시스템 구축",
          "JSON-LD 구조화 데이터, OpenGraph, Twitter Card 등 SEO 메타데이터 자동 생성",
          "Vercel 자동 배포 파이프라인 및 GitHub Actions 버전 관리 워크플로우 구축",
          "ESLint + Prettier + Husky 기반 코드 품질 관리 자동화 시스템 구축"
        ],
        achievements: [
          "Strapi Cloud CMS에서 로컬 MDX 파일 기반으로 전환하여 월 $15 운영비용 절감 및 데이터 자주성 확보",
          "한국어/영어 이중 언어 지원으로 글로벌 독자 접근성 확보",
          "SSG 기반 정적 생성으로 페이지 로딩 속도 및 SEO 성능 극대화",
          "Google 검색 노출 최적화로 구조화된 데이터 기반 검색 결과 표시"
        ],
        metrics: ["개인 블로그 플랫폼 https://mykim.in 운영 중", "GitHub 오픈소스 프로젝트로 공개"],
        techStack: [
          "Next.js 15",
          "React 19",
          "TypeScript 5",
          "Tailwind CSS 4",
          "MDX",
          "react-markdown",
          "gray-matter",
          "Cloudinary",
          "shadcn/ui",
          "Vercel",
          "next-themes",
          "Lucide React",
          "Husky",
          "GitHub Actions"
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

// English career data
const careerDataEn: Company[] = [
  {
    name: "Rexgen",
    link: "https://www.rexgen.co.kr/",
    period: "Dec 2022 - Present",
    position: "Frontend Developer",
    projects: [
      {
        name: "REXGEN TOPA - Multi-Robot Command & Control (C2) Platform",
        period: "Feb 2026 - Present",
        overview:
          "A command console that layers multi-robot fleet status, a 3D facility twin, and live video onto a hierarchical navigation flow — globe to facility to zone to individual robot — and directs the full loop from event detection to dispatch request, movement, and completion on a single screen. Designed around integration with an external quadruped-robot operator, with a voice LLM agent layered on as an operator assistance surface",
        responsibilities: [
          "Led the architectural pivot from a direct-teleoperation digital twin to a detection- and command-centric (C2) console — redefining robots as objects of supervision rather than objects of control",
          "Designed the FleetSource adapter interface, isolating the in-house simulator, mock data, and live external integration as drop-in replacements — enabling development and demos to proceed before the partner API was finalized",
          "Designed an operational-state SSOT that normalizes two differently-shaped data sources into nine canonical states exactly once at the adapter boundary, so marker colors, badges, and summary counts all derive from a single definition",
          "Built hierarchical navigation bridging a Mapbox GL globe and a Three.js / React Three Fiber 3D facility view",
          "Implemented robot arm (6-DOF FK/IK), AGV (waypoint following), conveyor, and drone simulators in the NestJS backend — tick-loop state updates with WebSocket telemetry emission",
          "Built a live video wall over WebRTC (ffmpeg + werift) and HTTP Range streaming, architecturally separating the viewing path from the analysis path (which receives event JSON only)",
          "Implemented a voice control agent using Web Speech API (STT/TTS) plus an LLM gateway with SSE streaming, isolating API keys on the backend",
          "Designed control-room safety measures including two-step confirmation for high-risk commands, and authored scenario demo scripts",
          "Established a unidirectional Jotai data flow (WS/mock → adapter → atom → component)"
        ],
        achievements: [
          "Built a structure where the entire scenario can be demonstrated without interruption via the mock source even when partner robots are offline, so integration delays never block development or exhibition preparation",
          "Consolidated state representation in one place and eliminated raw-string branching downstream — adding a new robot type or state now touches a single file",
          "Implemented four control scenarios covering industrial facility anomaly detection and perimeter surveillance, finalized as the exhibition demo script",
          "Expanded from frontend developer to control-domain designer — personally authoring the requirements specification, interaction model, and external API mapping documents used in partner negotiations"
        ],
        metrics: [
          "In progress as a submission target for an international defense and security exhibition",
          "133 tests across 18 suites (77 frontend · 56 backend)"
        ],
        techStack: [
          "React 19",
          "TypeScript",
          "Vite",
          "Three.js",
          "React Three Fiber",
          "Mapbox GL",
          "Jotai",
          "Mantine 8",
          "framer-motion",
          "NestJS 11",
          "WebSocket",
          "WebRTC (werift)",
          "ffmpeg",
          "Web Speech API",
          "LLM (Groq)",
          "Vitest",
          "Jest",
          "Playwright",
          "Docker Compose"
        ],
        references: ["https://youtu.be/Z2xFxJ1zjZs", "https://www.mykim.in/en/posts/from-teleoperation-to-supervision"]
      },
      {
        name: "Gongjang - Construction Site Photo Auto-Classification & Progress Management Platform",
        period: "Jul 2026 - Present",
        overview:
          "First full-stack project after joining a task force team. A progress management platform where photos uploaded from the field by partner companies are auto-classified by GPS, reviewed by Rexgen PMs, and viewed in real time by client-side government officials. Solo-owned from planning participation through DB design, frontend, server deployment, and versioned operations — taking it from prototype to a live production server",
        responsibilities: [
          "Designed full-stack architecture based on Next.js App Router (screens and server actions/API Routes unified in a single application)",
          "Designed the screens and permission model for three user groups — partner companies (mobile), Rexgen PMs (desktop), and client government officials — with the field-worker screen requiring no app install or signup, entered purely through an SMS link",
          "Designed a virtual-folder structure that manages photo placement through DB metadata alone, never moving the original files",
          "Blocked physical deletion of photos and records at the DB constraint level (allowing only replacement and deactivation), preventing loss of completion evidence at the schema layer",
          "Implemented automatic site matching by extracting EXIF GPS with exifr and integrating VWorld geocoding, with a drag-to-correct pin map for coordinate adjustment",
          "Built automatic Excel generation matching the client's actual reporting format — per-site sheets, required caption templates, and automatic placement of representative photos",
          "Implemented non-destructive photo correction (rotation, fine leveling, zoom) — originals untouched, with corrections applied uniformly across every screen and the Excel output",
          "Implemented reusable process composition: preset saving, merge-on-apply, and post-hoc category editing",
          "Integrated an open-source CLIP classification server as a stateless external service — designed confidence-based auto-suggest/unassigned branching and the human review workflow",
          "Migrated from a Supabase-based prototype to on-premise PostgreSQL (the pre-separated server/client storage adapter allowed the switch without touching the presentation layer)",
          "Built an in-house server deployment pipeline based on pm2 + nginx + SSL, and documented the deployment procedure for DB-migration-inclusive releases as a runbook",
          "Built operational tooling including Web Push notifications, a web user manual, and per-version release notes"
        ],
        achievements: [
          "Solo-implemented the entire flow (upload → auto-placement → review → government viewer → Excel report), reaching live deployment on an in-house production server with versioned operations",
          "Validated open-source CLIP auto-classification accuracy (0.85 average confidence) on 77 real site photos, confirming with real data that self-hosted AI could replace paid external APIs",
          "Completed the cloud-to-on-premise migration without structural changes, thanks to the design where originals stay put and only metadata changes",
          "Mapped inter-feature dependencies into a document, establishing a team rule of checking the blast radius of a change before starting work",
          "Turned a production incident caused by a DB migration ordering mistake into a signal-based rule added to the deployment procedure, preventing recurrence",
          "Gained full-stack experience owning DB schema, authentication, deployment infrastructure, and incident response end-to-end, beyond a frontend-centric career"
        ],
        metrics: [
          "Live on an in-house production server, operating on a versioned release cycle",
          "Completed pilot demo targeting Anyang City and secured direction approval from leadership"
        ],
        techStack: [
          "Next.js",
          "React 19",
          "TypeScript",
          "Mantine UI",
          "PostgreSQL",
          "Supabase",
          "CLIP (Open-source VLM)",
          "exceljs",
          "exifr",
          "VWorld API",
          "Web Push",
          "Docker Compose",
          "pm2",
          "nginx"
        ],
        references: ["https://www.mykim.in/en/posts/first-fullstack-operation"]
      },
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
          "MDX file-based static blog platform built with Next.js 15 App Router + React 19. Supports Korean/English i18n, Cloudinary image hosting, and Vercel deployment",
        responsibilities: [
          "Implemented SSG/ISR hybrid rendering system using Next.js 15 App Router + React 19",
          "Designed and implemented MDX file-based content management system (gray-matter + react-markdown)",
          "Designed and implemented Korean/English i18n architecture based on Route Groups (lightweight custom i18n)",
          "Built Accept-Language detection middleware and cookie-based locale persistence system",
          "Implemented multilingual SEO optimization with hreflang alternates, locale-specific sitemap, and OG locale",
          "Implemented Cloudinary-based image hosting and Next.js Image optimization system",
          "Built dark mode supporting responsive design system based on shadcn/ui + Tailwind CSS 4.0",
          "Automated SEO metadata generation with JSON-LD structured data, OpenGraph, and Twitter Cards",
          "Built Vercel automatic deployment pipeline and GitHub Actions version management workflow",
          "Built automated code quality management system based on ESLint + Prettier + Husky"
        ],
        achievements: [
          "Migrated from Strapi Cloud CMS to local MDX files, saving $15/month and securing data ownership",
          "Enabled global reader accessibility through Korean/English bilingual support",
          "Maximized page loading speed and SEO performance through SSG-based static generation",
          "Optimized Google search visibility with structured data-driven search result display"
        ],
        metrics: ["Operating personal blog platform at https://mykim.in", "Published as open-source project on GitHub"],
        techStack: [
          "Next.js 15",
          "React 19",
          "TypeScript 5",
          "Tailwind CSS 4",
          "MDX",
          "react-markdown",
          "gray-matter",
          "Cloudinary",
          "shadcn/ui",
          "Vercel",
          "next-themes",
          "Lucide React",
          "Husky",
          "GitHub Actions"
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
          "Legacy inventory 60,000 items \u2192 0 items organized",
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

interface CareerPageProps {
  locale: Locale;
}

export default function CareerPage({ locale }: CareerPageProps) {
  const data = locale === "en" ? careerDataEn : careerData;
  return <CareerPageClient careerData={data} careerDataEn={careerDataEn} />;
}
