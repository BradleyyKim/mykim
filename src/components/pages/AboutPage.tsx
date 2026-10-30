"use client";

import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { MAIN } from "@/lib/constants";
import Image from "next/image";
import { useEffect } from "react";
import type { Locale } from "@/i18n";
import { getLocalePath } from "@/i18n";

interface AboutPageProps {
  locale: Locale;
}

const content = {
  en: [
    "I tend to reflect deeply on the **purpose** and **underlying reason** behind everything I do.",
    "Rather than simply executing tasks, I value the process of asking myself **why this work matters** and **what kind of value it can create**—both for users and for the team.",
    "I started from the screen (**frontend**), grew through servers, databases, and deployment (**full-stack**), and now my work is **turning ideas into products that actually run in production**—a **Product Engineer**. Not just building things, but keeping them alive with an operator's discipline.",
    "As a team, we believe that in order to carefully design and experiment with **truly user-centered interfaces**, it's essential to have a **stable and trustworthy foundation in place**.",
    "The same applies to life. When our **inner foundation** is solid, we can move forward with **greater clarity and resilience**."
  ],
  ko: [
    "저는 어떤 일이든 그 **목적**과 **본질적인 이유**를 고민하는 편입니다.",
    "단순히 실행하는 것보다, **왜 이 작업이 필요한지**, 그리고 그것이 **어떤 의미와 가치를 만들어낼 수 있는지**를 끊임없이 자문하고 정리하는 과정을 중요하게 생각합니다.",
    "화면(**프론트엔드**)에서 시작해 서버·DB·배포(**풀스택**)를 지나, 지금은 **아이디어를 실제 운영되는 제품으로 만드는 일(Product Engineer)**을 합니다. 짓는 데서 멈추지 않고, 지은 것을 지키는 규율까지가 제 일이라고 생각합니다.",
    "팀이 **사용자 경험 중심의 인터페이스**를 정교하게 설계하고 실험하려면, **안정적이고 신뢰할 수 있는 기반(foundation)**이 필요하다고 믿습니다.",
    "삶도 마찬가지입니다. **나를 지탱하는 내면의 기반이 단단할수록**, 더 **깊고 의미 있는 방향**으로 움직일 수 있다고 생각합니다."
  ]
};

// 성장 아크 — Frontend → Full-stack → Product Engineer (Anthropic Boris Cherny의 미래 직무 분류 참조)
const growthArc = {
  ko: {
    heading: "Frontend → Full-stack → Product Engineer",
    stages: [
      {
        label: "Frontend",
        period: "2022 –",
        description: "화면과 사용자 경험에서 시작 — 관제 대시보드, 지도 플랫폼, 디자인 시스템."
      },
      {
        label: "Full-stack",
        period: "2026 –",
        description: "DB 스키마·인증·배포 인프라·장애 대응까지 — 한 서비스의 전 구간을 단독 담당."
      },
      {
        label: "Product Engineer",
        period: "현재",
        description:
          "아이디어를 실제 운영되는 제품으로 — 기획·구현·배포·운영·확산까지 제품 단위로 완결. 짓는 것에서 멈추지 않고 런북·백업·모니터링으로 지키는 규율까지."
      }
    ],
    note: '풀스택이 "전 구간을 다룰 수 있다"는 범위의 말이라면, Product Engineer는 "제품이 실제로 돌아가게 책임진다"는 결과의 말입니다. Anthropic의 Boris Cherny가 제시한 다섯 직무(Prototyper · Builder · Sweeper · Grower · Maintainer) 중 Builder에 가깝고, 저는 Maintainer의 규율을 가진 Builder를 지향합니다.'
  },
  en: {
    heading: "Frontend → Full-stack → Product Engineer",
    stages: [
      {
        label: "Frontend",
        period: "2022 –",
        description: "Started from screens and UX — monitoring dashboards, map platforms, design systems."
      },
      {
        label: "Full-stack",
        period: "2026 –",
        description: "DB schema, auth, deploy infra, incident response — owning every layer of a service alone."
      },
      {
        label: "Product Engineer",
        period: "now",
        description:
          "Turning ideas into products that actually run in production — planning, building, shipping, operating, and scaling as one complete unit, kept alive by runbooks, backups, and monitoring."
      }
    ],
    note: 'Full-stack describes a range — being able to touch every layer. Product Engineer describes an outcome — being responsible for the product actually running. It maps closest to the Builder among the five future roles proposed by Boris Cherny of Anthropic (Prototyper · Builder · Sweeper · Grower · Maintainer); I aim to be a Builder with a Maintainer’s discipline.'
  }
};

