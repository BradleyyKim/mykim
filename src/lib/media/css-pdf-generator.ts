import type { Company } from "@/app/career/page";

/**
 * PDF 프로필 정보 (학력, 강점 등)
 */
const PDF_PROFILE = {
  ko: {
    education: ["경상대학교 반도체공학과 학사 졸업 (2018)"],
    strengths: [
      {
        title: "성능 최적화 전문성",
        description:
          "Lighthouse를 활용해 성능을 최적화하고, React DevTools를 활용해 리렌더링과 같은 성능 이슈를 효과적으로 분석 및 해결하는 능력"
      },
      {
        title: "사용자 중심 UI/UX 구현 및 문제 해결",
        description:
          "사용자 관점에서 인터페이스를 설계하고, 요구사항에 맞춰 Canvas, SVG, CSS 등 다양한 기술을 활용해 최적의 UI 솔루션 도출. 복잡한 기술적 제약 속에서도 사용자 경험을 우선시하는 구현 능력"
      },
      {
        title: "크로스 펑셔널 협업 및 기술적 문제 해결",
        description:
          "백엔드, 디자이너, PM 등 다양한 직군과의 협업을 통해 복잡한 기술적 문제를 해결. 다국적 팀원들과의 협업 경험을 바탕으로 원활한 커뮤니케이션과 신뢰 관계 구축 능력"
      },
      {
        title: "AI 도구 활용 및 최신 기술 트렌드 파악",
        description:
          "Claude Code, Codex 등 터미널 기반 AI 도구를 실무에 적극 활용하여 개발 생산성 향상. 기술 커뮤니티와 공식 문서를 통해 지속적으로 업계 동향 파악하는 능력"
      },
      {
        title: "빠른 학습 및 적용 능력",
        description:
          "현재까지 모든 프로젝트를 성공적으로 완성 및 릴리즈했으며, 새로운 기술을 빠르게 학습하고 적용하는 능력"
      }
    ]
  },
  en: {
    education: ["B.S. in Semiconductor Engineering, Gyeongsang National University (2018)"],
    strengths: [
      {
        title: "Performance Optimization Expertise",
        description:
          "Effectively analyze and resolve performance issues such as re-rendering using Lighthouse for optimization and React DevTools"
      },
      {
        title: "User-Centric UI/UX Implementation & Problem Solving",
        description:
          "Design interfaces from user perspective and deliver optimal UI solutions utilizing various technologies like Canvas, SVG, and CSS to meet requirements. Prioritize user experience even under complex technical constraints"
      },
      {
        title: "Cross-Functional Collaboration & Technical Problem Solving",
        description:
          "Resolve complex technical problems through collaboration with diverse roles including backend engineers, designers, and PMs. Build smooth communication and trust relationships based on experience working with multinational team members"
      },
      {
        title: "AI Tools Utilization & Latest Technology Trends Awareness",
        description:
          "Actively utilize terminal-based AI tools such as Claude Code and Codex in actual work to improve development productivity. Continuously monitor industry trends through tech communities and official documentation"
      },
      {
        title: "Fast Learning & Application Ability",
        description:
          "Successfully completed and released all projects to date, demonstrating ability to rapidly learn and apply new technologies"
      }
    ]
  }
};

/**
 * CSS Print Media 방식으로 PDF 생성
 * Pozafly의 아티클을 참고하여 최적화된 구현
 */
export class CSSPDFGenerator {
  private static instance: CSSPDFGenerator;

  static getInstance(): CSSPDFGenerator {
    if (!CSSPDFGenerator.instance) {
      CSSPDFGenerator.instance = new CSSPDFGenerator();
    }
    return CSSPDFGenerator.instance;
  }

