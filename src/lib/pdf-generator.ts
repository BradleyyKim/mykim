import puppeteer from "puppeteer";

interface Project {
  name: string;
  period: string;
  overview: string;
  achievements: string[];
  techStack?: string[];
}

interface Company {
  name: string;
  period: string;
  position: string;
  projects: Project[];
}

export async function generateCareerPDF(data: Company[], language: "ko" | "en"): Promise<Buffer> {
  let browser;

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"]
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 800 });

    const html = generateHTMLTemplate(data, language);
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "30px", right: "30px", bottom: "30px", left: "30px" },
      displayHeaderFooter: false,
      preferCSSPageSize: true
    });

    return Buffer.from(pdfBuffer);
  } finally {
    if (browser) await browser.close();
  }
}

function generateHTMLTemplate(data: Company[], language: "ko" | "en"): string {
  console.log(`[pdf-generator] PDF 생성에 사용되는 ${language} 데이터:`, JSON.stringify(data, null, 2));

  const title = language === "ko" ? "경력기술서 - 김민영" : "Career Portfolio - Minyoung Kim";

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${title}</title>
      <meta name="author" content="김민영">
      <meta name="subject" content="경력기술서">
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&family=Roboto:wght@400;700&display=swap" rel="stylesheet">
      <style>
        body {
          font-family: ${language === "ko" ? "Noto Sans KR" : "Roboto"}, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 30px;
        }
        .title {
          font-size: 28px;
          font-weight: 700;
          text-align: center;
          margin-bottom: 40px;
          color: #2c3e50;
        }
        .company {
          margin-bottom: 30px;
          page-break-inside: avoid;
        }
        .company-name {
          font-size: 20px;
          font-weight: 700;
          color: #34495e;
          margin-bottom: 10px;
        }
        .position {
          font-size: 16px;
          color: #7f8c8d;
          margin-bottom: 20px;
        }
        .project {
          margin-bottom: 25px;
          padding: 20px;
          border-left: 4px solid #3498db;
          background-color: #f8f9fa;
        }
        .project-name {
          font-size: 18px;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 10px;
        }
        .project-period {
          font-size: 14px;
          color: #7f8c8d;
          margin-bottom: 15px;
        }
        .overview {
          margin-bottom: 15px;
          line-height: 1.7;
        }
        .achievements {
          margin-bottom: 15px;
        }
        .achievements ul {
          margin: 0;
          padding-left: 20px;
        }
        .achievements li {
          margin-bottom: 8px;
          line-height: 1.6;
        }
        .tech-stack {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .tech-tag {
          background-color: #3498db;
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
        }
        @media print {
          body { margin: 0; }
          .company { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <h1 class="title">${title}</h1>
      
      ${data
        .map(
          (company: Company) => `
        <div class="company">
          <h2 class="company-name">${company.name}</h2>
          <div class="position">${company.position} | ${company.period}</div>
          
          ${company.projects
            .map(
              (project: Project) => `
            <div class="project">
              <h3 class="project-name">${project.name}</h3>
              <div class="project-period">${project.period}</div>
              
              <div class="overview">
                ${project.overview}
              </div>
              
              <div class="achievements">
                <ul>
                  ${project.achievements.map((achievement: string) => `<li>${achievement}</li>`).join("")}
                </ul>
              </div>
              
              ${
                project.techStack
                  ? `
                <div class="tech-stack">
                  ${project.techStack.map((tech: string) => `<span class="tech-tag">${tech}</span>`).join("")}
                </div>
              `
                  : ""
              }
            </div>
          `
            )
            .join("")}
        </div>
      `
        )
        .join("")}
    </body>
    </html>
  `;
}
