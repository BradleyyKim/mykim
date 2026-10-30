"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { ArrowDown } from "lucide-react";
import { PROJECT_SITES } from "@/lib/sites";
import { t } from "@/i18n";
import type { Locale } from "@/i18n";
import { pad2 } from "@/lib/format";

const Globe = dynamic(() => import("@/components/home/Globe"), { ssr: false });

export interface GlobeProject {
  id: string;
  name: string;
}

interface ProjectGlobeProps {
  locale: Locale;
  /** career projects in display order; only those with a site get a row */
  projects: GlobeProject[];
  /** scroll to the project card and expand it */
  onOpen: (projectId: string) => void;
}

/**
 * Where each career project actually ran, as one wide card: the site description on the
 * left, the globe in the middle, the project list on the right. Picking a marker or a row only
 * changes what the left panel shows; the single "open project" button is what jumps to the card.
 * On narrow screens the three panels stack: globe, description, list.
 */
export default function ProjectGlobe({ locale, projects, onOpen }: ProjectGlobeProps) {
  const rows = useMemo(() => projects.filter((p) => PROJECT_SITES.some((s) => s.projectId === p.id)), [projects]);
  const [siteId, setSiteId] = useState<string>(PROJECT_SITES[0].id);
  const site = PROJECT_SITES.find((s) => s.id === siteId) ?? PROJECT_SITES[0];
  const project = rows.find((p) => p.id === site.projectId);
  const siblings = PROJECT_SITES.filter((s) => s.projectId === site.projectId);

  const pickProject = (id: string) => {
    const first = PROJECT_SITES.find((s) => s.projectId === id);
    if (first) setSiteId(first.id);
  };

  return (
    <div className="surface grid overflow-hidden lg:grid-cols-[19rem_minmax(0,1fr)_19rem]">
      {/* globe — first on mobile, centre on desktop */}
      <div className="relative order-1 min-w-0 bg-[radial-gradient(60%_60%_at_50%_45%,hsl(var(--glow)/0.12),transparent_70%)] lg:order-2">
        <Globe
          sites={PROJECT_SITES}
          locale={locale}
          selectedId={siteId}
          onSelect={setSiteId}
          lat={30}
          lng={117}
          zoom={0.97}
          idleSpin={0.8}
          compactBelow={420}
          className="aspect-[4/3] w-full sm:aspect-[16/11] lg:aspect-auto lg:h-full lg:min-h-[32rem]"
        />
      </div>

      {/* site description — the one way into the project card */}
      <div className="order-2 flex flex-col border-t border-border p-6 lg:order-1 lg:border-r lg:border-t-0" aria-live="polite">
        <p className="eyebrow">{t(locale, "showcase.globe.hint")}</p>
        <div className="mt-6 flex-1">
          {project ? <p className="eyebrow text-primary">{project.name}</p> : null}
          <p className="t-h2 mt-2 text-foreground">{site.title[locale]}</p>
          <p className="t-small mt-3">{site.line[locale]}</p>
          {siblings.length > 1 ? (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {siblings.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSiteId(s.id)}
                  aria-pressed={s.id === site.id}
                  className={`chip transition-colors duration-1 ${s.id === site.id ? "border-primary text-primary" : "hover:border-primary/50"}`}
                >
                  {s.label.en}
                </button>
              ))}
            </div>
          ) : null}
        </div>
        {site.projectId ? (
          <button
            type="button"
            onClick={() => onOpen(site.projectId!)}
            className="mt-8 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-[0_8px_24px_-12px_hsl(var(--glow)/0.8)] transition-all duration-2 ease-soft hover:-translate-y-0.5 hover:opacity-95"
          >
            {t(locale, "career.openProject")}
            <ArrowDown className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      {/* project list */}
      <div className="order-3 border-t border-border p-4 lg:border-l lg:border-t-0">
        <p className="eyebrow px-2 pb-3 pt-2">
          {pad2(rows.length)} {t(locale, "home.items")}
        </p>
        <ol className="grid grid-cols-2 gap-1 lg:grid-cols-1">
          {rows.map((p, i) => {
            const on = p.id === site.projectId;
            const n = PROJECT_SITES.filter((s) => s.projectId === p.id).length;
            return (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => pickProject(p.id)}
                  aria-pressed={on}
                  className={`row-hover flex w-full items-center gap-3 rounded-md px-2 py-2 text-left transition-colors duration-1 ${
                    on ? "bg-primary/10" : ""
                  }`}
                >
                  <span className={`mono w-5 shrink-0 ${on ? "text-primary" : "text-text-3"}`}>{pad2(i + 1)}</span>
                  <span className={`min-w-0 flex-1 truncate text-sm font-medium ${on ? "text-primary" : "text-foreground"}`}>{p.name}</span>
                  <span className="mono shrink-0 text-text-3">×{n}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
