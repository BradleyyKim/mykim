"use client";

import Link from "next/link";
import { ExternalLink, Mail } from "lucide-react";
import TimeBasedBackground from "@/components/ui/TimeBasedBackground";
import { Button } from "@/components/ui/button";
import { MAIN } from "@/lib/constants";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function AboutPage() {
  const [isKorean, setIsKorean] = useState(false);

  // Set document title dynamically
  useEffect(() => {
    document.title = `About - MYKim`;
  }, []);

  const toggleLanguage = () => {
    setIsKorean(!isKorean);
  };

  const content = {
    en: [
      "I tend to reflect deeply on the **purpose** and **underlying reason** behind everything I do.",
      "Rather than simply executing tasks, I value the process of asking myself **why this work matters** and **what kind of value it can create**—both for users and for the team.",
      "As a team, we believe that in order to carefully design and experiment with **truly user-centered interfaces**, it’s essential to have a **stable and trustworthy foundation in place**.",
      "The same applies to life. When our **inner foundation** is solid, we can move forward with **greater clarity and resilience**."
    ],
    ko: [
      "저는 어떤 일이든 그 **목적**과 **본질적인 이유**를 고민하는 편입니다.",
      "단순히 실행하는 것보다, **왜 이 작업이 필요한지**, 그리고 그것이 **어떤 의미와 가치를 만들어낼 수 있는지**를 끊임없이 자문하고 정리하는 과정을 중요하게 생각합니다.",
      "팀이 **사용자 경험 중심의 인터페이스**를 정교하게 설계하고 실험하려면, **안정적이고 신뢰할 수 있는 기반(foundation)**이 필요하다고 믿습니다.",
      "삶도 마찬가지입니다. **나를 지탱하는 내면의 기반이 단단할수록**, 더 **깊고 의미 있는 방향**으로 움직일 수 있다고 생각합니다."
    ]
  };

  return (
    <div className="min-h-screen">
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
              <TimeBasedBackground className="rounded-3xl min-h-[400px] h-50 flex flex-col items-center justify-center p-8"></TimeBasedBackground>
              <div className="space-y-3">
                <h2 className="text-3xl md:text-4xl text-center font-bold dark:text-white drop-shadow-lg">
                  {MAIN.author_en}
                </h2>
                <p className="text-xl text-center dark:text-white/90 font-medium drop-shadow-md">{MAIN.bio.duty}</p>
                <p className="text-lg text-center dark:text-white/80 drop-shadow-md">{MAIN.bio.location}</p>
              </div>
              <div className="flex justify-center space-x-6 ">
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

            {/* 오른쪽: 텍스트 콘텐츠 */}
            <div className="flex flex-col">
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg h-full flex flex-col">
                {/* Language Toggle Button */}
                <div className="flex justify-end mb-4">
                  <button
                    onClick={toggleLanguage}
                    className="flex items-center space-x-2 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors duration-200"
                    title="언어 변경 / Change Language"
                  >
                    {/* <Languages className="w-4 h-4" /> */}
                    <span>{isKorean ? "EN" : "KO"}</span>
                  </button>
                </div>

                <div className="space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed flex-col justify-around items-center flex-grow">
                  {content[isKorean ? "ko" : "en"].map((text, index) => (
                    <p
                      key={index}
                      className="text-lg"
                      dangerouslySetInnerHTML={{ __html: text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }}
                    />
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <Link
                    href="/career"
                    rel="noopener noreferrer"
                    className=" text-blue-600 hover:text-blue-700 flex items-center justify-center"
                  >
                    Career Detail
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                  <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white"></Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
