"use client";

import Link from "next/link";
import type { Tag } from "@/lib/types/post";
import { getLocalePath, t } from "@/i18n";
import type { Locale } from "@/i18n";
import { pad2 } from "@/lib/format";

interface TagsPageClientProps {
  tags: Tag[];
  locale?: Locale;
}

export default function TagsPageClient({ tags, locale = "ko" }: TagsPageClientProps) {
  return (
    <div className="page py-10 sm:py-14">
      <header className="max-w-[60ch]">
        <p className="eyebrow">{pad2(tags.length)} tags</p>
        <h1 className="t-title mt-3 text-foreground">{t(locale, "tags.title")}</h1>
        <p className="t-lead mt-4">{t(locale, "tags.description")}</p>
      </header>

      <div className="mt-10">
        {tags.length ? (
          <ul className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <li key={tag.id}>
                <Link href={getLocalePath(locale, `/tags/${encodeURIComponent(tag.name || "")}`)} className="chip h-8 px-3 text-sm">
                  #{tag.name}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="t-small">{t(locale, "tags.empty")}</p>
        )}
      </div>
    </div>
  );
}