// 일하는 방식 — 두 달간의 AI 페어링 세션 로그를 역분석해 도출, 경력 전체를 관통하는 원칙으로 일반화
const workStyle = {
  ko: {
    heading: "How I Work",
    items: [
      {
        title: "완결의 단위로 일한다",
        description:
          "\"구현이 끝난 코드\"가 아니라 \"사용자 손에서 돌아가는 제품\"을 작업의 단위로 봅니다. 기능을 만들면 배포·문서·사용 안내·피드백 회수까지 한 사이클을 닫고, 그 피드백이 다음 버전의 입력이 되게 합니다. 화면 하나를 만들 때도, 서비스 전체를 운영할 때도 같은 원칙입니다."
      },
      {
        title: "변경을 경계 안에 가둔다",
        description:
          "외부 API·지도 SDK·데이터 출처처럼 언젠가 바뀔 것들은 어댑터와 변환 계층 뒤로 격리하고, 색·상태·표기처럼 여러 화면에 퍼지는 것들은 단일 정의에서 파생시킵니다. 스펙이 바뀌어도 수정 지점이 한 곳으로 모이는 구조 — 개발 속도와 유지보수의 단순함은 여기서 나온다고 믿습니다."
      },
      {
        title: "사고를 제도화한다",
        description:
          "장애와 실수를 사람의 부주의가 아니라 절차의 구멍으로 봅니다. 한 번 겪은 문제는 런북 규칙·체크리스트·복구 리허설로 바꿔 같은 사고가 구조적으로 재발할 수 없게 만듭니다. 문서는 기록이 아니라 재발 방지 장치라고 생각합니다."
      },
      {
        title: "AI를 공정에 넣되, 책임은 사람에게",
        description:
          "시안·구현·문서·운영까지 AI 페어링을 숨기지 않는 공개된 방법론으로 씁니다. 대신 방향 결정·아키텍처 판단·최종 검증은 언제나 사람의 몫으로 남깁니다. 도구가 빨라질수록 원리를 이해하고 추측 대신 측정으로 확인하는 습관이 더 중요해진다고 믿습니다."
      }
    ],
    footnote: "이 섹션은 두 달간의 Claude Code 세션 기록을 AI에게 역으로 분석시켜 도출했습니다.",
    footnoteLink: { label: "분석 과정 읽기", href: "/posts/what-claude-code-thinks-of-me" }
  },
  en: {
    heading: "How I Work",
    items: [
      {
        title: "Working in units of completion",
        description:
          "My unit of work is not \"code that compiles\" but \"a product running in users' hands.\" Every feature closes a full cycle — ship, document, announce, collect feedback — and that feedback becomes the input for the next version. The same principle applies whether I'm building a single screen or operating an entire service."
      },
      {
        title: "Containing change behind boundaries",
        description:
          "Things that will eventually change — external APIs, map SDKs, data sources — get isolated behind adapters and conversion layers; things that spread across screens — colors, states, labels — derive from a single definition. When specs change, the fix converges to one place. I believe that is where development speed and maintainability actually come from."
      },
      {
        title: "Turning incidents into process",
        description:
          "I treat failures as process gaps, not personal carelessness. Every problem I hit once becomes a runbook rule, a checklist, or a restore rehearsal, so the same incident structurally cannot recur. Documentation, to me, is not a record — it is a prevention mechanism."
      },
      {
        title: "AI in the pipeline, accountability with humans",
        description:
          "From design drafts to implementation, docs, and operations, AI pairing is an open methodology I don't hide. But direction, architectural judgment, and final verification always stay human. The faster the tools get, the more it matters to understand the underlying principles and verify by measurement instead of guessing."
      }
    ],
    footnote: "This section was distilled by asking the AI to analyze two months of my Claude Code session logs.",
    footnoteLink: { label: "Read the analysis", href: "/posts/what-claude-code-thinks-of-me" }
  }
};

