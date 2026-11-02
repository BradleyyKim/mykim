"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowUpRight } from "lucide-react";
import Typewriter from "./Typewriter";
import { SCENE_STEPS } from "@/lib/scene";
import type { Stage } from "@/lib/three/controlScene";
import { getDictionary, getLocalePath, t } from "@/i18n";
import type { Locale } from "@/i18n";

const ControlScene = dynamic(() => import("./ControlScene"), { ssr: false });

interface HeroProps {
  locale: Locale;
  stats: { posts: number; tags: number; years: number };
}

export default function Hero({ locale, stats }: HeroProps) {
  const dict = getDictionary(locale);
  const [stage, setStage] = useState<Stage>("detect");
  const step = SCENE_STEPS.find((s) => s.id === stage) ?? SCENE_STEPS[0];
  const href = step.href[locale];
  const { before, accent, after } = dict.home.headline;

  /** `\n` in the headline strings is a forced line break */
  const lines = (s: string) =>
    s.split("\n").map((part, i, arr) => (
      <span key={i}>
        {part}
        {i < arr.length - 1 ? <br /> : null}
      </span>
    ));

  return (
    <section className="hero-glow">
      <div className="page grid items-center gap-8 py-12 sm:py-16 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12 lg:py-20">
        <div className="min-w-0">
          <p className="eyebrow fade-up inline-flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
            {t(locale, "home.eyebrow")}
          </p>
          <h1 className="t-display fade-up delay-1 mt-5 text-foreground">
            {lines(before)}
            <span className="accent-word">{accent}</span>
            {lines(after)}
          </h1>
          <Typewriter phrases={dict.home.typed} className="t-lead fade-up delay-2 mt-6 min-h-[2lh] max-w-[52ch]" />

          <dl className="fade-up delay-3 mt-8 flex gap-8">
            {[
              [stats.posts, t(locale, "home.statPosts")],
              [stats.tags, t(locale, "home.statTags")],
              [stats.years, t(locale, "home.statYears")]
            ].map(([n, label]) => (
              <div key={String(label)}>
                <dt className="eyebrow order-2">{label}</dt>
                <dd className="num text-2xl font-semibold tracking-tight text-foreground">{String(n).padStart(2, "0")}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mx-auto w-full max-w-[30rem] lg:max-w-none">
          <ControlScene stage={stage} onStage={setStage} className="aspect-[5/4] w-full sm:aspect-[16/10]" />
          <p className="mono mt-1 text-center text-text-3">{t(locale, "home.sceneHint")}</p>

          {/* current step — the one way from the scene into a post */}
          <div className="surface mt-3 p-4 lg:grid lg:grid-cols-[7.5rem_1fr_auto] lg:items-center lg:gap-6" aria-live="polite">
            <div>
              <p className="eyebrow text-primary">
                {String(SCENE_STEPS.indexOf(step) + 1).padStart(2, "0")} · {step.label}
              </p>
              <p className="t-h3 mt-1 text-foreground">{step.title[locale]}</p>
            </div>
            <p className="t-small mt-1.5 min-h-[3lh] lg:mt-0 lg:min-h-[2lh]">{step.line[locale]}</p>
            {href ? (
              <Link
                href={getLocalePath(locale, href)}
                className="mt-3 inline-flex items-center gap-1 whitespace-nowrap text-sm font-medium text-primary link-underline lg:mt-0"
              >
                {t(locale, "home.sceneOpen")}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            ) : (
              <span className="hidden lg:block" aria-hidden="true" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
