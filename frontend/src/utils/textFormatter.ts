/**
 * 將純文字轉為 HTML，保留換行與空格
 * 同時轉義 HTML 特殊字符以避免 XSS（若需允許簡易 HTML，可使用 DOMPurify）
 */
export function formatText(text: string | null | undefined): string {
  if (!text) return '';
  
  // 轉義 HTML 特殊字符
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
  
  // 將 \n 轉為 <br>，並保留連續空格
  return escaped.replace(/\n/g, '<br>').replace(/\s/g, '&nbsp;');
}