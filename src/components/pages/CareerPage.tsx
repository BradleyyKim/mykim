import { Metadata } from "next";
import { CareerPageClient } from "@/components/layout";
import type { Locale } from "@/i18n";

// Career data type definitions
// highlights는 프로젝트당 2~5개, 개조식(명사형 종결). 면접에서 "그래서 어떻게 했나"로 이어질 경험만 남긴다.
export type Project = {
  /** stable key used by the project globe and deep links (#project-<id>) */
  id?: string;
  name: string;
  period: string;
  role?: string;
  overview: string;
  highlights: string[];
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
    position: "프론트엔드 → 풀스택 개발",
    projects: [
      {
        id: "mr-bot",
        name: "프론트엔드 그룹 MR 자동 리뷰 봇",
        period: "2026.08 - 현재",
        role: "설계·구현 주도, 공동 운영",
        overview:
          "리뷰어 부족으로 리뷰 없이 머지되던 프론트엔드 그룹 GitLab MR에 자동 리뷰 적용. MR이 열리면 변경분에 인라인 코멘트를 달고 팀 Notion에 현황 게시.",
        highlights: [
          "첫 16개 MR의 코멘트 64건 전수 검증 — 존재하지 않는 코드를 지적한 코멘트 0건, 심각도 과장 1건은 등급 규칙 수정으로 교정",
          "레포마다 도메인 주의사항 문서를 두고 봇이 그 기준으로 리뷰 — 봇은 결정하지 않고 문제만 드러내는 역할로 한정",
          "이 경험을 바탕으로 연구소 전체 대상 AI 활용 세미나 진행 — 테스트·계약·리뷰·런북 같은 기본을 AI로 더 빨리 갖추자는 방향 제안"
        ],
        techStack: ["GitLab Webhook", "Python", "Claude Code (headless)", "systemd", "Notion API"],
        references: ["https://www.mykim.in/posts/frontend-mr-review-automation"]
      },
      {
        id: "pms",
        name: "사업관리시스템 - 공사현장 공정관리 플랫폼",
        period: "2026.07 - 현재",
        role: "단독 풀스택 (기획 참여·DB·FE·배포·운영)",
        overview:
          "현장 사진을 GPS와 AI로 공정 단계에 자동 배치하고, 검수 후 발주처 조회와 엑셀 보고서까지 이어지는 플랫폼. 현장 작업자는 앱 설치 없이 문자 링크로 사진 업로드. 사내 서버 운영, 두 달간 19회 릴리스(v1.0 → v1.8). 서비스 구조로 특허 자료 작성.",
        highlights: [
          "운영 DB 마이그레이션은 운영 백업 복제본에서 먼저 실행하는 규칙 수립 — 개발 DB에서 통과한 이관 오류를 이 단계에서 검출, 이후 마이그레이션 6건 연속 적용 데이터 손실 0",
          "AI 분류기를 교체 가능한 외부 서비스로 분리, 사진마다 AI·사람 중 누가 어떤 신뢰도로 배치했는지 기록. 신뢰도 점수로 정답·오답이 갈리지 않아 컷오프 제거 후 사람 검수로 전환",
          "전산망 변경으로 DB 접속 거부된 37분 장애 복구 → 헬스체크·상태 페이지·장애 체크리스트 추가. 인증 없이 열려 있던 외부 API 직접 발견·차단 후 배포 점검 항목에 등록",
          "외래 키를 CASCADE 대신 RESTRICT로 통일 — 사진이 딸린 사업·지점·공정은 DB가 삭제 거부. 준공 증빙은 삭제 대신 비활성 처리"
        ],
        techStack: ["Next.js (App Router)", "React 19", "TypeScript", "PostgreSQL", "Mantine", "exceljs", "Web Push", "pm2", "nginx"],
        references: ["https://www.mykim.in/posts/first-fullstack-operation", "https://www.mykim.in/posts/pms-expansion-and-patent"]
      },
      {
        id: "physical-ai",
        name: "Physical AI 통합관제 솔루션",
        period: "2026.06 - 현재",
        role: "게이트웨이·영상 검지·테스트 장비 1인 개발",
        overview:
          "카메라 검지를 받아 로봇 출동을 지휘하는 통합관제 시스템. 로봇 관제 API·영상 파트너, 로봇 하드웨어 파트너와 ITS 세계총회 2026 강릉 공동 부스에서 닷새간 실물 시연. 3D 트윈·음성 관제 프로토타입에서 출발해 실제로 동작하는 것만 남기는 방향으로 범위 축소.",
        highlights: [
          "검지 결과 자동 출동 로직이 17분 동안 실물 로봇에 임무 68건 전송 → 출동을 운영자 승인 방식으로 전환, 같은 카메라·같은 유형의 연속 검지는 쿨다운으로 1건 묶음 처리",
          "파트너 로봇 서버 앞에 Node 게이트웨이를 두고 토큰 발급 단일화. 타임아웃·1회 재시도·회로 차단기 적용, 상류 서버의 토큰 동시 발급 제약을 직접 재현해 연동 구조 결정 근거로 사용",
          "로봇이 하루 몇 분만 켜지는 환경 대응 — 상류 REST·SSE 응답 녹화·재생 도구 제작, 실물 없이 개발·리허설 지속",
          "YOLO 영상 검지 서버 + 가상 CCTV 5채널 테스트 장비 제작. 누운 사람 미검지 원인을 모델 크기가 아닌 추론 해상도(640→1280)로 규명, 재인코딩 제거로 송출 CPU 200% → 4%",
          "전시 현장 운영 — 무선 3구간 중 로봇·AP 구간만 남기고 유선화하는 다음 전시 배선 확정, 운영 중 수정은 4개 화면 전부 확인 후 반영하는 규칙 수립"
        ],
        techStack: ["React 19", "TypeScript", "Jotai", "Mapbox GL", "Node (Express·ws)", "SSE", "MQTT", "WebRTC", "YOLO", "MediaMTX"],
        references: ["https://youtu.be/01ym8DAMf6s", "https://www.mykim.in/posts/its-gangneung-booth-retrospective", "https://www.mykim.in/posts/from-teleoperation-to-supervision"]
      },
      {
        id: "smartpole",
        name: "군산 스마트폴 관리 플랫폼 - 사이니지 파일 관리",
        period: "2026.06 - 2026.07",
        role: "프론트엔드 (파일 관리 기능 단독)",
        overview:
          "가로등·CCTV·DID 사이니지를 한 기둥에 묶은 스마트폴의 관제 플랫폼. 운영 중인 플랫폼에 사이니지 콘텐츠용 파일 관리(미디어 라이브러리) 기능을 2주간 단독 추가. Figma 스토리보드를 명세 문서로 구조화하고 백엔드와 API 계약 문서로 협의한 뒤 구현. 커밋 52건, 7,185줄 추가.",
        highlights: [
          "업로드 — 드래그앤드롭, 파일·폴더 일괄 업로드(폴더 구조 보존), HTTP 바이트 진행률 + 소켓 처리 상태, 취소(AbortController), 동시 3개 큐잉. 중복(409)은 재시도 대신 서버 메시지 안내로 전환",
          "복사·이동·삭제·이름변경을 파일/폴더 공통 컨텍스트 메뉴로 통합, 위치 선택 트리 모달 공용화(자기 자신·하위·현재 위치 비활성, 다중 선택 지원)",
          "미디어 정적 서버의 CORS 차단으로 직접 다운로드 불가 → 전용 다운로드 API 경유(폴더는 구조 보존 zip), 동영상은 앱 내 플레이어 모달로 재생",
          "사내 HTTP 배포에서만 업로드가 즉시 실패하던 원인을 crypto.randomUUID의 비보안 컨텍스트 미지원으로 확인, 폴백 적용",
          "화면 명세·API 계약·진행 현황 문서를 코드와 같은 커밋에서 갱신, 코드 주석은 명세 절 번호로 역참조. OpenAPI JSON에서 타입·쿼리 훅을 생성하는 에이전트 스킬(fe-sync)을 레포에 설정"
        ],
        techStack: ["React 18", "TypeScript", "Vite", "Mantine 8", "TanStack Query", "Jotai", "Socket", "Vitest"]
      },
      {
        id: "parking",
        name: "불법주정차 단속 통합 관제 플랫폼",
        period: "2026.03 - 현재",
        role: "4인 팀 · 단속관리·대시보드 담당 (팀 커밋 약 35%)",
        overview:
          "단속 구역·장비·위반 차량·민원을 한곳에서 관리하는 지자체 단속 플랫폼. 익산시 운영 중, 여러 지자체 공급을 위한 일반화 진행.",
        highlights: [
          "네이버·카카오·구글·자체 타일(Leaflet)을 하나의 MapAdapter 인터페이스로 다루는 지도 계층 위에 단속 구역 편집·대시보드 지도 개발 — 지도 SDK 교체에도 화면 코드 무변경, 폐쇄망에서는 자체 타일로 동일 화면 동작",
          "단속관리 4개 도메인의 화면과 API 응답 사이에 변환 계층 적용 — 백엔드 스펙 변경이 화면에 전파되지 않음. 변환 패턴과 낙관적 업데이트 규칙을 팀 문서로 정리",
          "한 지자체용 하드코딩 대시보드 지도를 다지자체 구조로 전환 — 행정구역 형상(저빈도)과 건수(고빈도)를 API·캐시 단위로 분리, 백엔드 명세 직접 작성. 새 지자체는 스크립트·데이터 등록만으로 추가",
          "디자인 토큰 80여 개를 용도 기준 28개로 정리해 다크 모드 적용, Mantine 8·React 19 업그레이드(71개 파일) 주도"
        ],
        techStack: ["React 19", "TypeScript", "Mantine 8", "TanStack Query", "Jotai", "Leaflet", "ECharts", "MSW"],
        references: ["https://www.mykim.in/posts/map-provider-adapter"]
      },
      {
        id: "community",
        name: "사내 커뮤니티 웹앱 - 모바일 게시판",
        period: "2025.12 - 2026.01",
        role: "프론트엔드 (3인 협업 · 알림·내 정보·댓글 영역)",
        overview:
          "사내 구성원이 글·댓글·멘션으로 소통하는 모바일 우선 게시판. 조직 정보(부서·직급)와 연결된 멘션, SSE 실시간 알림, 카테고리별 게시판과 대시보드 통계. Figma 정합 기준으로 develop 브랜치에서 협업, QA 후 릴리스.",
        highlights: [
          "알림 — SSE 스트림 기반 알림 목록(무한 스크롤), 댓글·멘션 알림 구분, 알림 클릭 시 해당 댓글로 포커스되도록 commentId 전달 협의, 읽음 처리 API를 POST에서 PATCH로 변경 제안·반영",
          "알림 설정 페이지 Figma 정합, 설정 저장 실패 시 방어 처리",
          "내 정보 — 프로필 이미지 업로드·삭제·초기화, 로더를 스켈레톤으로 교체. 내 댓글 목록 — 무한 스크롤·다중 삭제, 멘션의 내부 ID를 숨기고 이름만 강조 표시",
          "게시글 목록에 좋아요·조회·댓글 수 표시, 상세에서 돌아올 때 목록 재조회. 아이콘 전체 SVG 전환"
        ],
        techStack: ["React 19", "TypeScript", "Vite", "Mantine 8", "TipTap", "TanStack Query", "SSE", "React Router 7"]
      },
      {
        id: "traffic-dashboard",
        name: "교통 대시보드 · 스마트 모니터링",
        period: "2025",
        overview: "화성시 교통안전센터 실시간 교통 대시보드. 사용자가 위젯을 배치해 자기 화면 구성.",
        highlights: [
          "사용자가 배치한 위젯 레이아웃을 로컬·서버 이중 저장해 유실 방지",
          "Socket.IO 실시간 교통 이벤트를 선택적 쿼리·캐시로 분리해 불필요한 요청 감소"
        ],
        techStack: ["React", "TypeScript", "Jotai", "TanStack Query", "Socket.IO", "ECharts", "Mantine"],
        references: ["https://www.youtube.com/watch?v=J5T5rq83yUo"]
      },
      {
        id: "camera-config",
        name: "지능형 교통 카메라 설정 웹",
        period: "2024.04 - 2026.07",
        overview: "지능형 교통 카메라를 설정·관리하는 임베디드 웹. 수원시 교통 카메라 운영 중.",
        highlights: [
          "현장마다 다른 검지 옵션을 서버가 내려준 정의대로 그리는 Server-Driven UI 전환 — 옵션 추가 시 클라이언트 재배포 불필요",
          "Janus Gateway + WebRTC 멀티채널 실시간 CCTV 스트리밍, Canvas 기반 검지 영역 편집기 유지보수"
        ],
        techStack: ["React", "TypeScript", "Recoil", "WebRTC", "Janus Gateway", "Bootstrap"],
        references: ["https://www.mykim.in/posts/server-driven-ui", "https://www.youtube.com/watch?v=RuzbzvoUqwM"]
      },
      {
        id: "aged-vehicle",
        name: "노후차량 운행제한 모니터링",
        period: "2024 - 2025",
        overview: "부산시청 교통과 노후차량 운행제한 관리·모니터링 웹.",
        highlights: [
          "지도 SDK 없이 이미지 지도 위에 좌표를 계산해 마커 배치",
          "마커·카메라 이미지 자동 순환 모니터링 화면, ECharts 기반 단속 통계 화면 구현"
        ],
        techStack: ["React", "TypeScript", "Recoil", "ECharts", "Bootstrap"],
        references: ["https://youtu.be/y530yT1ESoE"]
      },
      {
        id: "global-portal",
        name: "Rex Smart Portal for Global - 해외 교통 관제",
        period: "2023.03 - 2025.11",
        overview: "해외 수출용 CCTV 교통 관제·단속 웹. 타지키스탄·태국 정부 납품.",
        highlights: [
          "HLS 멀티채널 CCTV 영상, 4개 국어(KO/EN/RU/TH) 지원, 태국 불기 연도 표기 대응",
          "2025년 차세대 모노레포 리뉴얼 커밋 63% 담당, 인증 흐름 재설계"
        ],
        techStack: ["React", "TypeScript", "MUI", "Jotai", "TanStack Query", "Socket.IO", "HLS", "i18next"],
        references: ["https://youtu.be/VdZq5tIw20g"]
      }
    ]
  },
  {
    name: "개인 프로젝트",
    period: "2025.01 - 현재",
    position: "풀스택 개발",
    projects: [
      {
        id: "spiderweb",
        name: "Spiderweb - md 문서 생태계 허브",
        period: "2026.08",
        overview:
          "개인·회사 폴더 27개 프로젝트의 md 문서 연결 구조를 그래프로 보여주는 로컬 도구. 보는 것은 로컬 서버가, 읽고 판단 재료를 만드는 것은 AI가, 결정 실행도 AI가 맡도록 역할 분리.",
        highlights: [
          "파이썬 표준 라이브러리만 사용(의존성 0), 캐시 없이 페이지를 열 때마다 27개 프로젝트를 0.5초에 재스캔",
          "AI 딥스캔이 문서별 요약·역할·유지/보관/병합 의견을 생성하고 사람은 결정만 — 아카이브 폴더 안에서 여전히 유효한 문서 4건 발견",
          "시각화 → AI 판단 → 로컬 서버로 세 번 방향 전환, 비용이 드는 일을 어디에 둘지가 도구 수명을 결정한다는 결론"
        ],
        techStack: ["Python (stdlib)", "HTML/JS", "Claude Code"],
        references: ["https://www.mykim.in/posts/spiderweb-hub-story"]
      },
      {
        id: "policy-pick",
        name: "똑비서 - 정책·혜택 금액 계산기",
        period: "2026.06 - 현재",
        overview:
          "나이·소득·지역을 입력하면 받을 수 있는 혜택과 금액을 즉시 보여주는 한국형 비서. 정부 사이트·블로그는 길고 '내 금액'을 계산해 주지 않는다는 문제에서 출발. 답(숫자)을 맨 위에, 모든 결과에 기준일과 공식 출처 표기.",
        highlights: [
          "계산기 7종(월세·청년적금·K패스·EV보조금·연금·자녀·의료비)을 스펙 문서 + 순수 함수 + 경계값 테스트 76개로 구현, 수치는 공식 출처 확인 후에만 반영",
          "계산기별 SSG URL과 next/og 라스터 OG 이미지(카카오톡 썸네일 대응), sitemap·robots, PWA 설치형 구성",
          "검색 로그·zero-result 수집(Upstash Redis) → 주간 수요 리포트를 GitHub Actions cron으로 자동 생성하는 '워킹 머신' 설계 — 다음 계산기를 실사용 수요로 결정"
        ],
        techStack: ["Next.js (App Router)", "TypeScript", "Vitest", "Upstash Redis", "GitHub Actions", "PWA"],
        references: ["https://ddokbeeseo.vercel.app"]
      },
      {
        id: "couple-finance",
        name: "우리가계부 - 부부 가계부 + AI",
        period: "2026.04 - 현재",
        role: "기획·설계·개발·운영 단독",
        overview:
          "광고 몇 초의 마찰이 기록 습관을 무너뜨리는 것을 겪고 만든 부부 가계부 PWA. 2026.08 배포 후 부부와 지인 가구가 실사용 중. 일반 가계부와 달리 '가구' 단위로 데이터를 나누고, AI는 숫자를 만들지 않고 이미 계산된 숫자를 문장으로만 옮김.",
        highlights: [
          "첫 기능을 입력 화면이 아닌 기존 앱 CSV 가져오기로 결정 — 실제 기록 266건을 분석해 파서 설계, 몇 달치 기록을 잇고 시작",
          "금액 계산은 전부 Postgres 뷰(SQL), LLM은 문장만 담당하는 경계를 구조로 고정. 월 경계를 KST 기준으로 두어 월말 밤 지출이 다음 달로 넘어가던 문제 해결",
          "Supabase RLS로 가구 간 데이터 격리, 뷰에 security_invoker 적용. DB 스키마에서 타입을 생성해 스키마·타입 드리프트를 빌드에서 검출",
          "폼·차트 라이브러리 없이 자체 키패드·시트 입력과 인라인 SVG 차트 구현. 매달 반복 기록 cron, 총자산 구성 선택, 업데이트 내역 페이지 등 사용자 피드백에서 나온 기능만 추가"
        ],
        techStack: ["React 19", "TypeScript", "Vite", "PWA", "Supabase (Postgres·RLS·Edge Functions)", "TanStack Query", "zustand", "Tailwind"],
        references: ["https://uri-gagyebu.vercel.app", "https://www.mykim.in/posts/building-our-couple-ledger"]
      },
      {
        id: "stock-simulator",
        name: "교육용 모의투자 시뮬레이터",
        period: "2026.03 - 2026.05",
        overview:
          "고등학교 창체 동아리용 턴제 모의투자 웹. 학생 15명이 태블릿·폰으로 참여하고 교사가 관리자 화면에서 라운드를 제어. 실시간 시세가 아니라 교사가 공개하는 뉴스형 힌트로 가격이 움직이는 '수업용 시장'.",
        highlights: [
          "라운드 시작 → 힌트 3단계 공개 → 거래 마감 → 결과 반영의 턴제 설계, 라운드 종료 후 '뉴스 정답 분석' 노출로 학습 피드백 제공",
          "Firebase Realtime DB로 학생 화면 실시간 동기화, 익명 인증으로 DB 접근 제어, 학생 삭제 방어 코드 등 교실 운영 중 발견한 문제 반영",
          "교사 피드백으로 시나리오별 용돈·자산 조절·학생 CRUD·정보 거래소 추가, 학생·관리자 매뉴얼 문서화"
        ],
        techStack: ["React 18", "TypeScript", "Vite", "Firebase Realtime DB", "Zustand", "Lightweight Charts", "Tailwind"],
        references: ["https://github.com/BradleyyKim/stock-simulator"]
      },
      {
        id: "tealog",
        name: "tealog(차차) - 차 우림 기록",
        period: "2026.02",
        overview:
          "찻잎·다구·우림 기록을 남기는 모바일 웹. 온도·우림 시간·찻잎 양·물 종류를 기록하고 별점을 매기며, 날씨와 시간대에 맞춰 찻자리를 제안. 기록 앱이 아니라 '오늘 차 한잔'을 권하는 앱이 되도록 홈 화면 구성.",
        highlights: [
          "OpenWeatherMap 날씨 연동으로 한국어 날씨 설명과 찻자리 제안, 연속 기록 스트릭·이번 주 통계, 오늘의 명언 카드",
          "Strapi 백엔드(찻잎·다구·우림 기록 3개 콘텐츠 타입)와 react-hook-form + zod 폼, 사진 업로드, ko/en 전환",
          "무료 서버 콜드 스타트를 명언 12개가 뜨는 로딩 화면으로 가려 체감 대기 완화"
        ],
        techStack: ["React 19", "TypeScript", "Vite", "Tailwind 4", "TanStack Query", "react-hook-form", "zod", "Strapi"],
        references: ["https://github.com/BradleyyKim/tealog-client", "https://github.com/BradleyyKim/tealog-server"]
      },
      {
        id: "drone-gcs",
        name: "풍력단지 드론 점검 GCS 시뮬레이터",
        period: "2025.12",
        overview:
          "대규모 풍력단지에서 자율 점검 드론을 지휘하는 웹 기반 지상관제(GCS) 시뮬레이터. 산업용 드론 운용을 흉내 내도록 바람·배터리 물리와 비상 복귀(RTH) 페일세이프 포함.",
        highlights: [
          "CesiumJS로 실제 풍력단지 지형·터빈을 3D로 렌더링, 쿼터니언으로 드론 자세 표현",
          "Express 게이트웨이 ↔ 시뮬레이터 사이를 gRPC·Protobuf 계약으로 연결, 텔레메트리는 WebSocket 10Hz 스트리밍",
          "ResizeObserver 기반 자유 크기 조절 위젯 대시보드, Framer Motion 전환"
        ],
        techStack: ["React 18", "TypeScript", "CesiumJS", "Mantine", "Node.js", "gRPC·Protobuf", "WebSocket"],
        references: ["https://github.com/BradleyyKim/DroneSimulator"]
      },
      {
        id: "blog",
        name: "MY Kim Blog",
        period: "2025.03 - 현재",
        overview:
          "Next.js App Router와 MDX로 만든 한/영 블로그이자 포트폴리오. 지금 보고 있는 이 사이트. 글 72편(ko/en)과 제출용 PDF 이력서, 인터랙티브 포트폴리오를 한 저장소에서 운영.",
        highlights: [
          "Strapi Cloud CMS 제거 → 로컬 MDX 파일 기반으로 전환, 월 $15 운영비 0원화. content 디렉터리를 서버리스 번들에 포함해 운영 환경 글 누락 해결",
          "i18n 라이브러리 없이 Route Group으로 한/영 페이지 트리 분리, 미들웨어에서 언어 감지·쿠키 저장",
          "이력서 PDF 생성을 서버 사이드에서 CSS Print Media 기반 클라이언트 생성으로 전환, 별도 서버 비용 없이 ko/en 미리보기·다운로드",
          "글 저장 시 문체 규칙을 자동 검수하는 훅 적용(볼드·이모지·번역투 검출), main 푸시 후 사이트맵·RSS·홈을 확인하는 배포 스모크 테스트 CI 구성",
          "v2 리디자인 — HSL 토큰 디자인 시스템, three.js 홀로그램 지구본(프로젝트 지도), MDX 한 줄로 글 안에 넣는 인터랙티브 도식 컴포넌트"
        ],
        techStack: ["Next.js 15", "React 19", "TypeScript", "MDX", "Tailwind CSS", "three.js", "Vercel", "GitHub Actions"],
        references: ["https://mykim.in", "https://github.com/BradleyyKim/mykim"]
      }
    ]
  },
  {
    name: "개발 외 경험",
    period: "2019 - 2020",
    position: "자재·물류 감독관 (Supervisor)",
    projects: [
      {
        id: "samsung",
        name: "삼성전자 미국법인(SEA) 모바일 생산 협력사 인턴십",
        period: "2019 - 2020 (약 1년)",
        role: "자재·물류 입출고 감독관, 주간 매니저 역할 겸임",
        overview:
          "텍사스 코펠의 삼성전자 미국법인(SEA) 모바일 생산 1차 협력사. 휴대폰·무선 이어폰 검수·조립·패키징 라인에 자재를 공급하는 자재·물류팀 담당. Supervisor로 입사해 공석이던 주간 매니저 역할 수행.",
        highlights: [
          "방치된 레거시 재고 6만 개 → 0 — 전 품목 코드 엑셀화, 평일 업무 시간 재배분과 스태프 공동 규칙으로 두 달 만에 정리. 반품 가능분은 물류사 반품, 악성 재고는 보고 후 삭제, 잔여분은 우선 소진 매뉴얼 적용",
          "생산 라인 자재 부족 이슈 99% 감소 — 생산팀 직접 반출 차단, 생산 계획 확정 즉시 라인별·시간별 자재 세팅, 파레트 더블체크 템플릿과 라인 코드 표기, 추가 요청 서명제 도입. 추가 발주량 0%에 근접",
          "물류사와 입고 검수 협약 체결 — 실물 검사 없는 입고 금지, 서명 없으면 Pending 처리 후 상호 추적. 삼성 본사 회의에서 SAP 연동 제안 → 패드 보급으로 입고 전자동 관리 전환",
          "주·야간 교대 간 책임 전가 문제를 일일 업무 완료 폼·이슈/우선순위 템플릿으로 해소, 인턴 최초 본사 전체 생산 회의 참석 및 켄터키 출장(완제품 8천 개 리패키징 2박 3일 완료)",
          "남미·아프리카·동남아·네팔 출신 스태프 팀 리딩 — 강점 기반 업무 배분, 주간 미팅 운영, 근태·스케줄 관리"
        ],
        references: ["https://www.mykim.in/posts/internship-in-america", "https://www.mykim.in/posts/internship-in-america2"]
      }
    ]
  }
];

