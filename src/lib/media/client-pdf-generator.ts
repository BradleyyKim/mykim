import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import type { Company } from "@/app/career/page";

/**
 * PDF용 HTML 요소 생성
 */
function createPDFElement(data: Company[], language: "ko" | "en"): HTMLElement {
  const title = language === "ko" ? "경력기술서 - 김민영" : "Career Portfolio - Minyoung Kim";

  const element = document.createElement("div");
  element.className = "pdf-container";
  element.style.cssText = `
    position: absolute;
    top: -9999px;
    left: -9999px;
    width: 800px;
    padding: 40px;
    background: white;
    font-family: ${language === "ko" ? "'Noto Sans KR', sans-serif" : "'Roboto', sans-serif"};
    line-height: 1.6;
    color: #333;
  `;

  element.innerHTML = `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&family=Roboto:wght@400;700&display=swap');
      
      /* 전체 레이아웃 */
      body { margin: 0; padding: 0; }
      
      /* 제목 스타일 */
      .pdf-title { 
        font-size: 28px; 
        font-weight: 700; 
        text-align: center; 
        margin-bottom: 40px; 
        color: #2c3e50;
        border-bottom: 3px solid #3498db;
        padding-bottom: 20px;
      }
      
      /* 회사 섹션 */
      .pdf-company { 
        margin-bottom: 30px; 
        page-break-inside: avoid; 
        border: 1px solid #e1e8ed;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      }
      
      /* 회사 헤더 */
      .pdf-company-header {
        background: linear-gradient(135deg, #3498db, #2980b9);
        color: white;
        padding: 20px 25px;
      }
      
      .pdf-company-name { 
        font-size: 22px; 
        font-weight: 700; 
        margin-bottom: 8px; 
        margin: 0;
      }
      
      .pdf-position { 
        font-size: 16px; 
        opacity: 0.9; 
        margin: 0;
        font-weight: 400;
      }
      
      /* 프로젝트 컨테이너 */
      .pdf-projects-container {
        padding: 25px;
        background: white;
      }
      
      /* 프로젝트 스타일 */
      .pdf-project { 
        margin-bottom: 25px; 
        padding: 20px;
        border-left: 4px solid #3498db;
        background: #f8f9fa;
        page-break-inside: avoid;
      }
      
      .pdf-project-name { 
        font-size: 18px; 
        font-weight: 700; 
        margin-bottom: 10px; 
      }
      
      .pdf-project-period { 
        font-size: 14px; 
        color: #7f8c8d; 
        margin-bottom: 20px; 
      }
      
      .pdf-overview { 
        margin-bottom: 15px; 
        line-height: 1.7; 
      }
      
      .pdf-achievements { 
        margin-bottom: 15px; 
      }
      
      .pdf-achievements ul { 
        margin: 0; 
        padding-left: 20px; 
      }
      
      .pdf-achievements li { 
        margin-bottom: 8px; 
        line-height: 1.6; 
      }
      
      .pdf-tech-stack { 
        display: flex; 
        flex-wrap: wrap; 
        gap: 8px; 
      }
      
      .pdf-tech-tag { 
        background: #3498db; 
        color: white; 
        padding: 4px 12px; 
        border-radius: 20px; 
        font-size: 12px; 
        font-weight: 500; 
      }
      
      @media print {
        body { margin: 0; }
        .pdf-company { page-break-inside: avoid; }
        .pdf-project { page-break-inside: avoid; }
      }
    </style>
    <h1 class="pdf-title">${title}</h1>
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
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    `
      )
      .join("")}
  `;

  return element;
}

/**
 * 클라이언트 사이드에서 PDF 생성
 * 서버 타임아웃 문제를 해결하고 Hobby 플랜에서도 사용 가능
 */
export async function generateClientPDF(data: Company[], language: "ko" | "en"): Promise<Blob> {
  try {
    // 임시로 PDF용 HTML 요소 생성
    const tempElement = createPDFElement(data, language);
    document.body.appendChild(tempElement);

    // 폰트 로딩 대기
    await document.fonts.ready;

    // HTML을 이미지로 변환
    const canvas = await html2canvas(tempElement, {
      scale: 3, // 더 높은 해상도
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      width: tempElement.scrollWidth,
      height: tempElement.scrollHeight,
      logging: false, // 로그 비활성화
      removeContainer: false, // 컨테이너 유지
      imageTimeout: 15000, // 이미지 로딩 타임아웃
      onclone: clonedDoc => {
        // 클론된 문서에서 스타일 강제 적용
        const clonedElement = clonedDoc.querySelector(".pdf-container") as HTMLElement;
        if (clonedElement) {
          clonedElement.style.fontFamily = language === "ko" ? "'Noto Sans KR', sans-serif" : "'Roboto', sans-serif";
          clonedElement.style.fontSize = "14px";
        }

        // 모든 텍스트 요소에 폰트 강제 적용
        const allElements = clonedDoc.querySelectorAll("*");
        allElements.forEach((el: Element) => {
          const htmlEl = el as HTMLElement;
          if (htmlEl.style) {
            htmlEl.style.fontFamily = language === "ko" ? "'Noto Sans KR', sans-serif" : "'Roboto', sans-serif";
          }
        });
      }
    });

    // 임시 요소 제거
    document.body.removeChild(tempElement);

    // PDF 생성
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    const imgWidth = 210; // A4 너비
    const pageHeight = 295; // A4 높이
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    // 첫 페이지 추가
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // 여러 페이지가 필요한 경우
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // PDF를 Blob으로 변환
    const pdfBlob = pdf.output("blob");
    return pdfBlob;
  } catch (error) {
    console.error("클라이언트 PDF 생성 실패:", error);
    throw new Error(`PDF 생성에 실패했습니다: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

/**
 * PDF 다운로드
 */
export function downloadPDF(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
