# Collection of Works

雙切作品集系統 — 同一份專案，透過不同認知層級（展示版 / 專業版 / 工程紀錄）進行資訊重構。  
支援管理後台、草稿與預約發布、圖片上傳與自動清理、訪客端快取與冷啟動預防。

## 技術棧

- **前端**：Vue 3 + Vite + Vue Router + Axios（純 CSS 變數與 RWD，無預處理器）
- **後端**：Node.js + Express + TypeScript
- **資料庫**：Supabase (PostgreSQL)
- **儲存**：Supabase Storage (圖片)
- **部署**：Vercel (前端) / Render (後端)
- **測試**：Jest + ts-jest + Supertest

## 系統特色

### 訪客端
- **展示版**：問題 → 解法 → 影響，適合非技術決策者
- **專業版**：系統架構、設計決策、Trade-off、影響分析，適合工程師與面試官
  - 新增「邊界」、「一個演進方向」、「演進方向配圖」、「引導至工程紀錄」等欄位
- **工程紀錄**：迭代過程、核心問題、技術決策、未來演進
  - 新增「補充記錄」區塊，可記錄典型問題修復（啟用/停用，訪客端只顯示啟用項目）
- **模式切換**：前端 localStorage 快取 + 背景更新，接近瞬時切換
- **圖片輪播**：展示版、專業版、工程紀錄均支援輪播，手機版支援觸控滑動切換
- **響應式設計**：手機/平板/桌面自適應佈局，管理後台列表手機板卡片化，側邊欄折疊
- **冷啟動預防**：GitHub Actions 每 10 分鐘 ping 後端健康檢查，搭配 UptimeRobot 備援

### 管理後台
- **專案管理**：新增、編輯、軟刪除、復原
- **草稿／發布／預約發布**：可將專案設為草稿，或設定未來自動發布時間
- **狀態篩選**：Active / Draft / Deleted / All
- **內容編輯**（已元件化拆分）：
  - 基本資料（標題、Slug、縮圖上傳）
  - 展示版（系統定義、問題、解法、影響、延伸應用、圖片管理、體驗連結）
  - 專業版（系統定位、架構全景圖、資料流、邊界、架構挑戰、設計決策、演進方向配圖、引導至工程紀錄、GitHub 連結）
  - 工程紀錄（初始假設、迭代目標、核心問題、限制條件、工程決策、技術影響、Production 思維、未來演進、面試問題、架構圖輪播、補充記錄）
- **圖片管理**：上傳多圖／單圖，刪除時同步清除 Supabase Storage 檔案，避免遺留孤兒檔案
- **發布設定**：一鍵切換草稿／發布，設定預約發布時間

## 測試

後端使用 **Jest** + **ts-jest** + **Supertest** 進行單元測試與整合測試。

### 測試覆蓋範圍
- **單元測試**：Mapper（如 `ProjectMapper`）、工具類（`AppError`）、服務層核心邏輯（`AdminService.publish`）
- **整合測試**：管理員 API（專案 CRUD、展示版更新）、訪客端 API（取得專案列表、展示版內容）

### 執行測試

```bash
cd backend
npm test              # 執行所有測試（單元 + 整合）
npm run test:watch    # 監聽模式
npm run test:coverage # 產生覆蓋率報告
測試環境設定
測試環境變數請參考 .env.test（需自行建立，不提交至版本控制）

整合測試需要可連線的 Supabase 測試專案與管理員帳號

若僅需執行單元測試，可使用 npm test -- --testPathIgnorePatterns integration

測試狀態
✅ 單元測試：全部通過，核心商業邏輯正確

⚠️ 整合測試：需配置測試資料庫方可完整通過（程式碼邏輯無誤）

啟動本機開發
後端
bash
cd backend
npm install
npm run dev

前端
bash
cd frontend
npm install
npm run dev

作者
Xiang