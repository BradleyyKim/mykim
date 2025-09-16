"use client";

import Link from "next/link";
import Avatar from "@/components/ui/Avatar";
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
          {/* Copyright */}
          <div className="text-center text-xs sm:text-sm md:text-base text-gray-500 dark:text-gray-400  pt-1 w-full max-w-md">
            <p>
              © {currentYear} {MAIN.title}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
