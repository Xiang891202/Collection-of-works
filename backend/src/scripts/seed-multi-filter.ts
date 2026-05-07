import { config } from '../config/index';

const BASE = `${config.supabase.url}/rest/v1`;
const HEADERS = {
  'apikey': config.supabase.serviceRoleKey,
  'Authorization': `Bearer ${config.supabase.serviceRoleKey}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation',
};

async function seed() {
  console.log('匯入多重篩選專案完整內容...\n');

  // 先刪除舊資料
  const check = await fetch(`${BASE}/projects?slug=eq.multi-filter&limit=1`, { headers: HEADERS });
  if (check.ok) {
    const old = await check.json();
    if (old.length > 0) {
      const oldId = old[0].id;
      await fetch(`${BASE}/showcase_content?project_id=eq.${oldId}`, { method: 'DELETE', headers: HEADERS });
      await fetch(`${BASE}/professional_content?project_id=eq.${oldId}`, { method: 'DELETE', headers: HEADERS });
      await fetch(`${BASE}/case_study_content?project_id=eq.${oldId}`, { method: 'DELETE', headers: HEADERS });
      await fetch(`${BASE}/projects?id=eq.${oldId}`, { method: 'DELETE', headers: HEADERS });
      console.log('舊資料已刪除');
    }
  }

  // 1. 建立專案
  const res1 = await fetch(`${BASE}/projects`, {
    method: 'POST', headers: HEADERS,
    body: JSON.stringify({
      slug: 'multi-filter',
      title: '多重篩選房屋平台',
      tag: '練習專案',
      thumbnail_url: null,
      one_liner: '以互動地圖、收藏與會員管理，解決傳統找房需跨多平台比對的問題',
      status: 'active',
    }),
  });
  const projects = await res1.json();
  const pid = projects[0].id;
  console.log('✅ 專案建立:', pid);

  // 2. 展示版內容
  const showcaseData = {
    systemDefinition: '一個整合地圖、收藏與會員管理的房屋租售平台，讓使用者能直覺地在互動地圖上探索房源，並管理自己的喜好清單。',
    problem: '使用者端：傳統找房需要跨多個平台比對資訊，無法快速定位特定區域的房源，也難以記錄感興趣的物件。管理者端：手動維護房源資料耗時且容易出錯，圖片管理混亂，缺乏集中式的上架與編輯工具。',
    solution: '互動地圖探索：拖動地圖即可自動顯示該區域所有房源，搭配圖標聚合，即使房源密集也能清晰瀏覽。一鍵收藏：看到感興趣的房源，登入後點擊愛心即可收藏，隨時在收藏頁回顧與比較。集中管理後台：管理者可在統一介面中新增、編輯、刪除房源，包含多圖上傳與主圖設定。會員專屬功能：登入後可編輯個人資料、修改密碼，系統會自動記住登入狀態。',
    impact: '更快：地圖拖動即時顯示房源，不再需要手動搜尋地址或切換頁面。更穩定：統一的錯誤處理機制，操作過程中不會因意外錯誤而中斷。更容易管理：管理者可在同一平台完成所有房源操作，無需接觸資料庫。更不容易出錯：前後端資料格式統一、表單驗證完整，減少人為疏失。',
    extendedApplications: [
      '可擴展為完整的租屋/售屋交易平台，加入預約看屋、線上簽約功能',
      '可將地圖模式應用於其他領域，如店面選址分析、商圈評估',
      '收藏與會員系統可擴充為個人化推薦引擎，根據喜好推送合適房源',
    ],
    images: [],
  };
  const r2 = await fetch(`${BASE}/showcase_content`, {
    method: 'POST', headers: HEADERS,
    body: JSON.stringify({ project_id: pid, data: showcaseData }),
  });
  console.log(r2.ok ? '✅ showcase_content' : '❌ showcase');

  // 3. 專業版內容
  const professionalData = {
    systemGoal: '設計一個支援會員認證、收藏同步、地圖範圍查詢與管理員後台的全端房屋資訊系統，重點處理前後端資料一致性、API 合約設計與可維護性架構。',
    techStack: {
      frontend: ['Vue 3', 'Vite', 'Pinia', 'Vue Router', 'Leaflet'],
      backend: ['Node.js', 'Express', 'MongoDB Atlas', 'Mongoose'],
      storage: ['Cloudinary'],
    },
    architectureDiagram: null,
    dataFlow: 'Client → Router Guard → Pinia Store Action → Axios Instance (with JWT) → Express Route → Auth Middleware → Controller → Service → Model → MongoDB → Response',
    keyProcesses: [
      '地圖查詢：地圖事件 → 防抖處理 → 計算 bounds → GET /products/map/properties → 更新左側列表',
      '收藏同步：點擊愛心 → 判斷登入狀態 → POST/DELETE /favorites → 重新 fetch 完整列表 → 即時更新 UI',
    ],
    coreProblems: [
      { title: '前後端資料結構不一致導致狀態判斷錯誤', description: '後端回傳的收藏資料結構與前端 store 預期不符，導致 isFavorited getter 無法正確識別收藏狀態' },
      { title: '錯誤處理機制不統一', description: 'Service 層拋出一般 Error，Controller 無法區分客戶端錯誤 (4xx) 與伺服器錯誤 (5xx)' },
      { title: '路由順序導致動態路由吞噬特定 API', description: 'Express 中 /:id 放在 /map/properties 前，導致 /map/properties 被當作 /:id 解析' },
    ],
    designDecisions: [
      { problem: '收藏狀態判斷錯誤', rootCause: '後端回傳的收藏資料有時包裹在 { product: {...} } 結構中，前端比對失敗', solution: '統一在 POST/DELETE 後重新 fetch，改用 Set 儲存 favoriteIds，O(1) 查詢', alternative: '樂觀更新。未採用：收藏頻率不高，重新 fetch 成本可接受，避免狀態不一致' },
      { problem: '錯誤處理機制不統一', rootCause: '未規劃自訂錯誤類別，Service 層直接 throw new Error()', solution: '建立 AppError 類別繼承 Error，加入 statusCode 屬性', alternative: '在 Controller 手動判斷 error.message。未採用：違反 DRY 原則' },
      { problem: '路由順序', rootCause: 'Express 依序匹配路由，/:id 定義在 /map/properties 之前', solution: '靜態路由移到動態路由之前，管理員路由獨立掛載', alternative: '用正則限制 :id 格式。未採用：僅解決特定案例' },
    ],
    tradeOffs: [
      { decision: '收藏狀態更新', chosen: 'POST/DELETE 後重新 fetch', sacrificed: '本地樂觀更新', reason: 'MVP 階段追求資料一致性優先' },
      { decision: '圖片儲存', chosen: 'Cloudinary 手動上傳', sacrificed: 'multer-storage-cloudinary', reason: '避免依賴衝突' },
      { decision: '管理員路由', chosen: '獨立 adminProductRoutes', sacrificed: '與公開路由共用', reason: '隔離權限邏輯' },
      { decision: '地圖防抖', chosen: '前端自定義 debounce', sacrificed: 'lodash', reason: '減少依賴' },
      { decision: '密碼更新', chosen: 'user.save() 觸發 pre hook', sacrificed: 'findByIdAndUpdate', reason: '確保 bcrypt 必定執行' },
    ],
    impactAnalysis: {
      scalability: 'Controller/Service/Model 分層清晰，新增業務模組僅需依相同結構擴充',
      maintainability: '統一錯誤處理機制，前端統一 API 實例，SCSS 變數集中管理',
      reliability: '路由守衛 + JWT 攔截器，全域錯誤中介層統一捕捉',
      consistency: '前後端 API 回應格式統一，收藏操作後強制重新 fetch',
      performance: '收藏判斷使用 Set.has()，地圖事件防抖，圖片 Cloudinary CDN',
    },
    futureEvolution: [
      { level: '10x 流量', plan: '引入 Redis 快取熱門房源與地圖範圍查詢結果' },
      { level: '100x 流量', plan: '拆分為微服務架構，使用 Message Queue 處理非同步任務' },
    ],
    interviewQuestions: [
      '為什麼收藏操作後要重新 fetch 整個列表，而不是在前端直接更新本地狀態？',
      '如果地圖範圍內有 10,000 筆房源，目前的 API 設計會遇到什麼問題？',
      '你如何確保 JWT token 過期後的使用者體驗？',
      '為什麼選擇將管理員路由獨立，而不是在既有路由中加入權限判斷？',
      '如果多個管理員同時編輯同一房源，如何處理 race condition？',
    ],
  };
  const r3 = await fetch(`${BASE}/professional_content`, {
    method: 'POST', headers: HEADERS,
    body: JSON.stringify({ project_id: pid, data: professionalData }),
  });
  console.log(r3.ok ? '✅ professional_content' : '❌ professional');

  // 4. 工程紀錄內容
  const caseStudyData = {
    initialAssumption: {
      architecture: '標準的前後端分離架構，Express + MongoDB 提供 RESTful API，Vue 3 渲染畫面',
      dataFlow: 'User Action → Vue Component → Pinia Store → Axios → Express → Controller → Service → MongoDB → Response',
      limitations: '僅處理少量測試資料，未考量分頁效能，圖片本機儲存，管理員功能後期補上',
    },
    iterationGoal: '從零建立可維護、具備會員認證、地圖查詢、收藏同步與管理員後台的全端房屋資訊系統',
    coreProblems: [
      { title: '前後端資料結構不一致', rootCause: 'populate 導致回傳格式不一致，前端比對失敗', solution: '強制重新 fetch + Set 優化查詢', alternative: '樂觀更新，未採用因需回滾邏輯' },
      { title: '錯誤處理缺乏分層', rootCause: 'Service 層用 Error，無 statusCode', solution: 'AppError 類別 + 全域 middleware', alternative: 'Controller 手動判斷，未採用因違反 DRY' },
      { title: '路由設計缺陷', rootCause: '/:id 在 /map/properties 之前', solution: '靜態路由優先 + 拆分路由檔', alternative: '正則限制，未採用因不根本' },
    ],
    constraints: [
      { constraint: 'MVP 優先', reason: '不引入 Redis、Queue 等中間件' },
      { constraint: '開發時間', reason: '一人開發，數週內完成全功能' },
      { constraint: '部署限制', reason: 'Render + Vercel 免費方案，後端會休眠' },
      { constraint: '複雜度取捨', reason: '重新 fetch 而非樂觀更新' },
    ],
    engineeringDecisions: [
      { problem: '資料結構不一致', decision: '強制重新 fetch + Set 優化', why: '確保一致性，O(1) 查詢' },
      { problem: '錯誤處理', decision: 'AppError + middleware', why: '分層職責清晰' },
      { problem: '路由設計', decision: '調整順序 + 拆分', why: '靜態優先，權限隔離' },
    ],
    technicalImpact: {
      maintainability: '降低耦合，減少重複邏輯',
      scalability: '模組邊界清晰，可拆分微服務',
      reliability: '收藏強制同步，全域錯誤捕捉',
      performance: 'Set.has() 優化，防抖處理，CDN',
      security: '移除 console.log，bcrypt 加密',
    },
    productionThinking: [
      { scenario: '後端休眠', strategy: 'UptimeRobot 定時 ping' },
      { scenario: '圖片上傳失敗', strategy: '回傳錯誤訊息，前端提示重試' },
      { scenario: 'JWT 過期', strategy: 'axios 攔截器捕捉 401，自動登出' },
      { scenario: 'CORS 錯誤', strategy: '白名單包含所有環境' },
    ],
    futureEvolution: [
      { scale: '10x 流量', approach: 'Redis 快取地圖查詢結果' },
      { scale: '100x 流量', approach: '微服務拆分 + Message Queue' },
    ],
    interviewQuestions: [
      '為什麼收藏後要重新 fetch，何時改選樂觀更新？',
      '10,000 筆房源時 API 的瓶頸與優化？',
      'JWT 過期的前後端處理？',
      '管理員路由獨立 vs middleware 的 trade-off？',
      '多管理員同時編輯的 concurrency 處理？',
    ],
    diagrams: [],
  };
  const r4 = await fetch(`${BASE}/case_study_content`, {
    method: 'POST', headers: HEADERS,
    body: JSON.stringify({ project_id: pid, version: 1, data: caseStudyData }),
  });
  console.log(r4.ok ? '✅ case_study_content' : '❌ case study');

  console.log('\n🎉 匯入完成！');
}

seed();