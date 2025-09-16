/**
 * 이미지 관련 유틸리티 함수들
 */

/**
 * Base64 데이터를 File 객체로 변환
 */
export function base64ToFile(base64Data: string, fileName: string): File {
  const arr = base64Data.split(",");
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : "image/png";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], fileName, { type: mime });
}

/**
 * 이미지 URL이 Base64인지 확인
 */
export function isBase64Image(url: string): boolean {
  return url.startsWith("data:image/");
}
