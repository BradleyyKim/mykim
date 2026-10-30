"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowUpRight } from "lucide-react";
import Typewriter from "./Typewriter";
import { HERO_SITES } from "@/lib/sites";
import { getDictionary, getLocalePath, t } from "@/i18n";
import type { Locale } from "@/i18n";

const Globe = dynamic(() => import("./Globe"), { ssr: false });

interface HeroProps {
  locale: Locale;
  stats: { posts: number; tags: number; years: number };
}

export default function Hero({ locale, stats }: HeroProps) {
  const dict = getDictionary(locale);
  const [selected, setSelected] = useState<string | null>(null);
  const site = HERO_SITES.find((s) => s.id === selected) ?? null;
  const words = dict.home.display;

  return (
    <section className="hero-glow">
      <div className="page grid items-center gap-8 py-12 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:py-20">
        <div className="min-w-0">
          <p className="eyebrow fade-up inline-flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
            {t(locale, "home.eyebrow")}
          </p>
          <h1 className="t-display fade-up delay-1 mt-5 text-foreground">
            {words.map((w, i) => (
              <span key={w} className={i === 1 ? "accent-word" : ""}>
                {w}
                {i < words.length - 1 ? " " : ""}
              </span>
            ))}
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

        <div className="relative mx-auto w-full max-w-[26rem] lg:max-w-none">
          <Globe
            sites={HERO_SITES}
            locale={locale}
            selectedId={selected}
            onSelect={(id) => setSelected((cur) => (cur === id ? null : id))}
            lat={30}
            lng={118}
            zoom={0.97}
            idleSpin={1.1}
            className="aspect-square w-full"
          />
          <p className="mono mt-1 text-center text-text-3">{t(locale, "home.globeHint")}</p>

          <div
            className={`surface mt-3 overflow-hidden transition-all duration-3 ease-out ${
              site ? "max-h-56 opacity-100" : "pointer-events-none max-h-0 border-transparent opacity-0"
            } lg:absolute lg:bottom-8 lg:left-0 lg:mt-0 lg:w-[22rem]`}
            aria-live="polite"
          >
            {site ? (
              <div className="p-4">
                <p className="eyebrow text-primary">{site.label[locale]}</p>
                <p className="t-h3 mt-1 text-foreground">{site.title[locale]}</p>
                <p className="t-small mt-1.5">{site.line[locale]}</p>
                {site.href ? (
                  <Link
                    href={getLocalePath(locale, site.href)}
                    className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary link-underline"
                  >
                    {t(locale, "home.globeOpen")}
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