  /**
   * PDF용 HTML 생성 (테이블 구조 사용)
   */
  private generatePDFHTML(data: Company[], language: "ko" | "en"): string {
    const title = language === "ko" ? "경력기술서 - 김민영" : "Career Portfolio - Minyoung Kim";

    return `
      <!DOCTYPE html>
      <html lang="${language}">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&family=Roboto:wght@400;700&display=swap');
          
          /* 페이지 설정 - Pozafly 방식 적용 */
          @page {
            size: A4;
            margin: 0;
          }
          
          /* 전체 레이아웃 - 테이블 구조로 페이지 제어 */
          body {
            margin: 0;
            padding: 0;
            font-family: ${language === "ko" ? "'Noto Sans KR', sans-serif" : "'Roboto', sans-serif"};
            line-height: 1.5;
            color: #1a1a1a;
            background: white;
            font-size: 12px;
          }
          
          .pdf-table {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
          }
          
          .pdf-thead {
            display: table-header-group;
          }
          
          .pdf-tfoot {
            display: table-footer-group;
          }
          
          .pdf-tbody {
            display: table-row-group;
          }
          
          .pdf-container {
            width: 714px; /* A4 너비에서 마진 제외 */
            margin: 0 auto;
            padding: 40px;
          }
          
          /* 제목 스타일 */
          .pdf-title {
            font-size: 20px;
            font-weight: 600;
            text-align: center;
            margin-bottom: 30px;
            color: #1a1a1a;
            border-bottom: 1px solid #333;
            padding-bottom: 15px;
            page-break-after: avoid;
            break-after: avoid;
          }

          /* 학력 섹션 */
          .pdf-education {
            margin-top: 40px;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #e0e0e0;
            page-break-inside: avoid;
            break-inside: avoid;
          }

          .pdf-education-title {
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 15px;
            color: #1a1a1a;
            padding-bottom: 10px;
            border-bottom: 1px solid #e0e0e0;
          }

          .pdf-education-item {
            font-size: 12px;
            color: #333;
            line-height: 1.6;
            padding-left: 15px;
            margin-top: 10px;
          }

          /* 강점 섹션 */
          .pdf-strengths {
            margin-top: 40px;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #e0e0e0;
            page-break-inside: avoid;
            break-inside: avoid;
          }

          .pdf-strengths-section-title {
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 15px;
            color: #1a1a1a;
            padding-bottom: 10px;
            border-bottom: 1px solid #e0e0e0;
          }

          .pdf-strength-item {
            margin-bottom: 12px;
          }

          .pdf-strength-title {
            font-size: 12px;
            font-weight: 700;
            color: #1a1a1a;
            margin-bottom: 4px;
          }

          .pdf-strength-description {
            font-size: 11px;
            color: #333;
            line-height: 1.6;
            padding-left: 15px;
          }
          
          /* 회사 섹션 - 페이지 분할 제어 */
          .pdf-company {
            margin-bottom: 30px;
            page-break-inside: avoid;
            break-inside: avoid;
            border: none;
            border-radius: 0;
            overflow: visible;
            box-shadow: none;
            border-bottom: 2px solid #e0e0e0;
            padding-bottom: 20px;
          }

          /* 회사 헤더 */
          .pdf-company-header {
            background: white;
            color: #1a1a1a;
            padding: 0 0 10px 0;
            border-bottom: 1px solid #e0e0e0;
            margin-bottom: 15px;
          }

          .pdf-company-name {
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 5px;
            margin: 0;
            color: #1a1a1a;
          }

          .pdf-position {
            font-size: 12px;
            opacity: 0.6;
            margin: 0;
            font-weight: 400;
            color: #666;
          }
          
          /* 프로젝트 컨테이너 */
          .pdf-projects-container {
            padding: 0;
            background: white;
          }

          /* 프로젝트 스타일 - 페이지 분할 제어 */
          .pdf-project {
            margin-bottom: 20px;
            padding: 15px 0;
            border-left: 3px solid #1a1a1a;
            background: white;
            padding-left: 15px;
            page-break-inside: avoid;
            break-inside: avoid;
          }
          
          .pdf-project-name { 
            font-size: 14px; 
            font-weight: 600; 
            margin-bottom: 8px; 
            color: #1a1a1a;
          }
          
          .pdf-project-period { 
            font-size: 11px; 
            color: #666; 
            margin-bottom: 12px; 
          }
          
          .pdf-overview {
            margin-bottom: 15px;
            line-height: 1.5;
            font-size: 11px;
            color: #333;
            padding-bottom: 10px;
            border-bottom: 1px solid #e0e0e0;
          }

          /* PDF 섹션 스타일 */
          .pdf-section {
            margin-bottom: 12px;
          }

          .pdf-section-title {
            font-size: 12px;
            font-weight: 600;
            margin-bottom: 6px;
            color: #1a1a1a;
          }

          .pdf-section ul {
            margin: 0;
            padding-left: 15px;
          }

          .pdf-section li {
            margin-bottom: 5px;
            line-height: 1.4;
            font-size: 10px;
            color: #333;
          }
          
          .pdf-tech-stack {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            margin: 12px 0;
          }

          .pdf-tech-tag {
            background: white;
            color: #1a1a1a;
            padding: 4px 10px;
            border-radius: 3px;
            font-size: 10px;
            font-weight: 500;
            border: 1px solid #d0d0d0;
          }
          
          /* 참고 자료 스타일 */
          .pdf-references {
            margin-top: 10px;
            font-size: 11px;
            color: #333;
          }
          
          .pdf-references strong {
            font-weight: 600;
            color: #1a1a1a;
            margin-right: 8px;
            vertical-align: baseline;
          }
          
          .pdf-references a {
            font-size: 11px;
            color: #333;
            text-decoration: underline;
            vertical-align: baseline;
          }
          
          /* 링크 처리 - Pozafly 방식 적용 */
          a {
            display: inline-block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            max-width: 500px;
            color: #333;
            text-decoration: underline;
            font-size: 10px;
          }
          
          a:hover {
            text-decoration: underline;
          }
          
          /* 참고 자료 링크는 별도 스타일 적용 */
          .pdf-references a {
            display: inline;
            overflow: visible;
            text-overflow: initial;
            white-space: normal;
            max-width: none;
            font-size: 11px;
            color: #333;
            text-decoration: underline;
            vertical-align: baseline;
          }
          
          /* 인쇄 미디어 쿼리 */
          @media print {
            body { 
              margin: 0; 
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            
            .pdf-company { 
              page-break-inside: avoid;
              break-inside: avoid;
            }
            
            .pdf-project { 
              page-break-inside: avoid;
              break-inside: avoid;
            }
            
            .pdf-title {
              page-break-after: avoid;
              break-after: avoid;
            }
          }
        </style>
      </head>
      <body>
        <table class="pdf-table">
          <thead class="pdf-thead">
            <tr>
              <td>
                <div class="pdf-container">
                  <h1 class="pdf-title">${title}</h1>
                </div>
              </td>
            </tr>
          </thead>
          <tbody class="pdf-tbody">
            <tr>
              <td>
                <div class="pdf-container">
                  ${data
                    .map(
                      company => `
                    <div class="pdf-company">
                      <div class="pdf-company-header">
                        <h2 class="pdf-company-name">${company.name}</h2>
                        <div class="pdf-position">${company.position} | ${company.period}</div>
                      </div>
                      <div class="pdf-projects-container">
                        ${company.projects
                          .map(
                            project => `
                          <div class="pdf-project">
                            <h3 class="pdf-project-name">${project.name}</h3>
                            <div class="pdf-project-period">${project.period}</div>
                            <div class="pdf-overview">${project.overview}</div>

                            <div class="pdf-section">
                              <h4 class="pdf-section-title">${language === "ko" ? "주요 업무" : "Responsibilities"}</h4>
                              <ul>
                                ${project.responsibilities.map(resp => `<li>${resp}</li>`).join("")}
                              </ul>
                            </div>

                            <div class="pdf-section">
                              <h4 class="pdf-section-title">${language === "ko" ? "성과" : "Achievements"}</h4>
                              <ul>
                                ${project.achievements.map(achievement => `<li>${achievement}</li>`).join("")}
                              </ul>
                            </div>

                            ${
                              project.metrics && project.metrics.length > 0
                                ? `
                            <div class="pdf-section">
                              <h4 class="pdf-section-title">${language === "ko" ? "성과 지표" : "Metrics & Impact"}</h4>
                              <ul>
                                ${project.metrics.map(metric => `<li>${metric}</li>`).join("")}
                              </ul>
                            </div>
                            `
                                : ""
                            }

                            ${
                              project.techStack && project.techStack.length > 0
                                ? `
                            <div class="pdf-section">
                              <h4 class="pdf-section-title">${language === "ko" ? "기술 스택" : "Tech Stack"}</h4>
                              <div class="pdf-tech-stack">
                                ${project.techStack.map(tech => `<span class="pdf-tech-tag">${tech}</span>`).join("")}
                              </div>
                            </div>
                            `
                                : ""
                            }

                            ${
                              project.references && project.references.length > 0
                                ? `
                            <div class="pdf-references">
                              <strong>${language === "ko" ? "참고 자료:" : "References:"}</strong>
                              ${project.references.map(ref => `<a href="${ref}" target="_blank">${ref}</a>`).join(", ")}
                            </div>
                            `
                                : ""
                            }
                          </div>
                        `
                          )
                          .join("")}
                      </div>
                    </div>
                  `
                    )
                    .join("")}

                  <!-- 학력 섹션 -->
                  <div class="pdf-education">
                    <h2 class="pdf-education-title">${language === "ko" ? "학력" : "Education"}</h2>
                    ${PDF_PROFILE[language].education.map(edu => `<div class="pdf-education-item">${edu}</div>`).join("")}
                  </div>

                  <!-- 강점 및 특징 섹션 -->
                  <div class="pdf-strengths">
                    <h2 class="pdf-strengths-section-title">${language === "ko" ? "강점 및 특징" : "Key Strengths"}</h2>
                    ${PDF_PROFILE[language].strengths
                      .map(
                        strength => `
                    <div class="pdf-strength-item">
                      <div class="pdf-strength-title">${strength.title}</div>
                      <div class="pdf-strength-description">· ${strength.description}</div>
                    </div>
                    `
                      )
                      .join("")}
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
          <tfoot class="pdf-tfoot">
            <tr>
              <td>
                <div class="pdf-container" style="text-align: center; color: #666; font-size: 10px; margin-top: 30px;">
                  <p>${language === "ko" ? "생성일:" : "Generated on"} ${new Date().toLocaleDateString()}</p>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </body>
      </html>
    `;
  }

