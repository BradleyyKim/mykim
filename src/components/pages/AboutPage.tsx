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
    "I started from the screen (**frontend**), grew through servers, databases, and deployment (**full-stack**), and now my work is **turning ideas into products that actually run in production**—a **Builder**. Not just building things, but keeping them alive with an operator's discipline.",
    "As a team, we believe that in order to carefully design and experiment with **truly user-centered interfaces**, it's essential to have a **stable and trustworthy foundation in place**.",
    "The same applies to life. When our **inner foundation** is solid, we can move forward with **greater clarity and resilience**."
  ],
  ko: [
    "저는 어떤 일이든 그 **목적**과 **본질적인 이유**를 고민하는 편입니다.",
    "단순히 실행하는 것보다, **왜 이 작업이 필요한지**, 그리고 그것이 **어떤 의미와 가치를 만들어낼 수 있는지**를 끊임없이 자문하고 정리하는 과정을 중요하게 생각합니다.",
    "화면(**프론트엔드**)에서 시작해 서버·DB·배포(**풀스택**)를 지나, 지금은 **아이디어를 실제 운영되는 제품으로 만드는 일(Builder)**을 합니다. 짓는 데서 멈추지 않고, 지은 것을 지키는 규율까지가 제 일이라고 생각합니다.",
    "팀이 **사용자 경험 중심의 인터페이스**를 정교하게 설계하고 실험하려면, **안정적이고 신뢰할 수 있는 기반(foundation)**이 필요하다고 믿습니다.",
    "삶도 마찬가지입니다. **나를 지탱하는 내면의 기반이 단단할수록**, 더 **깊고 의미 있는 방향**으로 움직일 수 있다고 생각합니다."
  ]
};

// 성장 아크 — Frontend → Full-stack → Builder (Anthropic Boris Cherny의 미래 직무 분류 참조)
const growthArc = {
  ko: {
    heading: "Frontend → Full-stack → Builder",
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
        label: "Builder",
        period: "현재",
        description:
          "아이디어를 실제 운영되는 제품으로 — 기획·구현·배포·운영·확산까지 제품 단위로 완결. 짓는 것에서 멈추지 않고 런북·백업·모니터링으로 지키는 규율까지."
      }
    ],
    note: 'Builder는 Anthropic의 Boris Cherny가 제시한 미래의 다섯 직무(Prototyper · Builder · Sweeper · Grower · Maintainer) 중 "아이디어를 진짜 제품으로 만들어내는 사람"입니다. 저는 Maintainer의 규율을 가진 Builder를 지향합니다.'
  },
  en: {
    heading: "Frontend → Full-stack → Builder",
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
        label: "Builder",
        period: "now",
        description:
          "Turning ideas into products that actually run in production — planning, building, shipping, operating, and scaling as one complete unit, kept alive by runbooks, backups, and monitoring."
      }
    ],
    note: '"Builder" is one of the five future roles proposed by Boris Cherny of Anthropic (Prototyper · Builder · Sweeper · Grower · Maintainer) — the one who turns ideas into real products. I aim to be a Builder with a Maintainer’s discipline.'
  }
};