export default function AboutPage({ locale }: AboutPageProps) {
  useEffect(() => {
    document.title = `About - MYKim`;
  }, []);

  const arc = growthArc[locale];
  const ws = workStyle[locale];

  return (
    <div className="page py-10 sm:py-14">
      <div className="mx-auto max-w-[56rem]">
        {/* Header */}
        <header className="grid gap-6 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <p className="eyebrow">{MAIN.bio.duty}</p>
            <h1 className="t-title mt-3 text-foreground">{MAIN.author_en}</h1>
            <p className="mono mt-3">{MAIN.bio.location}</p>
          </div>
          <div className="flex gap-1">
            {[
              { href: `mailto:${MAIN.social.email}`, label: "Email", node: <Mail className="h-4 w-4" /> },
              {
                href: MAIN.social.github,
                label: "GitHub",
                node: <Image src="/images/icons/github.svg" alt="" width={16} height={16} className="h-4 w-4 dark:invert" />
              },
              {
                href: MAIN.social.linkedin,
                label: "LinkedIn",
                node: <Image src="/images/icons/linkedin.svg" alt="" width={16} height={16} className="h-4 w-4" />
              }
            ].map((l) => (
              <Link
                key={l.label}
                href={l.href}
                target={l.href.startsWith("http") ? "_blank" : undefined}
                rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
                aria-label={l.label}
                className="surface inline-flex h-10 w-10 items-center justify-center text-text-2 transition-colors duration-1 hover:border-primary/50 hover:text-foreground"
              >
                {l.node}
              </Link>
            ))}
          </div>
        </header>

        {/* Intro */}
        <section className="mt-12 space-y-4">
          {content[locale].map((text, index) => (
            <p
              key={index}
              className="t-lead [&_strong]:font-semibold [&_strong]:text-foreground"
              dangerouslySetInnerHTML={{ __html: text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }}
            />
          ))}
        </section>

        {/* Growth arc */}
        <section className="mt-16">
          <p className="eyebrow mb-2">01</p>
          <div className="section-head mb-6">
            <h2 className="t-h1 text-foreground">{arc.heading}</h2>
          </div>
          <ol className="grid gap-3 md:grid-cols-3">
            {arc.stages.map((stage, index) => {
              const last = index === arc.stages.length - 1;
              return (
                <li key={index} className={`surface relative p-5 ${last ? "border-primary/60 bg-primary/5" : ""}`}>
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className={`t-h3 ${last ? "text-primary" : "text-foreground"}`}>{stage.label}</h3>
                    <span className="mono">{stage.period}</span>
                  </div>
                  <p className="t-small mt-2">{stage.description}</p>
                  {!last ? (
                    <span className="absolute -right-4 top-1/2 hidden -translate-y-1/2 text-text-3 md:block" aria-hidden="true">
                      →
                    </span>
                  ) : null}
                </li>
              );
            })}
          </ol>
          <p className="t-small mt-4">{arc.note}</p>
        </section>

        {/* How I work */}
        <section className="mt-16">
          <p className="eyebrow mb-2">02</p>
          <div className="section-head mb-6">
            <h2 className="t-h1 text-foreground">{ws.heading}</h2>
          </div>
          <ol className="grid gap-3 md:grid-cols-2">
            {ws.items.map((item, index) => (
              <li key={index} className="surface p-5">
                <p className="mono mb-2">{String(index + 1).padStart(2, "0")}</p>
                <h3 className="t-h3 text-foreground">{item.title}</h3>
                <p className="t-small mt-2">{item.description}</p>
              </li>
            ))}
          </ol>
          <p className="t-small mt-4">
            {ws.footnote}{" "}
            <Link href={getLocalePath(locale, ws.footnoteLink.href)} className="text-primary link-underline">
              {ws.footnoteLink.label}
            </Link>
          </p>
        </section>

        {/* Portfolio */}
        <section className="mt-16 flex flex-col items-start gap-2">
          <Link
            href={getLocalePath(locale, "/career")}
            className="inline-flex h-11 items-center gap-2 rounded-md bg-foreground px-5 text-sm font-semibold text-background transition-opacity duration-1 hover:opacity-90"
          >
            Portfolio
            <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="t-small">
            {locale === "en" ? "Project details, interactive demos, and the PDF résumé" : "프로젝트 상세 · 인터랙티브 데모 · PDF 이력서"}
          </p>
        </section>
      </div>
    </div>
  );
}
