"use client";

import { useCallback, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown, Download, ExternalLink, Eye } from "lucide-react";
import { toast } from "sonner";
import type { Company } from "@/components/pages/CareerPage";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import ProjectGlobe from "@/components/showcase/ProjectGlobe";
import { generateClientPDF, previewPDF } from "@/lib/media";
import { t } from "@/i18n";
import type { Locale } from "@/i18n";
import { pad2 } from "@/lib/format";

interface CareerPageClientProps {
  careerData: Company[];
  careerDataEn: Company[];
}

export default function CareerPageClient({ careerData, careerDataEn }: CareerPageClientProps) {
  const pathname = usePathname();
  const locale: Locale = pathname.startsWith("/en") ? "en" : "ko";
  const [open, setOpen] = useState<Set<string>>(() => new Set(["0-0"]));

  const toggle = (key: string) =>
    setOpen((cur) => {
      const next = new Set(cur);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const pdf = async (kind: "download" | "preview", language: "ko" | "en") => {
    try {
      const data = language === "ko" ? careerData : careerDataEn;
      if (kind === "download") await generateClientPDF(data, language);
      else await previewPDF(data, language);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "PDF failed");
    }
  };

  const totalProjects = careerData.reduce((n, c) => n + c.projects.length, 0);

  /** flat list for the globe, in display order */
  const globeProjects = useMemo(
    () => careerData.flatMap((c) => c.projects.filter((p) => p.id).map((p) => ({ id: p.id!, name: p.name }))),
    [careerData]
  );

  /** expand a project card and bring it into view (globe marker → card) */
  const openProject = useCallback(
    (id: string) => {
      careerData.forEach((c, ci) =>
        c.projects.forEach((p, pi) => {
          if (p.id === id) setOpen((cur) => new Set(cur).add(`${ci}-${pi}`));
        })
      );
      requestAnimationFrame(() => document.getElementById(`project-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" }));
    },
    [careerData]
  );

  return (
    <div className="page py-10 sm:py-14" id="career-content">
      {/* Header */}
      <header className="grid gap-6 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <p className="eyebrow">{t(locale, "career.eyebrow")}</p>
          <h1 className="t-title mt-3 text-foreground">{t(locale, "career.title")}</h1>
          <p className="t-lead mt-4 max-w-[60ch]">{t(locale, "career.lead")}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded-md bg-foreground px-4 text-sm font-semibold text-background transition-opacity duration-1 hover:opacity-90"
            >
              <Download className="h-4 w-4" />
              {t(locale, "career.pdf")}
              <ChevronDown className="h-4 w-4 opacity-70" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="eyebrow">한국어</DropdownMenuLabel>
            <DropdownMenuItem onSelect={() => pdf("preview", "ko")}>
              <Eye className="mr-2 h-4 w-4" /> 미리보기
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => pdf("download", "ko")}>
              <Download className="mr-2 h-4 w-4" /> 다운로드
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="eyebrow">English</DropdownMenuLabel>
            <DropdownMenuItem onSelect={() => pdf("preview", "en")}>
              <Eye className="mr-2 h-4 w-4" /> Preview
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => pdf("download", "en")}>
              <Download className="mr-2 h-4 w-4" /> Download
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* Project map */}
      <section className="mt-14 sm:mt-20" id="demo-globe">
        <p className="eyebrow mb-2">{t(locale, "showcase.globe.hint")}</p>
        <div className="section-head mb-3">
          <h2 className="t-h1 text-foreground">{t(locale, "showcase.globe.title")}</h2>
        </div>
        <p className="t-small mb-8 max-w-[64ch]">{t(locale, "showcase.globe.desc")}</p>
        <ProjectGlobe locale={locale} projects={globeProjects} onOpen={openProject} />
      </section>

      {/* Projects */}
      <section className="mt-20 sm:mt-24">
        <p className="eyebrow mb-2">
          {pad2(totalProjects)} {t(locale, "home.items")}
        </p>
        <div className="section-head mb-8">
          <h2 className="t-h1 text-foreground">{t(locale, "career.projects")}</h2>
        </div>

        <div className="space-y-14">
          {careerData.map((company, ci) => (
            <div key={ci} className="grid gap-6 md:grid-cols-[14rem_1fr] md:gap-10">
              <div className="md:sticky md:top-24 md:self-start">
                <h3 className="t-h2 text-foreground">
                  {company.link ? (
                    <a href={company.link} target="_blank" rel="noopener noreferrer" className="link-underline">
                      {company.name}
                    </a>
                  ) : (
                    company.name
                  )}
                </h3>
                <p className="mono mt-2">{company.period}</p>
                <p className="t-small mt-1">{company.position}</p>
                <p className="mono mt-1">
                  {pad2(company.projects.length)} projects
                </p>
              </div>

              <ol className="space-y-3">
                {company.projects.map((project, pi) => {
                  const key = `${ci}-${pi}`;
                  const isOpen = open.has(key);
                  return (
                    <li
                      key={key}
                      id={project.id ? `project-${project.id}` : undefined}
                      className={`surface scroll-mt-24 overflow-hidden transition-colors duration-2 ${isOpen ? "border-primary/40" : ""}`}
                    >
                      <button
                        type="button"
                        onClick={() => toggle(key)}
                        aria-expanded={isOpen}
                        className="flex w-full items-start gap-4 px-5 py-4 text-left transition-colors duration-1 hover:bg-accent/50"
                      >
                        <span className="mono mt-1 w-6 shrink-0 text-text-3">{pad2(pi + 1)}</span>
                        <span className="min-w-0 flex-1">
                          <span className="t-h3 block text-foreground">{project.name}</span>
                          <span className="mono mt-1 block">
                            {project.period}
                            {project.role ? ` · ${project.role}` : ""}
                          </span>
                        </span>
                        <ChevronDown
                          className={`mt-1 h-4 w-4 shrink-0 text-text-3 transition-transform duration-2 ease-soft ${isOpen ? "rotate-180" : ""}`}
                        />
                      </button>

                      <div
                        className={`grid transition-[grid-template-rows] duration-3 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                      >
                        <div className="overflow-hidden">
                          <div className="space-y-6 border-t border-border px-5 py-5 sm:pl-[3.75rem]">
                            <div>
                              <p className="eyebrow mb-2">{t(locale, "career.overview")}</p>
                              <p className="t-body">{project.overview}</p>
                            </div>
                            <div>
                              <p className="eyebrow mb-2">{t(locale, "career.highlights")}</p>
                              <ul className="space-y-2">
                                {project.highlights.map((h, i) => (
                                  <li key={i} className="t-body relative pl-4 before:absolute before:left-0 before:top-[0.8em] before:h-1 before:w-1 before:rounded-full before:bg-primary">
                                    {h}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            {project.techStack?.length ? (
                              <div>
                                <p className="eyebrow mb-2">{t(locale, "career.techStack")}</p>
                                <div className="flex flex-wrap gap-1.5">
                                  {project.techStack.map((s) => (
                                    <span key={s} className="chip">
                                      {s}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            ) : null}
                            {project.references?.length ? (
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                {project.references.map((r) => (
                                  <a
                                    key={r}
                                    href={r}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-sm text-text-2 transition-colors duration-1 hover:text-foreground"
                                  >
                                    <ExternalLink className="h-3.5 w-3.5" />
                                    {r.replace(/^https?:\/\/(www\.)?/, "").slice(0, 40)}
                                  </a>
                                ))}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
