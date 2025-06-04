"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, ExternalLink, Calendar, MapPin, Briefcase } from "lucide-react";
import type { Company } from "@/app/career/page";
import Link from "next/link";

interface CareerPageClientProps {
  careerData: Company[];
}

export default function CareerPageClient({ careerData }: CareerPageClientProps) {
  const [expandedProjects, setExpandedProjects] = useState<Set<number>>(new Set());

  const toggleProject = (projectId: number) => {
    const newExpanded = new Set(expandedProjects);
    if (newExpanded.has(projectId)) {
      newExpanded.delete(projectId);
    } else {
      newExpanded.add(projectId);
    }
    setExpandedProjects(newExpanded);
  };

  const isProjectExpanded = (projectId: number) => expandedProjects.has(projectId);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <div className="flex justify-between items-center mb-4">
          <div className="flex-1"></div>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 flex-1 text-center">Career</h1>
          <div className="flex-1 flex justify-end"></div>
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
                    <Link href={company.link} target="_blank" rel="noopener noreferrer">
                      {company.name}
                    </Link>
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
                  {company.projects.map(project => (
                    <div
                      key={project.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md"
                    >
                      {/* 토글 헤더 */}
                      <button
                        onClick={() => toggleProject(project.id)}
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
                            {isProjectExpanded(project.id) ? (
                              <ChevronDown className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                            ) : (
                              <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                            )}
                          </div>
                        </div>
                      </button>

                      {/* 토글 콘텐츠 */}
                      {isProjectExpanded(project.id) && (
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
                                    className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm transition-colors duration-200"
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                    {reference}
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
