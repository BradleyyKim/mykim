"use client";

import { useState } from "react";
import type { Locale } from "@/i18n";

type Mode = "before" | "after";

interface Node {
  id: string;
  x: number;
  y: number;
  label: Record<Locale, string>;
}

interface Hop {
  id: string;
  from: string;
  to: string;
  before: "wired" | "wireless";
  after: "wired" | "wireless";
  note: Record<Mode, Record<Locale, string>>;
}

const NODES: Node[] = [
  { id: "va", x: 70, y: 150, label: { ko: "영상분석 서버", en: "Video analytics" } },
  { id: "console", x: 250, y: 60, label: { ko: "관제 화면", en: "Console" } },
  { id: "local", x: 430, y: 150, label: { ko: "로봇 플랫폼 로컬 서버", en: "Robot platform (local)" } },
  { id: "ap", x: 610, y: 60, label: { ko: "로봇 AP", en: "Robot AP" } },
  { id: "robot", x: 790, y: 150, label: { ko: "로봇", en: "Robot" } }
];

const HOPS: Hop[] = [
  {
    id: "va-console",
    from: "va",
    to: "console",
    before: "wired",
    after: "wired",
    note: {
      before: {
        ko: "카메라 영상과 이벤트. 같은 스위치에 유선으로 붙어 있어 전시 내내 문제가 없었다.",
        en: "Camera video and events. Wired to the same switch; never an issue during the show."
      },
      after: { ko: "그대로 유선.", en: "Stays wired." }
    }
  },
  {
    id: "console-local",
    from: "console",
    to: "local",
    before: "wireless",
    after: "wired",
    note: {
      before: {
        ko: "토큰 발급, 임무 명령, 로봇 상태가 전부 이 구간을 지난다. 전시장 와이파이 노이즈에 끊기면 화면은 '먹통'으로만 보였다.",
        en: "Tokens, mission commands and robot state all cross this hop. When show-floor Wi-Fi noise cut it, the screen just looked dead."
      },
      after: {
        ko: "로컬 서버와 관제 PC를 한 스위치에 유선으로. 여분 랜선과 스위치를 챙긴다.",
        en: "Local server and console PC wired to one switch. Pack spare cables and a spare switch."
      }
    }
  },
  {
    id: "local-ap",
    from: "local",
    to: "ap",
    before: "wireless",
    after: "wired",
    note: {
      before: {
        ko: "이 구간이 무선이라는 것을 가장 늦게 알았다. 무선이 셋이면 어디서 끊겼는지 알 수 없다.",
        en: "The last hop we realised was wireless. With three wireless hops you cannot tell where it broke."
      },
      after: {
        ko: "로컬 서버를 로봇 AP에 유선으로. 무선은 로봇과 AP 사이 하나만 남긴다.",
        en: "Local server wired to the robot AP. Only one wireless hop remains: AP to robot."
      }
    }
  },
  {
    id: "ap-robot",
    from: "ap",
    to: "robot",
    before: "wireless",
    after: "wireless",
    note: {
      before: {
        ko: "로봇은 움직이므로 여기만은 무선이다. 사람이 AP를 가리면 신호가 떨어졌다.",
        en: "The robot moves, so this hop has to be wireless. People standing in front of the AP dropped the signal."
      },
      after: {
        ko: "설치일에 채널 혼잡도를 재서 가장 빈 채널을 고정한다. AP는 로봇 동선 위, 사람이 가리지 않는 높이에.",
        en: "Measure channel congestion on install day and pin the emptiest one. Mount the AP above the robot's path, out of reach of bodies."
      }
    }
  }
];

interface NetworkHopsProps {
  /** single column — used inside posts where there is no room for a side card */
  stacked?: boolean;
  locale: Locale;
  labels: { before: string; after: string; wired: string; wireless: string };
}

export default function NetworkHops({ locale, labels, stacked = false }: NetworkHopsProps) {
  const [mode, setMode] = useState<Mode>("before");
  const [hopId, setHopId] = useState<string>("console-local");
  const node = (id: string) => NODES.find((n) => n.id === id)!;
  const hop = HOPS.find((h) => h.id === hopId)!;
  const wirelessCount = HOPS.filter((h) => h[mode] === "wireless").length;

  return (
    <div className={`grid gap-5 ${stacked ? "" : "lg:grid-cols-[1fr_minmax(0,22rem)]"}`}>
      <div className="min-w-0">
        <div className="mb-3 flex items-center gap-2">
          <div className="inline-flex rounded-full border border-border p-0.5">
            {(["before", "after"] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                aria-pressed={mode === m}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors duration-1 ${
                  mode === m ? "bg-foreground text-background" : "text-text-2 hover:text-foreground"
                }`}
              >
                {m === "before" ? labels.before : labels.after}
              </button>
            ))}
          </div>
          <span className="mono">
            {labels.wireless} × {wirelessCount}
          </span>
        </div>

        <div className="overflow-x-auto">
        <svg viewBox="0 0 860 210" className="w-full min-w-[640px]" role="img" aria-label="network hops">
          <defs>
            <marker id="hop-dot" viewBox="0 0 6 6" refX="3" refY="3" markerWidth="4" markerHeight="4">
              <circle cx="3" cy="3" r="3" fill="currentColor" />
            </marker>
          </defs>
          {HOPS.map((h) => {
            const a = node(h.from);
            const b = node(h.to);
            const kind = h[mode];
            const on = h.id === hopId;
            const wireless = kind === "wireless";
            return (
              <g key={h.id} className="cursor-pointer" onClick={() => setHopId(h.id)}>
                <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="transparent" strokeWidth="26" />
                <line
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke={wireless ? "hsl(0 70% 55%)" : "hsl(var(--primary))"}
                  strokeWidth={on ? 3 : 2}
                  strokeDasharray={wireless ? "5 7" : undefined}
                  className={wireless ? "flow-line" : ""}
                  opacity={on ? 1 : 0.55}
                  strokeLinecap="round"
                />
                <text
                  x={(a.x + b.x) / 2}
                  y={(a.y + b.y) / 2 - 10}
                  textAnchor="middle"
                  className="mono"
                  fill={wireless ? "hsl(0 70% 55%)" : "hsl(var(--primary))"}
                  style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase" }}
                >
                  {wireless ? labels.wireless : labels.wired}
                </text>
              </g>
            );
          })}
          {NODES.map((n) => (
            <g key={n.id}>
              <circle cx={n.x} cy={n.y} r="22" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="1.5" />
              <circle cx={n.x} cy={n.y} r="6" fill={n.id === "robot" ? "hsl(190 90% 50%)" : "hsl(var(--primary))"} />
              <text
                x={n.x}
                y={n.y + (n.y < 100 ? -34 : 42)}
                textAnchor="middle"
                fill="hsl(var(--foreground))"
                style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.01em" }}
              >
                {n.label[locale]}
              </text>
            </g>
          ))}
        </svg>
        </div>
      </div>

      <div className="surface p-5" aria-live="polite">
        <p className="eyebrow text-primary">
          {node(hop.from).label[locale]} → {node(hop.to).label[locale]}
        </p>
        <p className="mono mt-1">
          {mode === "before" ? labels.before : labels.after} · {hop[mode] === "wireless" ? labels.wireless : labels.wired}
        </p>
        <p className="t-body mt-4">{hop.note[mode][locale]}</p>
      </div>
    </div>
  );
}
