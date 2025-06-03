import Link from "next/link";
import { Metadata } from "next";
import { ExternalLink, Mail } from "lucide-react";
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
              <TimeBasedBackground className="rounded-3xl min-h-[400px] h-50 flex flex-col items-center justify-center p-8"></TimeBasedBackground>
              <div className="space-y-3">
                <h2 className="text-3xl md:text-4xl text-center font-bold dark:text-white drop-shadow-lg">{MAIN.author_en}</h2>
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
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg h-full flex  flex-col">
                <div className="space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed flex-col justify-around items-center flex-grow">
                  {/* <p className="text-lg text-center">저는 언제나 주도적으로 일을 해결하려 노력하며, 모든 일의 목적과 근본적인 이유를 깊이 고민하는 편입니다. </p> */}
                  <p className="text-lg text-center">I always try to take the initiative in solving things, and I tend to think deeply about the purpose and fundamental reasons for everything.</p>
                  {/* <p className="text-lg text-center">단순히 주어진 일을 처리하는 데 그치지 않고, 왜 이 일이 필요한지, 어떤 가치를 만들어낼 수 있는지 스스로 묻고 답하는 과정을 소중하게 생각합니다.</p> */}
                  <p className="text-lg text-center">I value the process of asking and answering myself why this work is necessary and what value it can create, not just dealing with a given task.</p>
                  {/* <p className="text-lg text-center">안정적인 기반 위에서 사람들은 복잡한 시스템과 아키텍처의 본질에 더욱 몰입할 수 있다고 믿습니다.</p> */}
                  <p className="text-lg text-center">And I believe that people can be more immersed in the essence of complex systems and architectures on a stable basement.</p>
                  {/* <p className="text-lg text-center">반복적이거나 불필요한 걱정에서 벗어나, 더 창의적이고 본질적인 문제에 집중할 수 있는 환경을 만드는 것이 저의 목표입니다.</p> */}
                  <p className="text-lg text-center">My goal is to create an environment where I can focus on more creative and essential problems, free from repetitive or unnecessary worries.</p>
                </div>
                {/* <p>저는 항상 일을 주도적으로 해결하려고 노력하며, 모든 일의 목적과 근본적인 이유에 대해 깊이 생각하는 편입니다. 주어진 과제를 다루는 것뿐만 아니라 왜 이 일이 필요한지, 어떤 가치를 창출할 수 있는지 스스로 묻고 답하는 과정을 중요하게 생각합니다. 그리고 사람들은 안정적인 기반 위에서 복잡한 시스템과 아키텍처의 본질에 더 몰입할 수 있다고 믿습니다. 반복적이거나 불필요한 걱정에서 벗어나 보다 창의적이고 본질적인 문제에 집중할 수 있는 환경을 만드는 것이 목표입니다.</p> */}
                {/* Detailed Resume Link */}
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    <Link href="/career" rel="noopener noreferrer">
                      Career Detail
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
