import type { Locale } from "@/i18n";

/** A place on the globe with a short story attached. Coordinates are public city centres. */
export interface Site {
  id: string;
  lat: number;
  lng: number;
  primary?: boolean;
  color?: number;
  label: Record<Locale, string>;
  /** label nudge in px so clustered cities don't overlap */
  labelOffset?: [number, number];
  title: Record<Locale, string>;
  line: Record<Locale, string>;
  href?: string;
  /** career project this site belongs to (`Project.id`) — project globe only */
  projectId?: string;
}

/** Hero globe — where the work actually ran. */
export const HERO_SITES: Site[] = [
  {
    id: "seoul",
    lat: 37.5665,
    lng: 126.978,
    primary: true,
    label: { ko: "서울", en: "Seoul" },
    labelOffset: [14, -38],
    title: { ko: "서울 — 기반", en: "Seoul — home base" },
    line: {
      ko: "연구소에서 관제 화면과 게이트웨이를 만든다. 대부분의 글이 여기서 나왔다.",
      en: "Where the control screens and gateways get built. Most posts start here."
    },
    href: "/about"
  },
  {
    id: "gangneung",
    lat: 37.7519,
    lng: 128.8761,
    label: { ko: "강릉", en: "Gangneung" },
    labelOffset: [14, -19],
    title: { ko: "강릉 — ITS 세계총회 부스", en: "Gangneung — ITS World Congress booth" },
    line: {
      ko: "검지 → 승인 → 실물 로봇 출동 → 복귀를 닷새 동안 실물로 돌렸다.",
      en: "Detection, approval, a real robot dispatched and returned, for five days."
    },
    href: "/posts/its-gangneung-booth-retrospective"
  },
  {
    id: "suwon",
    lat: 37.2636,
    lng: 127.0286,
    label: { ko: "수원", en: "Suwon" },
    labelOffset: [14, 0],
    title: { ko: "수원 — 지능형 교통 카메라", en: "Suwon — intelligent traffic cameras" },
    line: {
      ko: "카메라 안에서 도는 설정 UI. 검지 옵션을 서버 정의로 그리게 바꿨다.",
      en: "Embedded configuration UI running on the cameras, with server-driven detector options."
    },
    href: "/posts/server-driven-ui"
  },
  {
    id: "iksan",
    lat: 35.9483,
    lng: 126.9577,
    label: { ko: "익산", en: "Iksan" },
    labelOffset: [14, 19],
    title: { ko: "익산 — 불법주정차 단속 관제", en: "Iksan — parking enforcement platform" },
    line: {
      ko: "지도 SDK 네 종을 어댑터 하나 뒤에 두었다. 폐쇄망에서는 자체 타일로 같은 화면이 돈다.",
      en: "Four map SDKs behind one adapter; on closed networks the same screens run on self-hosted tiles."
    },
    href: "/posts/map-provider-adapter"
  },
  {
    id: "gunsan",
    lat: 35.9676,
    lng: 126.7369,
    label: { ko: "군산", en: "Gunsan" },
    labelOffset: [14, 38],
    title: { ko: "군산 — 공사현장 사진 플랫폼", en: "Gunsan — construction photo platform" },
    line: {
      ko: "문자 링크로 사진을 올리면 GPS와 분류기가 공정에 넣는다. 두 달에 열아홉 번 배포했다.",
      en: "Photos arrive from a text-message link and land in construction stages. Nineteen releases in two months."
    },
    href: "/career"
  },
  {
    id: "bangkok",
    lat: 13.7563,
    lng: 100.5018,
    label: { ko: "방콕", en: "Bangkok" },
    labelOffset: [12, 0],
    title: { ko: "방콕 — 글로벌 교통 포털", en: "Bangkok — global traffic portal" },
    line: {
      ko: "네 언어와 태국 불기 달력까지. 다채널 HLS 영상 관제.",
      en: "Four languages including the Thai Buddhist calendar, multi-channel HLS video."
    },
    href: "/career"
  }
];

