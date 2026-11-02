import type { Locale } from "@/i18n";
import type { Stage } from "@/lib/three/controlScene";

/** One step of the control loop the hero scene replays, with the post that goes deepest into it. */
export interface SceneStep {
  id: Stage;
  /** chip text on the canvas — English, uppercase mono like the globe labels */
  label: string;
  title: Record<Locale, string>;
  line: Record<Locale, string>;
  /** post slug under /posts; an en entry is only linked when the post exists in English */
  href: Record<Locale, string | null>;
}

export const SCENE_STEPS: SceneStep[] = [
  {
    id: "detect",
    label: "Detect",
    title: { ko: "검지", en: "Detect" },
    line: {
      ko: "도로 위 카메라가 상황을 잡는다. 어떤 검지를 켤지는 카메라 안의 설정 화면에서 정한다.",
      en: "A roadside camera picks up the incident. Which detections run is set from a screen inside the camera."
    },
    href: { ko: "/posts/server-driven-ui", en: "/posts/server-driven-ui" }
  },
  {
    id: "approve",
    label: "Approve",
    title: { ko: "승인", en: "Approve" },
    line: {
      ko: "관제석에 올라온 건을 사람이 확인하고 승인한다. 로봇을 조종하는 대신 감독하는 화면이다.",
      en: "An operator checks the event on the console and approves it. The screen supervises robots instead of driving them."
    },
    href: { ko: "/posts/from-teleoperation-to-supervision", en: "/posts/from-teleoperation-to-supervision" }
  },
  {
    id: "dispatch",
    label: "Dispatch",
    title: { ko: "출동", en: "Dispatch" },
    line: {
      ko: "승인과 함께 로봇이 현장으로 간다. 전시장에서 닷새 동안 실물로 돌린 흐름이다.",
      en: "On approval a robot heads for the spot. The same loop ran on real hardware for five days at an expo."
    },
    href: { ko: "/posts/its-gangneung-booth-retrospective", en: "/posts/its-gangneung-booth-retrospective" }
  },
  {
    id: "return",
    label: "Return",
    title: { ko: "복귀", en: "Return" },
    line: {
      ko: "처리가 끝나면 도크로 돌아온다. 돌아오지 못하는 경우부터 먼저 만들어 본 시뮬레이터가 있다.",
      en: "Once resolved it returns to the dock. A simulator built around the cases where it does not come back."
    },
    href: { ko: "/posts/simulating-failure", en: "/posts/simulating-failure" }
  }
];
