<template>
  <div class="home">
    <h1>同一份專案，不同認知層級</h1>
    <p class="subtitle">這是一個知識重構系統</p>

    <div class="modes">
      <div class="mode-card">
        <h2>📋 展示版</h2>
        <p>給尋找協作夥伴、非技術決策者</p>
        <ul>
          <li>快速理解專案核心價值</li>
          <li>問題 → 解法 → 影響</li>
          <li>無技術術語</li>
        </ul>
      </div>

      <div class="mode-card">
        <h2>⚙️ 專業版</h2>
        <p>給工程師、技術面試官</p>
        <ul>
          <li>系統架構與資料流</li>
          <li>設計決策與 Trade-off</li>
          <li>可深入查看工程紀錄</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home { text-align: center; padding-top: 60px; }
.subtitle { font-size: 1.1rem; margin-bottom: 48px; }
.modes {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  max-width: 700px;
  margin: 0 auto;
}
.mode-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 28px;
  text-align: left;
}
.mode-card h2 { margin-top: 0; }
.mode-card ul {
  list-style: none;
  padding: 0;
}
.mode-card li {
  padding: 4px 0;
  color: var(--text-muted);
  font-size: 14px;
}
.mode-card li::before {
  content: '✓ ';
  color: var(--accent);
}
</style>