/** Project globe (/career) — where each project actually ran. Several projects have two sites. */
export const PROJECT_SITES: Site[] = [
  {
    id: "pai-gangneung",
    projectId: "physical-ai",
    lat: 37.7519,
    lng: 128.8761,
    primary: true,
    label: { ko: "Gangneung", en: "Gangneung" },
    labelOffset: [14, -82],
    title: { ko: "강릉 — ITS 세계총회 부스 시연", en: "Gangneung — ITS World Congress booth demo" },
    line: {
      ko: "검지 → 승인 → 실물 로봇 출동 → 복귀를 닷새 동안 실물로 돌렸다.",
      en: "Detection, approval, a real robot dispatched and returned, live for five days."
    }
  },
  {
    id: "pai-border",
    projectId: "physical-ai",
    lat: 52.2,
    lng: 21.0,
    primary: true,
    label: { ko: "Europe · Border", en: "Europe · Border" },
    labelOffset: [14, 0],
    title: { ko: "유럽 국경 — 시나리오", en: "European border — scenario" },
    line: {
      ko: "유럽 두 나라 사이 18 km 국경 구간 감시 시나리오. 거리로 출동 수단을 가르는 전용 화면을 시뮬레이션으로 보였다.",
      en: "An 18 km watch along a border between two European countries, shown in simulation with a screen that picks the unit by distance."
    }
  },
  {
    id: "pms-lab",
    projectId: "pms",
    lat: 37.3943,
    lng: 126.9568,
    label: { ko: "R&D Lab · Sites", en: "R&D Lab · Sites" },
    labelOffset: [14, -28],
    title: { ko: "연구소 — 사업관리시스템 파일럿", en: "R&D lab — project management system pilot" },
    line: {
      ko: "공사현장 사진이 문자 링크로 올라오면 GPS와 분류기가 공정에 넣는다. 연구소에서 만들어 파일럿 시연까지.",
      en: "Site photos arrive from a text-message link and land in construction stages. Built and piloted from the lab."
    }
  },
  {
    id: "pms-jeonju",
    projectId: "pms",
    lat: 35.8242,
    lng: 127.148,
    label: { ko: "Jeonju", en: "Jeonju" },
    labelOffset: [14, 62],
    title: { ko: "전주 — 사업관리시스템 현장", en: "Jeonju — project management system site" },
    line: {
      ko: "실제 공사현장 사진이 들어오는 두 번째 현장.",
      en: "The second site feeding real construction photos into the platform."
    }
  },
  {
    id: "parking-iksan",
    projectId: "parking",
    lat: 35.9483,
    lng: 126.9577,
    label: { ko: "Iksan", en: "Iksan" },
    labelOffset: [14, 26],
    title: { ko: "익산 — 불법주정차 단속 통합 관제", en: "Iksan — parking enforcement platform" },
    line: {
      ko: "단속 구역·장비·위반·민원을 한 화면에서. 지도 SDK 네 종을 어댑터 하나 뒤에 두었다.",
      en: "Zones, devices, violations and complaints on one screen; four map SDKs behind one adapter."
    }
  },
  {
    id: "mrbot-anyang",
    projectId: "mr-bot",
    lat: 37.3943,
    lng: 126.9568,
    label: { ko: "R&D Lab · MR Bot", en: "R&D Lab · MR Bot" },
    labelOffset: [14, -46],
    title: { ko: "연구소 — 프론트엔드 그룹 MR 자동 리뷰 봇", en: "R&D lab — automated merge-request reviewer" },
    line: {
      ko: "연구소 프론트엔드 그룹의 GitLab MR에 자동 리뷰를 붙였다. 첫 16개 MR의 코멘트 64개를 전부 검증했다.",
      en: "Automated review on the lab's GitLab merge requests. All 64 comments on the first 16 MRs were verified by hand."
    }
  },
  {
    id: "global-dushanbe",
    projectId: "global-portal",
    lat: 38.5598,
    lng: 68.787,
    label: { ko: "Dushanbe", en: "Dushanbe" },
    labelOffset: [14, 0],
    title: { ko: "두샨베 — Rex Smart Portal for Global", en: "Dushanbe — Rex Smart Portal for Global" },
    line: {
      ko: "타지키스탄 정부 실시간 교통 관제 시스템으로 운영 중. 러시아어 포함 4개 국어.",
      en: "Running as the Tajik government's real-time traffic control system. Four languages including Russian."
    }
  },
  {
    id: "global-bangkok",
    projectId: "global-portal",
    lat: 13.7563,
    lng: 100.5018,
    label: { ko: "Bangkok", en: "Bangkok" },
    labelOffset: [14, 0],
    title: { ko: "방콕 — Rex Smart Portal for Global", en: "Bangkok — Rex Smart Portal for Global" },
    line: {
      ko: "태국 정부 현지 설치. 태국어와 불기 연도 표기에 대응했다.",
      en: "Installed on site for the Thai government, with Thai and the Buddhist calendar."
    }
  },
  {
    id: "camera-suwon",
    projectId: "camera-config",
    lat: 37.2636,
    lng: 127.0286,
    label: { ko: "Suwon", en: "Suwon" },
    labelOffset: [14, -10],
    title: { ko: "수원 — 스마트교차로 · 지능형 교통 카메라", en: "Suwon — smart intersections · intelligent traffic cameras" },
    line: {
      ko: "수원시 교통 카메라 안에서 도는 설정 웹. 검지 옵션을 서버 정의대로 그린다.",
      en: "Configuration UI running on Suwon's traffic cameras, drawing detector options from server definitions."
    }
  },
  {
    id: "dashboard-hwaseong",
    projectId: "traffic-dashboard",
    lat: 37.1996,
    lng: 126.8312,
    label: { ko: "Hwaseong", en: "Hwaseong" },
    labelOffset: [14, 8],
    title: { ko: "화성 — 교통 대시보드", en: "Hwaseong — traffic dashboard" },
    line: {
      ko: "교통안전센터 실시간 대시보드. 사용자가 배치한 위젯을 로컬과 서버에 같이 저장한다.",
      en: "Real-time dashboard for the traffic safety center; widget layouts saved locally and on the server."
    }
  },
  {
    id: "aged-busan",
    projectId: "aged-vehicle",
    lat: 35.1796,
    lng: 129.0756,
    label: { ko: "Busan", en: "Busan" },
    labelOffset: [14, 80],
    title: { ko: "부산 — 노후차량 운행제한 모니터링", en: "Busan — aged-vehicle restriction monitoring" },
    line: {
      ko: "부산시청 교통과 운영. 이미지 지도 위에 좌표를 계산해 마커를 올렸다.",
      en: "Used by Busan City Hall; markers computed onto an image map instead of a map SDK."
    }
  }
,
  {
    id: "smartpole-gunsan",
    projectId: "smartpole",
    lat: 35.9676,
    lng: 126.7369,
    label: { ko: "Gunsan", en: "Gunsan" },
    labelOffset: [14, 44],
    title: { ko: "군산 — 스마트폴 관리 플랫폼", en: "Gunsan — smart pole platform" },
    line: {
      ko: "가로등·CCTV·사이니지를 한 기둥에 묶은 스마트폴의 관제 플랫폼. 사이니지용 파일 관리 기능을 2주간 단독으로 추가했다.",
      en: "Control platform for poles that bundle lighting, CCTV and signage. Added the signage file manager solo in two weeks."
    }
  },
  {
    id: "community-lab",
    projectId: "community",
    lat: 37.3943,
    lng: 126.9568,
    label: { ko: "R&D Lab · Community", en: "R&D Lab · Community" },
    labelOffset: [14, -64],
    title: { ko: "연구소 — 사내 커뮤니티 웹앱", en: "R&D lab — in-house community app" },
    line: {
      ko: "구성원이 글·댓글·멘션으로 소통하는 모바일 게시판. 알림·내 정보·댓글 영역을 맡았다.",
      en: "A mobile board where staff post, comment and mention each other. I owned notifications, profile and comments."
    }
  },
  {
    id: "samsung-coppell",
    projectId: "samsung",
    lat: 32.9546,
    lng: -97.015,
    label: { ko: "Coppell, TX", en: "Coppell, TX" },
    labelOffset: [14, 0],
    title: { ko: "텍사스 코펠 — 삼성전자 미국법인(SEA) 협력사", en: "Coppell, Texas — Samsung Electronics America partner" },
    line: {
      ko: "모바일 생산 협력사 자재·물류팀. 재고 6만 개를 0으로, 라인 자재 부족을 99% 줄였다.",
      en: "Materials and logistics at a mobile production partner. Inventory 60,000 → 0, line shortages down 99%."
    }
  }
];
