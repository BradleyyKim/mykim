import { generateCareerHTML } from "./html-generator";
import type { Company } from "@/app/career/page";

export async function generateCareerPDF(data: Company[], language: "ko" | "en"): Promise<Buffer> {
  let browser;

  try {
    // Vercel 공식 방법: 환경별 동적 로딩
    const isVercel = !!process.env.VERCEL_ENV;
    let puppeteer: typeof import("puppeteer") | typeof import("puppeteer-core");
    let launchOptions: {
      headless: boolean;
      args?: string[];
      executablePath?: string;
    } = {
      headless: true
    };

    if (isVercel) {
      // Vercel 환경: puppeteer-core + @sparticuz/chromium
      try {
        const chromium = (await import("@sparticuz/chromium")).default;
        puppeteer = await import("puppeteer-core");
        launchOptions = {
          ...launchOptions,
          args: chromium.args,
          executablePath: await chromium.executablePath()
        };
      } catch (importError) {
        throw new Error(
          `Vercel 환경 패키지 로딩 실패: ${importError instanceof Error ? importError.message : "Unknown error"}`
        );
      }
    } else {
      // 로컬 환경: 표준 puppeteer
      try {
        puppeteer = await import("puppeteer");
      } catch (importError) {
        throw new Error(
          `로컬 환경 puppeteer 로딩 실패: ${importError instanceof Error ? importError.message : "Unknown error"}`
        );
      }
    }

    browser = await puppeteer.launch(launchOptions);

    const page = await browser.newPage();

    // 페이지 최적화 설정
    await page.setViewport({ width: 1200, height: 800 });
    await page.setCacheEnabled(false);
    await page.setJavaScriptEnabled(true);

    // 한국어 폰트 로딩을 위한 스크립트 주입
    await page.evaluateOnNewDocument(() => {
      const link = document.createElement("link");
      link.href =
        "https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&family=Roboto:wght@400;700&display=swap";
      link.rel = "stylesheet";
      document.head.appendChild(link);
    });

    // HTML 생성
    const html = generateCareerHTML(data, language);

    // 페이지에 HTML 설정
    await page.setContent(html, {
      waitUntil: "networkidle0",
      timeout: 30000
    });

    // 폰트 로딩 대기
    await page.evaluate(() => {
      return document.fonts.ready;
    });

    // PDF 생성
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20mm",
        right: "20mm",
        bottom: "20mm",
        left: "20mm"
      },
      displayHeaderFooter: false,
      preferCSSPageSize: true
    });

    return Buffer.from(pdf);
  } catch (error) {
    console.error(`PDF 생성 실패 (${language}):`, error);
    throw new Error(`PDF 생성에 실패했습니다: ${error instanceof Error ? error.message : "Unknown error"}`);
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch {
        // 브라우저 종료 실패는 무시 (이미 PDF 생성 완료)
      }
    }
  }
}
