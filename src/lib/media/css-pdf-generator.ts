import type { Company } from "@/app/career/page";

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
          
          /* 회사 섹션 - 페이지 분할 제어 */
          .pdf-company { 
            margin-bottom: 25px; 
            page-break-inside: avoid;
            break-inside: avoid;
            border: 1px solid #ddd;
            border-radius: 0;
            overflow: hidden;
            box-shadow: none;
          }
          
          /* 회사 헤더 */
          .pdf-company-header {
            background: #1a1a1a;
            color: white;
            padding: 15px 20px;
          }
          
          .pdf-company-name { 
            font-size: 16px; 
            font-weight: 600; 
            margin-bottom: 5px; 
            margin: 0;
          }
          
          .pdf-position { 
            font-size: 12px; 
            opacity: 0.8; 
            margin: 0;
            font-weight: 400;
          }
          
          /* 프로젝트 컨테이너 */
          .pdf-projects-container {
            padding: 20px;
            background: white;
          }
          
          /* 프로젝트 스타일 - 페이지 분할 제어 */
          .pdf-project { 
            margin-bottom: 20px; 
            padding: 15px;
            border-left: 2px solid #333;
            background: #fafafa;
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
            margin-bottom: 12px; 
            line-height: 1.5; 
            font-size: 11px;
            color: #333;
          }
          
          .pdf-achievements { 
            margin-bottom: 12px; 
          }
          
          .pdf-achievements ul { 
            margin: 0; 
            padding-left: 15px; 
          }
          
          .pdf-achievements li { 
            margin-bottom: 6px; 
            line-height: 1.4; 
            font-size: 11px;
            color: #333;
          }
          
          .pdf-tech-stack { 
            display: flex; 
            flex-wrap: wrap; 
            gap: 6px; 
            margin: 12px 0;
          }
          
          .pdf-tech-tag { 
            background: #333; 
            color: white; 
            padding: 3px 8px; 
            border-radius: 0; 
            font-size: 10px; 
            font-weight: 500; 
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
                            <div class="pdf-achievements">
                              <ul>
                                ${project.achievements.map(achievement => `<li>${achievement}</li>`).join("")}
                              </ul>
                            </div>
                            ${
                              project.techStack && project.techStack.length > 0
                                ? `
                            <div class="pdf-tech-stack">
                              ${project.techStack.map(tech => `<span class="pdf-tech-tag">${tech}</span>`).join("")}
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
