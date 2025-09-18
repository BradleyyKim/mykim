"use client";

import { useState, useRef, useEffect } from "react";
import {
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Calendar,
  MapPin,
  Briefcase,
  Download,
  ChevronUp
} from "lucide-react";
import type { Company } from "@/app/career/page";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import AdminToolbarUniversal from "@/components/AdminToolbarUniversal";
import { generateClientPDF, previewPDF } from "@/lib/media";

interface CareerPageClientProps {
  careerData: Company[];
  careerDataEn: Company[];
}

export default function CareerPageClient({ careerData, careerDataEn }: CareerPageClientProps) {
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isLoading } = useAuth();

  const toggleProject = (companyIndex: number, projectIndex: number) => {
    const projectKey = `${companyIndex}-${projectIndex}`;
    const newExpanded = new Set(expandedProjects);
    if (newExpanded.has(projectKey)) {
      newExpanded.delete(projectKey);
    } else {
      newExpanded.add(projectKey);
    }
    setExpandedProjects(newExpanded);
  };

  const isProjectExpanded = (companyIndex: number, projectIndex: number) =>
    expandedProjects.has(`${companyIndex}-${projectIndex}`);

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDownloadPDF = async (language: "ko" | "en") => {
    try {
      setIsDropdownOpen(false);

      // CSS Print Media 방식으로 PDF 생성
      const data = language === "ko" ? careerData : careerDataEn;
      await generateClientPDF(data, language);
    } catch (error) {
      console.error("PDF 다운로드 중 오류 발생:", error);
      const errorMessage = error instanceof Error ? error.message : "PDF 다운로드에 실패했습니다.";
      toast.error(errorMessage);
    }
  };

  const handlePreviewPDF = async (language: "ko" | "en") => {
    try {
      setIsDropdownOpen(false);

      // CSS Print Media 방식으로 PDF 미리보기
      const data = language === "ko" ? careerData : careerDataEn;
      await previewPDF(data, language);

      toast.success("PDF 미리보기가 열렸습니다!");
    } catch (error) {
      console.error("PDF 미리보기 중 오류 발생:", error);
      const errorMessage = error instanceof Error ? error.message : "PDF 미리보기에 실패했습니다.";
      toast.error(errorMessage);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">로딩 중...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12" id="career-content">
      {/* 관리자 도구 */}
      <AdminToolbarUniversal actions={[]} showVersionInfo={true} position="bottom-right" />

      <div className="mb-12 text-center">
        {/* 제목 */}
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-6">Career</h1>

        {/* PDF 다운로드 버튼 */}
        <div className="flex justify-end">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium shadow-sm"
            >
              <Download className="h-4 w-4" />
              PDF
              {isDropdownOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>

            {isDropdownOpen && (
              <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                <div className="py-1">
                  <div className="px-3 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                    한국어
                  </div>
                  <button
                    onClick={() => handlePreviewPDF("ko")}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center gap-2"
                  >
                    <span>👁️</span>
                    미리보기
                  </button>
                  <button
                    onClick={() => handleDownloadPDF("ko")}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center gap-2"
                  >
                    <span>📄</span>
                    PDF 다운로드
                  </button>

                  <div className="px-3 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 mt-1">
                    English
                  </div>
                  <button
                    onClick={() => handlePreviewPDF("en")}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center gap-2"
                  >
                    <span>👁️</span>
                    Preview
                  </button>
                  <button
                    onClick={() => handleDownloadPDF("en")}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center gap-2"
                  >
                    <span>📄</span>
                    Download PDF
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 회사별 경력 정보 */}
      <div className="space-y-16">
        {careerData.map((company, companyIndex) => (
          <div key={companyIndex} className="company-section">
            <div className="flex flex-col md:flex-row gap-8">
              {/* 회사 정보 (좌측 또는 상단) */}
              <div className="w-full md:w-1/4 mb-6 md:mb-0">
                <div className="sticky top-20">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                    {company.link ? (
                      <Link href={company.link} target="_blank" rel="noopener noreferrer">
                        {company.name}
                      </Link>
                    ) : (
                      company.name
                    )}
                  </h2>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{company.period}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      <span>{company.position}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{company.projects.length} projects</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 프로젝트 목록 (우측 또는 하단) */}
              <div className="w-full md:w-3/4">
                <div className="space-y-4">
                  {company.projects.map((project, projectIndex) => (
                    <div
                      key={`${companyIndex}-${projectIndex}`}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md"
                    >
                      {/* 토글 헤더 */}
                      <button
                        onClick={() => toggleProject(companyIndex, projectIndex)}
                        className="w-full px-6 py-4 text-left bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">
                              {project.name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{project.period}</p>
                          </div>
                          <div className="ml-4">
                            {isProjectExpanded(companyIndex, projectIndex) ? (
                              <ChevronDown className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                            ) : (
                              <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                            )}
                          </div>
                        </div>
                      </button>

                      {/* 토글 콘텐츠 */}
                      {isProjectExpanded(companyIndex, projectIndex) && (
                        <div className="px-6 py-6 bg-white dark:bg-gray-900">
                          {/* 프로젝트 개요 */}
                          <div className="mb-6">
                            <h4 className="text-md font-semibold text-gray-800 dark:text-gray-100 mb-2">
                              Project Overview
                            </h4>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{project.overview}</p>
                          </div>

                          {/* 기술 스택 */}
                          {project.techStack && project.techStack.length > 0 && (
                            <div className="mb-6">
                              <h4 className="text-md font-semibold text-gray-800 dark:text-gray-100 mb-3">
                                Tech Stack
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {project.techStack.map((tech, index) => (
                                  <span
                                    key={index}
                                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-sm rounded-full"
                                  >
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* 주요 성과 */}
                          <div className="mb-6">
                            <h4 className="text-md font-semibold text-gray-800 dark:text-gray-100 mb-3">
                              Key Achievements
                            </h4>
                            <ul className="space-y-2">
                              {project.achievements.map((achievement, index) => (
                                <li key={index} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                                  <span className="text-green-500 dark:text-green-400 mt-1">•</span>
                                  <span className="leading-relaxed">{achievement}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* 레퍼런스 링크 */}
                          {project.references && project.references.length > 0 && (
                            <div>
                              <h4 className="text-md font-semibold text-gray-800 dark:text-gray-100 mb-3">
                                References
                              </h4>
                              <div className="space-y-2">
                                {project.references.map((reference, index) => (
                                  <a
                                    key={index}
                                    href={reference}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm transition-colors duration-200"
                                  >
                                    {reference}
                                    <ExternalLink className="h-4 w-4 mr-3" />
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
