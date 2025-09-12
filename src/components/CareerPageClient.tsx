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

interface CareerPageClientProps {
  careerData: Company[];
  careerDataEn: Company[];
}

export default function CareerPageClient({ careerData }: CareerPageClientProps) {
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isLoggedIn, isLoading } = useAuth();

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

  const handleUploadAllPDFs = async () => {
    try {
      setIsUploading(true);
      setUploadProgress("한국어 PDF 업로드 중... (1/2)");

      // 한국어/영어 순차 업로드
      const response = await fetch("/api/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          action: "upload-all-pdfs",
          careerData: careerData // 한국어 데이터 사용
        })
      });

      if (!response.ok) {
        throw new Error("PDF 업로드에 실패했습니다.");
      }

      const result = await response.json();
      toast.success(result.message);
    } catch (error) {
      console.error("PDF 업로드 실패:", error);
      toast.error("PDF 업로드에 실패했습니다.");
    } finally {
      setIsUploading(false);
      setUploadProgress("");
    }
  };

  const handleDownloadPDF = async (language: "ko" | "en") => {
    try {
      setIsDropdownOpen(false);

      // Strapi에서 PDF 다운로드
      const response = await fetch(`/api/download-pdf?language=${language}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "PDF 다운로드에 실패했습니다.");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `career-portfolio-${language}.pdf`;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("PDF 다운로드가 완료되었습니다!");
    } catch (error) {
      console.error("PDF 다운로드 중 오류 발생:", error);
      const errorMessage = error instanceof Error ? error.message : "PDF 다운로드에 실패했습니다.";
      toast.error(errorMessage);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">로딩 중...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* 관리자 업로드 버튼 */}
      {isLoggedIn && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">관리자 도구</h3>
            <div className="space-y-2">
              <button
                onClick={handleUploadAllPDFs}
                disabled={isUploading}
                className="w-full px-3 py-2 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading && uploadProgress.includes("(1/2)") ? "전체 업로드 중..." : "PDF 업로드"}
              </button>
            </div>
            {isUploading && <div className="mt-2 text-xs text-gray-500">{uploadProgress}</div>}
          </div>
        </div>
      )}

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
              <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-24 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                <div className="py-1">
                  <button
                    onClick={() => handleDownloadPDF("ko")}
                    className="w-full text-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    한국어
                  </button>
                  <button
                    onClick={() => handleDownloadPDF("en")}
                    className="w-full text-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    English
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
