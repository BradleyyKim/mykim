"use client";

import DispatchFlow from "@/components/showcase/DispatchFlow";
import NetworkHops from "@/components/showcase/NetworkHops";
import { t } from "@/i18n";
import type { Locale } from "@/i18n";

export type InteractiveName = "dispatch-flow" | "network-hops";

interface PostInteractiveProps {
  name: string;
  locale: Locale;
}

/**
 * Interactive figure inside a post. Authored in MDX as
 * `<div data-interactive="dispatch-flow"></div>` on its own line; `PostDetail` maps that div here.
 * Unknown names render nothing so a typo never breaks the page.
 */
export default function PostInteractive({ name, locale }: PostInteractiveProps) {
  const ko = locale === "ko";
  let body: React.ReactNode = null;
  let key: "dispatch" | "network" | null = null;

  if (name === "dispatch-flow") {
    key = "dispatch";
    body = <DispatchFlow locale={locale} stacked labels={{ what: ko ? "무엇이 일어나나" : "What happens", learned: ko ? "실제로 겪은 것" : "What actually happened" }} />;
  } else if (name === "network-hops") {
    key = "network";
    body = (
      <NetworkHops
        locale={locale}
        stacked
        labels={{
          before: ko ? "이번 전시" : "This show",
          after: ko ? "다음 전시" : "Next show",
          wired: ko ? "유선" : "wired",
          wireless: ko ? "무선" : "wireless"
        }}
      />
    );
  }
  if (!key) return null;

  return (
    <figure className="not-prose post-interactive">
      <figcaption className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
        <span className="text-sm font-semibold text-foreground">{t(locale, `showcase.${key}.title`)}</span>
        <span className="eyebrow shrink-0">{t(locale, `showcase.${key}.hint`)}</span>
      </figcaption>
      {body}
    </figure>
  );
}