// English career data
const careerDataEn: Company[] = [
  {
    name: "REXGEN",
    link: "https://www.rexgen.co.kr/",
    period: "Dec 2022 - Present",
    position: "Software Engineer (Frontend → Full-stack)",
    projects: [
      {
        id: "mr-bot",
        name: "Automated Merge-Request Reviewer",
        period: "Aug 2026 - Present",
        role: "Led design and implementation, co-maintained",
        overview:
          "Automated review for the frontend group's GitLab merge requests, which were going in unreviewed. Posts inline comments on each MR and a summary to the team's Notion.",
        highlights: [
          "Verified all 64 comments on the first 16 MRs — zero pointed at non-existent code; one overstated severity, fixed in the grading rules",
          "Each repository carries a short card of domain pitfalls the bot reviews against — the bot surfaces issues, people decide",
          "Ran a lab-wide session on AI in development based on this work — reach the fundamentals (tests, contracts, review, runbooks) faster, don't skip them"
        ],
        techStack: ["GitLab Webhook", "Python", "Claude Code (headless)", "systemd", "Notion API"],
        references: ["https://www.mykim.in/en/posts/frontend-mr-review-automation"]
      },
      {
        id: "pms",
        name: "Project Management System - Construction Progress Platform",
        period: "Jul 2026 - Present",
        role: "Solo full-stack (planning input, DB, frontend, deployment, operations)",
        overview:
          "Field workers upload site photos from a text-message link, no app to install. Photos are placed into construction stages by GPS and an AI classifier, reviewed, and reported to the client in its own Excel format. Self-hosted; 19 releases in two months (v1.0 → v1.8). Patent materials written from its design.",
        highlights: [
          "Every production migration rehearsed on a copy of the production backup first — caught a data-migration bug that passed on dev; six migrations since with zero data loss",
          "Classifier behind a swappable service boundary; each placement records whether AI or a person made it and at what confidence. Confidence didn't separate right from wrong → removed the cutoff, routed to human review",
          "Recovered a 37-minute outage after a network change made the DB reject connections → added health check, status page and incident checklist; found and closed an unauthenticated external API, added to the deploy checklist",
          "Foreign keys RESTRICT instead of CASCADE — the DB refuses to delete anything with photos under it; evidence is deactivated, never deleted"
        ],
        techStack: ["Next.js (App Router)", "React 19", "TypeScript", "PostgreSQL", "Mantine", "exceljs", "Web Push", "pm2", "nginx"],
        references: ["https://www.mykim.in/en/posts/first-fullstack-operation", "https://www.mykim.in/en/posts/pms-expansion-and-patent"]
      },
      {
        id: "physical-ai",
        name: "Physical AI Integrated Control Solution",
        period: "Jun 2026 - Present",
        role: "Sole developer of the gateway, video detection and test rig",
        overview:
          "Control system that dispatches robots in response to camera detections. Shown live for five days at a joint booth at ITS World Congress 2026 Gangneung with a robot-platform partner and a robot-hardware partner. Started as a prototype with a 3D twin and voice control; scope cut to what actually works on site.",
        highlights: [
          "Automatic dispatch sent 68 missions to real robots in 17 minutes → switched dispatch to operator approval; repeated detections from the same camera and type grouped with a cooldown",
          "Node gateway in front of the partner's robot server issuing tokens in one place, with timeouts, one retry and a circuit breaker; reproduced the upstream concurrent-token limit and used it to decide the integration design",
          "Robots online only minutes a day → built a record/replay tool for upstream REST and SSE traffic; development and rehearsals continued without hardware",
          "YOLO detection server + five-channel virtual CCTV rig; traced missed lying-down detections to inference resolution (640 → 1280), not model size; removed re-encoding to cut streaming CPU from 200% to 4%",
          "Booth operations — fixed next show's wiring to a single wireless hop (AP ↔ robot), and a rule that any live code change is checked on all four screens before release"
        ],
        techStack: ["React 19", "TypeScript", "Jotai", "Mapbox GL", "Node (Express, ws)", "SSE", "MQTT", "WebRTC", "YOLO", "MediaMTX"],
        references: ["https://youtu.be/01ym8DAMf6s", "https://www.mykim.in/en/posts/from-teleoperation-to-supervision"]
      },
      {
        id: "smartpole",
        name: "Gunsan Smart Pole Platform - Signage File Management",
        period: "Jun 2026 - Jul 2026",
        role: "Frontend (sole owner of the file-management feature)",
        overview:
          "Control platform for smart poles that bundle street lighting, CCTV and digital signage on one post. Added the media-library feature for signage content to the running platform in two weeks, solo. Structured the Figma storyboard into a spec document and agreed the API with the backend in a contract document before building. 52 commits, +7,185 lines.",
        highlights: [
          "Upload — drag and drop, file and folder bulk upload (folder structure preserved), HTTP byte progress plus socket processing state, cancel via AbortController, three concurrent uploads with queueing. Duplicate (409) shows the server message instead of a retry",
          "Copy, move, delete and rename unified in one context menu for files and folders; shared location-picker tree modal (self, descendants and current location disabled; multi-select)",
          "Media static server blocked by CORS → downloads go through a dedicated API (folders as structure-preserving zip); video plays in an in-app player modal",
          "Uploads died only on the in-house HTTP deployment — traced to crypto.randomUUID being unavailable in non-secure contexts, added a fallback",
          "Screen spec, API contract and progress docs updated in the same commit as code; code comments reference spec section numbers. Set up an agent skill (fe-sync) that generates types and query hooks from the OpenAPI JSON"
        ],
        techStack: ["React 18", "TypeScript", "Vite", "Mantine 8", "TanStack Query", "Jotai", "Socket", "Vitest"]
      },
      {
        id: "parking",
        name: "Parking Enforcement Control Platform",
        period: "Mar 2026 - Present",
        role: "Team of 4 · enforcement management and dashboard (~35% of commits)",
        overview:
          "Municipal platform managing enforcement zones, devices, violations and complaints in one place. In production in Iksan; being generalized for other cities.",
        highlights: [
          "Enforcement-zone editing and dashboard map on a map layer that puts Naver, Kakao, Google and self-hosted Leaflet tiles behind one MapAdapter — screens unchanged when the SDK changes; same screens on self-hosted tiles in closed networks",
          "Converter layer between API responses and four enforcement-domain screens — backend spec changes stay out of the UI; pattern and optimistic-update rules documented for the team",
          "Turned a single-city hardcoded dashboard map into a multi-city one — district shapes (rarely change) and counts (change often) split into separate endpoints and caches; wrote the backend spec. New city = one script + data upload",
          "Consolidated 80+ design tokens into 28 purpose-based ones for dark mode; led the Mantine 8 / React 19 upgrade (71 files)"
        ],
        techStack: ["React 19", "TypeScript", "Mantine 8", "TanStack Query", "Jotai", "Leaflet", "ECharts", "MSW"],
        references: ["https://www.mykim.in/en/posts/map-provider-adapter"]
      },
      {
        id: "community",
        name: "In-house Community Web App - Mobile Board",
        period: "Dec 2025 - Jan 2026",
        role: "Frontend (team of three · notifications, profile, comments)",
        overview:
          "Mobile-first board where staff post, comment and mention each other. Mentions tied to org data (department, title), real-time notifications over SSE, category boards and dashboard stats. Built against Figma on a shared develop branch, released after QA.",
        highlights: [
          "Notifications — SSE-backed list with infinite scroll, comment vs. mention types, agreed to pass commentId so a tap focuses the comment, proposed and landed the read API change from POST to PATCH",
          "Notification settings page matched to Figma, with defensive handling when saving fails",
          "Profile — image upload, delete and reset, loader replaced by skeleton. My comments — infinite scroll, multi-delete, mention internal IDs hidden and names highlighted",
          "Like, view and comment counts on the post list; list refetches on return from detail. All icons moved to SVG"
        ],
        techStack: ["React 19", "TypeScript", "Vite", "Mantine 8", "TipTap", "TanStack Query", "SSE", "React Router 7"]
      },
      {
        id: "traffic-dashboard",
        name: "Traffic Dashboard · Smart Monitoring",
        period: "2025",
        overview: "Real-time traffic dashboard for the Hwaseong traffic safety center; operators arrange their own widgets.",
        highlights: [
          "Widget layouts saved both locally and on the server to prevent loss",
          "Real-time traffic events over Socket.IO split across selective queries and caches to cut redundant requests"
        ],
        techStack: ["React", "TypeScript", "Jotai", "TanStack Query", "Socket.IO", "ECharts", "Mantine"],
        references: ["https://www.youtube.com/watch?v=J5T5rq83yUo"]
      },
      {
        id: "camera-config",
        name: "Intelligent Traffic Camera Configuration UI",
        period: "Apr 2024 - Jul 2026",
        overview: "Embedded web UI for configuring intelligent traffic cameras, running on cameras in Suwon.",
        highlights: [
          "Detector options moved to a server-driven UI rendered from server definitions — new options ship without a client release",
          "Multi-channel live CCTV via Janus Gateway + WebRTC; maintained the Canvas-based detection-zone editor"
        ],
        techStack: ["React", "TypeScript", "Recoil", "WebRTC", "Janus Gateway", "Bootstrap"],
        references: ["https://www.mykim.in/en/posts/server-driven-ui", "https://www.youtube.com/watch?v=RuzbzvoUqwM"]
      },
      {
        id: "aged-vehicle",
        name: "Aged Vehicle Restriction Monitoring",
        period: "2024 - 2025",
        overview: "Management and monitoring web app for aged-vehicle driving restrictions, used by Busan City Hall's transportation department.",
        highlights: [
          "Markers placed by computed coordinates on an image map, no map SDK",
          "Monitoring view that cycles markers and camera images automatically; ECharts enforcement statistics"
        ],
        techStack: ["React", "TypeScript", "Recoil", "ECharts", "Bootstrap"],
        references: ["https://youtu.be/y530yT1ESoE"]
      },
      {
        id: "global-portal",
        name: "Rex Smart Portal for Global - Traffic Monitoring for Export",
        period: "Mar 2023 - Nov 2025",
        overview: "CCTV-based traffic monitoring and enforcement web app delivered to the governments of Tajikistan and Thailand.",
        highlights: [
          "Multi-channel HLS CCTV video, four languages (KO/EN/RU/TH) including the Thai Buddhist calendar",
          "63% of commits on the 2025 monorepo rebuild, including a rework of the authentication flow"
        ],
        techStack: ["React", "TypeScript", "MUI", "Jotai", "TanStack Query", "Socket.IO", "HLS", "i18next"],
        references: ["https://youtu.be/VdZq5tIw20g"]
      }
    ]
  },
  {
    name: "Personal Projects",
    period: "Jan 2025 - Present",
    position: "Full-stack",
    projects: [
      {
        id: "spiderweb",
        name: "Spiderweb - Markdown Ecosystem Hub",
        period: "Aug 2026",
        overview:
          "Local tool that graphs how the markdown docs of 27 projects across personal and work folders link to each other. Roles split: the local server shows, AI reads and prepares judgments, AI executes decisions.",
        highlights: [
          "Python standard library only (zero dependencies); no cache — rescans 27 projects in 0.5 s on every page load",
          "AI deep-scan writes a one-line summary, role and keep/archive/merge opinion per document; the human only decides — found four still-valid documents inside archive folders",
          "Three pivots (visualization → AI judgment → local server) led to one lesson: where the costly work sits decides whether a tool survives"
        ],
        techStack: ["Python (stdlib)", "HTML/JS", "Claude Code"],
        references: ["https://www.mykim.in/en/posts/spiderweb-hub-story"]
      },
      {
        id: "policy-pick",
        name: "Ddokbeeseo - Benefit & Policy Calculator",
        period: "Jun 2026 - Present",
        overview:
          "Enter age, income and region → see the benefits you qualify for and the amount, instantly. Built because government sites and blogs are long and never compute 'my number'. The answer comes first; every result carries an as-of date and an official source.",
        highlights: [
          "Seven calculators (rent, youth savings, K-Pass, EV subsidy, pension, child, medical) as spec docs + pure functions + 76 boundary tests; figures entered only after checking official sources",
          "Per-calculator SSG URLs with raster OG images via next/og (KakaoTalk thumbnails), sitemap/robots, installable PWA",
          "'Working machines' — search and zero-result logging (Upstash Redis) feeding a weekly demand report generated by GitHub Actions cron; the next calculator is chosen from real demand"
        ],
        techStack: ["Next.js (App Router)", "TypeScript", "Vitest", "Upstash Redis", "GitHub Actions", "PWA"],
        references: ["https://ddokbeeseo.vercel.app"]
      },
      {
        id: "couple-finance",
        name: "Uri Gagyebu - Couple Ledger + AI",
        period: "Apr 2026 - Present",
        role: "Solo: planning, design, development, operations",
        overview:
          "A couple's ledger PWA, built after a few seconds of ads per entry killed the habit of recording. Live since Aug 2026 for our household and friends' households. Unlike generic ledgers, data is partitioned per household, and AI never produces numbers — it only turns already-computed figures into sentences.",
        highlights: [
          "First feature was CSV import from the previous app, not an input screen — parser designed from 266 real entries so months of history carried over",
          "All money math in Postgres views (SQL); LLM limited to prose by structure. Month boundaries fixed to KST so late-night month-end spending stopped drifting into the next month",
          "Supabase RLS isolates households; views run with security_invoker. Types generated from the DB schema so schema/type drift fails the build",
          "No form or chart library — custom keypad and sheet input, inline SVG charts. Monthly recurring entries via cron, net-worth composition, a changelog page — features added only from user feedback"
        ],
        techStack: ["React 19", "TypeScript", "Vite", "PWA", "Supabase (Postgres, RLS, Edge Functions)", "TanStack Query", "zustand", "Tailwind"],
        references: ["https://uri-gagyebu.vercel.app", "https://www.mykim.in/en/posts/building-our-couple-ledger"]
      },
      {
        id: "stock-simulator",
        name: "Classroom Investing Simulator",
        period: "Mar 2026 - May 2026",
        overview:
          "Turn-based stock-market simulator for a high-school club: ~15 students on tablets and phones, a teacher controlling rounds from an admin screen. Prices move on teacher-released news-style hints, not live quotes — a market built for a lesson.",
        highlights: [
          "Round start → three staged hints → trading close → results, with a 'news answer analysis' revealed after each round",
          "Firebase Realtime DB sync for student screens, anonymous auth to gate DB access, defensive code for student deletion — fixes found while running real classes",
          "Teacher feedback shipped as per-scenario allowances, asset adjustment, student CRUD and an information exchange; student and admin manuals written"
        ],
        techStack: ["React 18", "TypeScript", "Vite", "Firebase Realtime DB", "Zustand", "Lightweight Charts", "Tailwind"],
        references: ["https://github.com/BradleyyKim/stock-simulator"]
      },
      {
        id: "tealog",
        name: "tealog - Tea Brewing Journal",
        period: "Feb 2026",
        overview:
          "Mobile web app for logging teas, teaware and brews — temperature, steep time, leaf weight, water type, rating — that also suggests a tea for the weather and time of day. Designed to nudge 'a cup today', not just to store records.",
        highlights: [
          "OpenWeatherMap integration with Korean weather copy and tea suggestions; brewing streak, weekly stats and a daily quote card",
          "Strapi backend (tea leaves, teaware, brew logs), react-hook-form + zod forms, photo upload, ko/en switch",
          "Free-tier server cold starts masked by a loading screen that shows one of 12 quotes"
        ],
        techStack: ["React 19", "TypeScript", "Vite", "Tailwind 4", "TanStack Query", "react-hook-form", "zod", "Strapi"],
        references: ["https://github.com/BradleyyKim/tealog-client", "https://github.com/BradleyyKim/tealog-server"]
      },
      {
        id: "drone-gcs",
        name: "Wind Farm Drone Inspection GCS",
        period: "Dec 2025",
        overview:
          "Web-based ground control system simulating autonomous inspection drones over a large wind farm, with wind and battery physics and a return-to-home failsafe to mimic industrial operations.",
        highlights: [
          "CesiumJS renders the real wind-farm terrain and turbines in 3D; drone attitude via quaternions",
          "Express gateway ↔ simulator over gRPC/Protobuf contracts; telemetry streamed over WebSocket at 10 Hz",
          "Freely resizable widget dashboard driven by ResizeObserver, Framer Motion transitions"
        ],
        techStack: ["React 18", "TypeScript", "CesiumJS", "Mantine", "Node.js", "gRPC/Protobuf", "WebSocket"],
        references: ["https://github.com/BradleyyKim/DroneSimulator"]
      },
      {
        id: "blog",
        name: "MY Kim Blog",
        period: "Mar 2025 - Present",
        overview:
          "Korean/English blog and portfolio built with Next.js App Router and MDX — this site. 72 posts (ko/en), a downloadable PDF résumé and an interactive portfolio in one repository.",
        highlights: [
          "Replaced Strapi Cloud with local MDX files, removing a $15/month bill; content directory bundled into serverless functions to fix posts missing in production",
          "Korean/English page trees split with route groups, locale detected and stored by middleware — no i18n library",
          "Résumé PDF moved from server-side to CSS Print Media generation in the browser — ko/en preview and download with no extra server",
          "A save hook audits post prose against the house style (bold, emoji, translationese); CI smoke-tests sitemap, RSS and home after every push to main",
          "v2 redesign — HSL token design system, three.js hologram globe (project map), interactive figures embedded in posts with one line of MDX"
        ],
        techStack: ["Next.js 15", "React 19", "TypeScript", "MDX", "Tailwind CSS", "three.js", "Vercel", "GitHub Actions"],
        references: ["https://mykim.in", "https://github.com/BradleyyKim/mykim"]
      }
    ]
  },
  {
    name: "Before Software",
    period: "2019 - 2020",
    position: "Materials & Logistics Supervisor",
    projects: [
      {
        id: "samsung",
        name: "Samsung Electronics America (SEA) Mobile Production Partner - Internship",
        period: "2019 - 2020 (about 1 year)",
        role: "Materials and logistics supervisor, also covering the day-shift manager role",
        overview:
          "Tier-1 mobile production partner of Samsung Electronics America in Coppell, Texas. Materials and logistics team supplying inspection, assembly and packaging lines for phones and wireless earbuds. Hired as Supervisor; covered the vacant day-shift manager role.",
        highlights: [
          "Legacy inventory 60,000 → 0 — catalogued every part code, carved out sorting time from the weekday schedule, shared rules with staff; cleared in two months. Returnable stock returned, dead stock reported and written off, remainder on a use-first manual",
          "Line material shortages down 99% — blocked production from pulling stock directly, staged materials per line and hour as soon as the plan was fixed, pallet double-check template and line codes, signatures for extra requests; reorders near 0%",
          "Receiving agreement with the logistics vendor — no receipt without physical inspection, unsigned deliveries held as Pending and cross-traced. Proposed SAP integration at a Samsung HQ meeting → tablets rolled out, receiving fully automated",
          "Day/night blame loop resolved with a daily completion form and issue/priority templates; first intern at the company-wide HQ production meeting and on a business trip (8,000 finished units repackaged in Kentucky in three days)",
          "Led a team from South America, Africa, Southeast Asia and Nepal — strength-based assignments, weekly meetings, attendance and scheduling"
        ],
        references: ["https://www.mykim.in/en/posts/internship-in-america", "https://www.mykim.in/en/posts/internship-in-america2"]
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