// 일하는 방식 — 두 달간의 AI 페어링 세션 로그를 역으로 분석해 도출한 작업 패턴
const workStyle = {
  ko: {
    heading: "How I Work",
    items: [
      {
        title: "배포는 기능이 아니라 사이클 단위",
        description:
          "구현에서 멈추지 않고 변경 내역·사용 매뉴얼·사용자 공지·피드백 답글까지 닫아야 한 번의 배포로 칩니다. 실서비스 10영업일 10릴리스 동안 이 사이클을 유지했습니다."
      },
      {
        title: "사고를 제도화한다",
        description:
          "장애와 실수는 사람 탓이 아니라 절차의 구멍으로 봅니다. 배포 순서 신호 규칙, 기능 간 파급 지도, 백업 복원 리허설 — 한 번 겪은 문제는 런북 규칙으로 바꿔 재발을 구조적으로 차단합니다."
      },
      {
        title: "원리까지 소유한다",
        description:
          "도구를 쓰면 왜 그렇게 동작하는지까지 파고듭니다. 네트워크 경로는 추측 대신 실측하고, 발표 자료에는 재현 가능한 사실만 싣습니다."
      },
      {
        title: "AI는 공정의 일부",
        description:
          "시안·구현·문서·운영까지 AI 페어링을 숨기지 않는 공개된 방법론으로 씁니다. 대신 방향 결정과 최종 검증은 언제나 사람의 몫으로 남깁니다."
      }
    ],
    footnote: "이 섹션은 두 달간의 Claude Code 세션 기록을 AI에게 역으로 분석시켜 도출했습니다.",
    footnoteLink: { label: "분석 과정 읽기", href: "/posts/what-claude-code-thinks-of-me" }
  },
  en: {
    heading: "How I Work",
    items: [
      {
        title: "A release is a cycle, not a feature",
        description:
          "Implementation alone doesn't count — changelog, user manual, release notice, and feedback replies close the loop. I kept that cycle through 10 releases in 10 business days on a live service."
      },
      {
        title: "Turning incidents into process",
        description:
          "Failures are process gaps, not people problems. Deploy-order signal rules, a feature-dependency map, backup restore rehearsals — every incident becomes a runbook rule that structurally prevents recurrence."
      },
      {
        title: "Owning the why",
        description:
          "When I adopt a tool, I dig into how it actually works. Network paths get measured instead of guessed, and presentation claims are limited to reproducible facts."
      },
      {
        title: "AI as part of the pipeline",
        description:
          "From design drafts to implementation, docs, and operations, AI pairing is an open methodology I don't hide — while direction and final verification always stay human."
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
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header + 프로필 (사진 없이 텍스트 중심) */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">About</h1>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3">{MAIN.author_en}</h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 font-medium mb-1">{MAIN.bio.duty}</p>
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-6">{MAIN.bio.location}</p>
            <div className="flex justify-center space-x-4">
              <Link
                href={`mailto:${MAIN.social.email}`}
                className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 border border-gray-200 dark:border-gray-700"
                title="Email"
              >
                <Mail className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </Link>
              <Link
                href={MAIN.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 border border-gray-200 dark:border-gray-700"
                title="GitHub"
              >
                <Image src="/images/icons/github.svg" alt="GitHub" width={20} height={20} className="w-5 h-5" />
              </Link>
              <Link
                href={MAIN.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 border border-gray-200 dark:border-gray-700"
                title="LinkedIn"
              >
                <Image src="/images/icons/linkedin.svg" alt="LinkedIn" width={20} height={20} className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* 소개 문단 */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg mb-12">
            <div className="space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              {content[locale].map((text, index) => (
                <p
                  key={index}
                  className="text-lg"
                  dangerouslySetInnerHTML={{ __html: text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }}
                />
              ))}
            </div>
          </div>

          {/* 성장 아크 — Frontend → Full-stack → Builder */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">{arc.heading}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {arc.stages.map((stage, index) => (
                <div
                  key={index}
                  className={`relative border rounded-lg p-5 ${
                    index === arc.stages.length - 1
                      ? "border-blue-400 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                  }`}
                >
                  <div className="flex items-baseline justify-between mb-2">
                    <h3 className="text-md font-semibold text-gray-800 dark:text-gray-100">{stage.label}</h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{stage.period}</span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{stage.description}</p>
                  {index < arc.stages.length - 1 && (
                    <span className="hidden md:block absolute -right-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-lg z-10">
                      →
                    </span>
                  )}
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{arc.note}</p>
          </div>

          {/* 일하는 방식 */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">{ws.heading}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ws.items.map((item, index) => (
                <div
                  key={index}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-5 bg-gray-50 dark:bg-gray-800"
                >
                  <h3 className="text-md font-semibold text-gray-800 dark:text-gray-100 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              {ws.footnote}{" "}
              <Link
                href={ws.footnoteLink.href}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline underline-offset-2"
              >
                {ws.footnoteLink.label}
              </Link>
            </p>
          </div>

          {/* Portfolio 이동 */}
          <div className="text-center">
            <Link
              href={getLocalePath(locale, "/career")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium shadow-sm"
            >
              Portfolio
              <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
              {locale === "en"
                ? "Project details, achievements, and tech stacks"
                : "프로젝트 상세 · 성과 · 기술 스택 보기"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
