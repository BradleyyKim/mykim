"use client";

import { useEffect, useState } from "react";
import type { Heading } from "@/lib/content/headings";

interface TableOfContentsProps {
  headings: Heading[];
  title: string;
  /** render as a collapsible block (mobile) instead of a sticky rail */
  collapsible?: boolean;
}

export default function TableOfContents({ headings, title, collapsible = false }: TableOfContentsProps) {
  const items = headings.filter((h) => h.level <= 2);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (!items.length) return;
    const els = items.map((h) => document.getElementById(h.id)).filter((x): x is HTMLElement => !!x);
    if (!els.length) return;

    // Track the heading closest to the top edge once it has passed the header.
    const onScroll = () => {
      const line = 96;
      let current: string | null = null;
      for (const el of els) {
        if (el.getBoundingClientRect().top - line <= 0) current = el.id;
        else break;
      }
      setActive(current ?? els[0].id);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headings]);

  if (!items.length) return null;

  const list = (
    <ol className="toc">
      {items.map((h) => (
        <li key={h.id}>
          <a href={`#${h.id}`} data-level={h.level} data-active={active === h.id ? "true" : "false"}>
            {h.text}
          </a>
        </li>
      ))}
    </ol>
  );

  if (collapsible) {
    return (
      <details className="surface group px-4 py-3">
        <summary className="eyebrow flex cursor-pointer list-none items-center justify-between">
          {title}
          <span className="transition-transform duration-2 ease-soft group-open:rotate-180" aria-hidden="true">
            ⌄
          </span>
        </summary>
        <div className="mt-3">{list}</div>
      </details>
    );
  }

  return (
    <nav aria-label={title}>
      <p className="eyebrow mb-3">{title}</p>
      {list}
    </nav>
  );
}
