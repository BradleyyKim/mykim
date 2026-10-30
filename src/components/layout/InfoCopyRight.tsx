"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Github, Linkedin, Mail, Rss } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import { MAIN } from "@/lib/constants";
import { getLocalePath, t } from "@/i18n";
import type { Locale } from "@/i18n";

export default function InfoCopyRight() {
  const pathname = usePathname();
  const locale: Locale = pathname.startsWith("/en") ? "en" : "ko";
  const year = new Date().getFullYear();

  const links = [
    { href: MAIN.social.github, label: "GitHub", Icon: Github },
    { href: MAIN.social.linkedin, label: "LinkedIn", Icon: Linkedin },
    { href: `mailto:${MAIN.social.email}`, label: "Email", Icon: Mail },
    { href: MAIN.social.rss, label: "RSS", Icon: Rss }
  ];

  return (
    <footer className="border-t border-border">
      <div className="page flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link href={getLocalePath(locale, "/about")} title="About">
            <Avatar size="SM" enableDailyAvatar className="ring-1 ring-border" />
          </Link>
          <div>
            <p className="text-sm font-semibold text-foreground">{MAIN.title}</p>
            <p className="mono">{t(locale, "footer.tagline")}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {links.map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              aria-label={label}
              className="rounded-md p-2 text-text-2 transition-colors duration-1 hover:bg-accent hover:text-foreground"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>
        <p className="mono">{t(locale, "footer.copyright", { year: String(year), title: MAIN.title })}</p>
      </div>
    </footer>
  );
}