  /**
   * CSS Print Media 방식으로 PDF 생성
   */
  async generatePDF(data: Company[], language: "ko" | "en"): Promise<void> {
    try {
      // 새 창에서 PDF용 HTML 열기
      const printWindow = window.open("about:blank", "_blank", "width=800,height=600,scrollbars=yes,resizable=yes");

      if (!printWindow) {
        throw new Error("팝업이 차단되었습니다. 팝업 차단을 해제해주세요.");
      }

      // HTML 내용 작성
      printWindow.document.write(this.generatePDFHTML(data, language));
      printWindow.document.close();

      // 폰트 로딩 대기
      await printWindow.document.fonts.ready;

      // 인쇄 대화상자 열기
      printWindow.focus();
      printWindow.print();

      // 인쇄 완료 후 창 닫기 (사용자가 취소해도 닫힘)
      printWindow.addEventListener("afterprint", () => {
        printWindow.close();
      });

      // 5초 후 자동 닫기 (안전장치)
      setTimeout(() => {
        if (!printWindow.closed) {
          printWindow.close();
        }
      }, 5000);
    } catch (error) {
      console.error("CSS PDF 생성 실패:", error);
      throw new Error(`PDF 생성에 실패했습니다: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  /**
   * PDF 미리보기 (외부 새창에서 깔끔하게 표시)
   */
  async previewPDF(data: Company[], language: "ko" | "en"): Promise<void> {
    try {
      // 외부 새창으로 열기 (더 큰 크기로 설정)
      const printWindow = window.open("about:blank", "_blank", "width=1200,height=800,scrollbars=yes,resizable=yes");

      if (!printWindow) {
        throw new Error("팝업이 차단되었습니다. 팝업 차단을 해제해주세요.");
      }

      // HTML 내용 작성
      printWindow.document.write(this.generatePDFHTML(data, language));
      printWindow.document.close();

      // 폰트 로딩 대기
      await printWindow.document.fonts.ready;

      // 미리보기 모드 스타일링 (깔끔한 배경)
      printWindow.document.body.style.background = "#f8f9fa";
      printWindow.document.body.style.padding = "30px";
      printWindow.document.body.style.margin = "0";

      // 창 포커스
      printWindow.focus();
    } catch (error) {
      console.error("PDF 미리보기 실패:", error);
      throw new Error(`PDF 미리보기에 실패했습니다: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }
}

// 싱글톤 인스턴스 export
export const cssPDFGenerator = CSSPDFGenerator.getInstance();
