# Collection of Works

雙切作品集系統 — 同一份專案，透過不同認知層級（展示版 / 專業版 / 工程紀錄）進行資訊重構。

## 技術棧

- **前端**：Vue 3 + Vite + Vue Router + Axios
- **後端**：Node.js + Express + TypeScript
- **資料庫**：Supabase (PostgreSQL)
- **部署**：Vercel (前端) / Render (後端)

## 啟動本機開發

### 後端

```bash
cd backend
npm install
npm run dev
前端
bash
cd frontend
npm install
npm run dev
設定 .env 變數參考 backend/.env.example。

系統特色
同一專案可切換「展示版」(problem→solution→impact) 與「專業版」(architecture→trade-off→scalability)

專業版可進一步查看「工程紀錄」(case study)

模式由 URL 決定，後端依 mode 回傳不同 DTO

前端預載與快取策略，模式切換接近瞬時

管理員後台（規劃中）

作者
Xiang