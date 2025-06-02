import Link from "next/link";
import { Metadata } from "next";
import { ExternalLink, FileUser, Mail } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import TimeBasedBackground from "@/components/ui/TimeBasedBackground";
import { Button } from "@/components/ui/button";
import { MAIN } from "@/lib/constants";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About - MYKim",
  description: `${MAIN.author} - ${MAIN.bio.subtitle}`
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">About</h1>
          </div>

          {/* Main Content - 좌우 레이아웃 */}
          <div className="grid lg:grid-cols-2 gap-12 items-stretch">
            {/* 왼쪽: 아바타 및 기본 정보 */}
            <div className="space-y-8">
              {/* 시간대별 배경이 있는 아바타 섹션 */}
              <TimeBasedBackground className="rounded-3xl min-h-[600px] h-full flex flex-col items-center justify-center p-8">
                <div className="text-center space-y-6">
                  {/* 아바타 */}
                  <div className="flex justify-center">
                    <Avatar size="XL" enableDailyAvatar={true} className="shadow-2xl border-4 border-white dark:border-gray-800 w-32 h-32" />
                  </div>

                  {/* 이름과 타이틀 */}
                  <div className="space-y-3">
                    <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">{MAIN.author_en}</h2>
                    <p className="text-xl text-white/90 font-medium drop-shadow-md">{MAIN.bio.duty}</p>
                    <p className="text-lg text-white/80 drop-shadow-md">{MAIN.bio.location}</p>
                  </div>

                  {/* 소셜 링크들 */}
                  <div className="flex justify-center space-x-6 pt-8">
                    <Link
                      href={`mailto:${MAIN.social.email}`}
                      className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                      title="Email"
                    >
                      <Mail className="w-6 h-6 text-gray-700" />
                    </Link>

                    <Link
                      href={MAIN.social.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                      title="GitHub"
                    >
                      <Image src="/images/icons/github.svg" alt="GitHub" width={24} height={24} className="w-6 h-6" />
                    </Link>

                    <Link
                      href={MAIN.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                      title="LinkedIn"
                    >
                      <Image src="/images/icons/linkedin.svg" alt="LinkedIn" width={24} height={24} className="w-6 h-6" />
                    </Link>
                  </div>
                </div>
              </TimeBasedBackground>
            </div>

            {/* 오른쪽: 텍스트 콘텐츠 */}
            <div className="flex flex-col">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg h-full flex flex-col">
                <div className="space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed flex-grow">
                  <p className="text-lg">업데이트 예정입니다.</p>

                  <p className="text-lg">업데이트 예정입니다.</p>

                  <p className="text-lg">업데이트 예정입니다.</p>

                  <p className="text-lg">업데이트 예정입니다.</p>
                </div>

                {/* Detailed Resume Link */}
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    <Link href="https://www.notion.so/Portfolio-1c555ac7ad08807b9f05c10e96cb59ee?source=copy_link" target="_blank" rel="noopener noreferrer">
                      <FileUser className="mr-2 h-5 w-5" />
                      Detailed Resume (Notion)
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
