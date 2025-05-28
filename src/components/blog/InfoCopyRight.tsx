"use client";

import Link from "next/link";
import Avatar from "@/components/ui/Avatar";
import SocialIcon from "@/components/ui/SocialIcon";
import { MAIN } from "@/lib/constants";

export default function InfoCopyRight() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className=" py-6 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center space-y-3">
          {/* Avatar */}
          <Link href="/about" title="About">
            <Avatar size="RESPONSIVE" enableDailyAvatar={true} className="shadow-lg" />
          </Link>

          {/* 짧은 한마디 */}
          <div className="text-center">
            {/* <p className="leading-relaxed text-sm sm:text-base md:text-lg lg:text-xl font-medium text-gray-800 dark:text-gray-200">{MAIN.author}</p> */}
            <p className="leading-relaxed text-sm sm:text-base md:text-lg lg:text-xl font-medium text-gray-800 dark:text-gray-200">{MAIN.bio.tagline}</p>
            <p className="leading-relaxed text-sm sm:text-sm md:text-base text-gray-600 dark:text-gray-400 mt-0.5">{MAIN.bio.subtitle}</p>
          </div>

          {/* 소셜 링크들 */}
          <div className="flex items-center space-x-2">
            {/* LinkedIn */}
            <Link href={MAIN.social.linkedin} target="_blank" rel="noopener noreferrer" className="shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110 group" title="LinkedIn">
              <SocialIcon type="linkedin" size={20} />
            </Link>

            {/* RSS */}
            <Link href={MAIN.social.rss} className="  shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110 group" title="RSS Feed">
              <SocialIcon type="rss" size={16} />
            </Link>

            {/* GitHub */}
            <Link
              href={MAIN.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="dark:p-0.5 dark:bg-gray-500 dark:rounded-full shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110 group"
              title="GitHub"
            >
              <SocialIcon type="github" size={20} />
            </Link>
          </div>
          {/* Copyright */}
          <div className="text-center text-xs sm:text-sm md:text-base text-gray-500 dark:text-gray-400  pt-1 w-full max-w-md">
            <p>
              © {currentYear} {MAIN.author}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
