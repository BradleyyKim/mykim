"use client";

import { useState } from "react";
import type { Locale } from "@/i18n";

interface Stage {
  id: string;
  label: Record<Locale, string>;
  actor: Record<Locale, string>;
  what: Record<Locale, string>;
  learned: Record<Locale, string>;
  human?: boolean;
}

const STAGES: Stage[] = [
  {
    id: "detect",
    label: { ko: "검지", en: "Detect" },
    actor: { ko: "카메라", en: "Camera" },
    what: {
      ko: "카메라가 통제구역 침입을 잡는다. 온디바이스 검지라 인터넷이 끊겨도 돈다.",
      en: "A camera catches an intrusion into a restricted zone. Detection runs on device, so it survives a dead internet link."
    },
    learned: {
      ko: "두 번째 관람객부터 침입이 안 잡히던 적이 있다. 미처리 이벤트를 지키던 가드가 다음 검지를 막고 있었다.",
      en: "Once, the second visitor stopped being detected. A guard protecting the unhandled event was blocking the next one."
    }
  },
  {
    id: "board",
    label: { ko: "상황판", en: "Board" },
    actor: { ko: "관제 화면", en: "Console" },
    what: {
      ko: "이벤트가 상황판에 뜬다. 화면은 지금 상태만 말한다.",
      en: "The event lands on the board. The screen reports the present state only."
    },
    learned: {
      ko: "다시 붙었는데 몇 분 전 오류가 계속 떠 있던 날이 있다. 성공하면 마지막 오류를 지운다는 규칙이 그때 생겼다.",
      en: "One day the link was back but an error from minutes earlier stayed on screen. Now a success clears the last error."
    }
  },
  {
    id: "approve",
    label: { ko: "승인", en: "Approve" },
    actor: { ko: "사람", en: "Operator" },
    human: true,
    what: {
      ko: "사람이 배차를 승인해야 로봇이 나간다. 자동 출동 경로가 생기면 테스트가 막는다.",
      en: "A person approves the dispatch before anything moves. A test fails the build if an automatic path appears."
    },
    learned: {
      ko: "자동 출동 로직이 열일곱 분 동안 실물 로봇에 임무 예순여덟 건을 보낸 사고가 있었다. 승인 버튼은 그 뒤에 생겼다.",
      en: "Automatic dispatch once sent sixty-eight missions to a real robot in seventeen minutes. The approve button came after."
    }
  },
  {
    id: "dispatch",
    label: { ko: "출동", en: "Dispatch" },
    actor: { ko: "게이트웨이", en: "Gateway" },
    what: {
      ko: "게이트웨이가 지정 업무 하나를 로봇 플랫폼에 보낸다. 타임아웃, 한 번의 재시도, 회로 차단기.",
      en: "The gateway sends one saved task to the robot platform. Timeout, a single retry, a circuit breaker."
    },
    learned: {
      ko: "거부된 키로 2초마다 토큰을 두드려 상대 서버를 잠근 적이 있다. 401은 재시도로 풀리지 않는다. 두 번 거부되면 멈춘다.",
      en: "A rejected key hammered the token endpoint every two seconds and locked the partner's server. A 401 is not retryable; two rejections and it stops."
    }
  },
  {
    id: "onscene",
    label: { ko: "현장 확인", en: "On scene" },
    actor: { ko: "로봇", en: "Robot" },
    what: {
      ko: "로봇 카메라 네 채널이 상황판에 붙는다. 전면, 후면, 열화상, PTZ.",
      en: "Four robot cameras attach to the board: front, rear, thermal, PTZ."
    },
    learned: {
      ko: "원격 테스트에서 세 채널은 패킷 손실 20~25%로 프레임이 하나도 오지 않았다. 640×480 열화상만 살아남았다.",
      en: "In a remote test three channels lost 20–25% of packets and assembled no frames at all. Only the 640×480 thermal feed survived."
    }
  },
  {
    id: "return",
    label: { ko: "복귀", en: "Return" },
    actor: { ko: "로봇", en: "Robot" },
    what: {
      ko: "복귀가 끝날 때까지 상황판을 유지하고 종료 버튼을 잠근다. 비상정지만 살려 둔다.",
      en: "The board stays up until the return completes and the end button is locked. Only emergency stop stays live."
    },
    learned: {
      ko: "미니맵의 복귀는 시간 기준이라 도킹에 실패해도 '복귀 완료'로 끝났다. 실제 도킹 상태로 그리는 것이 다음 숙제다.",
      en: "The minimap's return is time-based, so a failed docking still ended as 'returned'. Drawing it from real dock state is next."
    }
  }
];

interface DispatchFlowProps {
  /** single column — used inside posts where there is no room for a side card */
  stacked?: boolean;
  locale: Locale;
  labels: { what: string; learned: string };
}

export default function DispatchFlow({ locale, labels, stacked = false }: DispatchFlowProps) {
  const [active, setActive] = useState(2);
  const stage = STAGES[active];

  return (
    <div className={`grid gap-5 ${stacked ? "" : "lg:grid-cols-[1fr_minmax(0,22rem)]"}`}>
      <div className="min-w-0">
        <ol className="relative flex items-stretch gap-2 overflow-x-auto pb-2 sm:gap-3">
          {STAGES.map((s, i) => {
            const on = i === active;
            const done = i < active;
            return (
              <li key={s.id} className="flex min-w-[6.5rem] flex-1 items-center">
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  aria-pressed={on}
                  className={`surface relative w-full px-3 py-3 text-left transition-all duration-2 ease-soft ${
                    on ? "border-primary shadow-[0_0_0_3px_hsl(var(--primary)/0.15)]" : done ? "border-primary/40" : "hover:border-primary/40"
                  }`}
                >
                  <span className="mono block text-text-3">{String(i + 1).padStart(2, "0")}</span>
                  <span className={`mt-0.5 block text-sm font-semibold ${on ? "text-primary" : "text-foreground"}`}>{s.label[locale]}</span>
                  <span className="mono mt-1 block">{s.actor[locale]}</span>
                  {s.human ? (
                    <span className="absolute -top-2 right-2 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
                      {locale === "en" ? "human" : "사람"}
                    </span>
                  ) : null}
                </button>
                {i < STAGES.length - 1 ? (
                  <svg className="mx-1 hidden h-3 w-5 shrink-0 text-text-3 sm:block" viewBox="0 0 20 12" aria-hidden="true">
                    <line x1="0" y1="6" x2="20" y2="6" stroke="currentColor" strokeWidth="1.5" className={i < active ? "flow-line" : ""} />
                    <path d="M14 1 L19 6 L14 11" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                ) : null}
              </li>
            );
          })}
        </ol>
      </div>

      <div className="surface p-5" aria-live="polite">
        <p className="eyebrow text-primary">
          {String(active + 1).padStart(2, "0")} · {stage.label[locale]}
        </p>
        <p className="eyebrow mt-4">{labels.what}</p>
        <p className="t-body mt-1">{stage.what[locale]}</p>
        <p className="eyebrow mt-4">{labels.learned}</p>
        <p className="t-body mt-1">{stage.learned[locale]}</p>
      </div>
    </div>
  );
}
