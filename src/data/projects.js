// 專案假資料，包含展示版與專業版兩種文字
export const projects = [
  {
    id: 1,
    title: '電商網站設計',
    images: 'https://picsum.photos/400/300?random=1',
    showcaseText: '簡潔現代 UI，適合作品集展示',
    professionalText: '採用 Vue 3 + Pinia 架構，完整金流與後台整合',
    type: 'official',
  },
  {
    id: 2,
    title: '天氣小工具',
    images: 'https://picsum.photos/400/300?random=2',
    showcaseText: '可愛動態圖示，即時天氣查詢',
    professionalText: '串接中央氣象局 API，支援多城市切換與圖表統計',
    type: 'practice',
  },
  {
    id: 3,
    title: '個人部落格主題',
    images: 'https://picsum.photos/400/300?random=3',
    showcaseText: '極簡閱讀體驗，夜間模式',
    professionalText: '基於 Markdown 的靜態生成，SEO 友善',
    type: 'official',
  },
  // 可繼續增加更多假資料
];