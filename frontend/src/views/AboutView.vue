<template>
  <div class="about-page">
    <!-- 頂部 Hero 區塊 -->
    <div class="hero">
      <div class="avatar">
        <span class="avatar-text">X</span>
      </div>
      <h1>Xiang</h1>
      <p class="title">全端開發者 / 系統設計愛好者</p>
      <p class="bio">
        熱愛建構高效、可維護的系統，專注於 Vue.js、Node.js 與 Supabase。<br>
                相信好的程式碼不只是解決問題，更能傳遞知識。
      </p>
    </div>

    <!-- 技術棧 -->
    <section class="section">
      <h2>🛠️ 技術與工具</h2>
      <div class="tech-grid">
        <div class="tech-group">
          <h3>前端</h3>
          <div class="tags">
            <span class="tag">Vue 3</span>
            <span class="tag">Vite</span>
            <span class="tag">Pinia</span>
            <span class="tag">Vue Router</span>
            <span class="tag">Axios</span>
            <span class="tag">SCSS</span>
          </div>
        </div>
        <div class="tech-group">
          <h3>後端</h3>
          <div class="tags">
            <span class="tag">Node.js</span>
            <span class="tag">Express</span>
            <span class="tag">TypeScript</span>
            <span class="tag">RESTful API</span>
            <span class="tag">JWT</span>
            <span class="tag">bcrypt</span>
          </div>
        </div>
        <div class="tech-group">
          <h3>資料庫與儲存</h3>
          <div class="tags">
            <span class="tag">Supabase (PostgreSQL)</span>
            <span class="tag">MongoDB</span>
            <span class="tag">Cloudinary</span>
          </div>
        </div>
        <div class="tech-group">
          <h3>開發與部署</h3>
          <div class="tags">
            <span class="tag">Git</span>
            <span class="tag">GitHub Actions</span>
            <span class="tag">Vercel</span>
            <span class="tag">Render</span>
            <span class="tag">Docker (基礎)</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 作品集理念 -->
    <section class="section">
      <h2>💡 作品集理念</h2>
      <div class="philosophy-cards">
        <div class="card">
          <h3>📋 展示版</h3>
          <p>問題 → 解法 → 影響，適合非技術決策者快速理解專案價值，無技術術語。</p>
        </div>
        <div class="card">
          <h3>⚙️ 專業版</h3>
          <p>系統架構、設計決策、Trade-off，適合工程師與面試官深入探討。</p>
        </div>
        <div class="card">
          <h3>📓 工程紀錄</h3>
          <p>迭代過程、核心問題、技術決策、未來演進，展現解決問題的思路。</p>
        </div>
      </div>
      <p class="quote">
        「同一份專案，不同認知層級 — 用最適合的語言，向對的人傳遞價值。」
      </p>
    </section>

    <!-- 聯繫方式 -->
    <section class="section">
      <h2>📫 聯繫我</h2>
      <div class="contact-links">
        <p>開發中...</p>
        <!-- <a href="https://github.com/Xiang891202" target="_blank" rel="noopener noreferrer" class="contact-btn github">
          <span>GitHub</span>
        </a> -->
        <!-- <a href="mailto:ah891202@gmail.com" class="contact-btn email">
          <span>Email</span>
        </a> -->
        <!-- 可擴充其他連結 -->
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// 純展示頁面，無需邏輯
</script>

<style scoped>
.about-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px 60px;
}

/* Hero 區塊 */
.hero {
  text-align: center;
  margin-bottom: 48px;
  padding: 32px 0;
}
.avatar {
  width: 100px;
  height: 100px;
  background: var(--accent);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}
.avatar-text {
  font-size: 48px;
  font-weight: bold;
  color: white;
}
h1 {
  font-size: 2.2rem;
  margin-bottom: 8px;
}
.title {
  font-size: 1.1rem;
  color: var(--accent);
  margin-bottom: 16px;
}
.bio {
  font-size: 1rem;
  color: var(--text-muted);
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
}

/* 章節通用 */
.section {
  margin-bottom: 56px;
}
.section h2 {
  text-align: center;
  border-bottom: 1px solid var(--border);
  padding-bottom: 12px;
  margin-bottom: 28px;
}

/* 技術棧網格 */
.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 24px;
}
.tech-group {
  background: var(--surface);
  padding: 20px;
  border-radius: var(--radius);
  border: 1px solid var(--border);
}
.tech-group h3 {
  margin-bottom: 12px;
  font-size: 1.1rem;
}
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.tag {
  background: var(--tag-bg);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  color: var(--text-muted);
}

/* 理念卡片 */
.philosophy-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
  margin-bottom: 28px;
}
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 20px;
  transition: border-color 0.2s;
}
.card:hover {
  border-color: var(--accent);
}
.card h3 {
  margin-bottom: 8px;
}
.card p {
  font-size: 0.9rem;
  line-height: 1.5;
}
.quote {
  text-align: center;
  font-style: italic;
  color: var(--text-muted);
  border-left: 3px solid var(--accent);
  padding: 12px 24px;
  background: var(--surface);
  border-radius: var(--radius);
  margin-top: 20px;
}

/* 聯繫按鈕 */
.contact-links {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}
.contact-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--surface);
  border: 1px solid var(--border);
  padding: 12px 28px;
  border-radius: 40px;
  color: var(--text);
  font-weight: 500;
  transition: all 0.2s;
}
.contact-btn:hover {
  border-color: var(--accent);
  background: var(--accent);
  color: white;
  transform: translateY(-2px);
}
.contact-btn.github:hover {
  background: #24292e;
  border-color: #24292e;
}
.contact-btn.email:hover {
  background: #ea4335;
  border-color: #ea4335;
}

/* 響應式 */
@media (max-width: 768px) {
  .hero {
    padding: 20px 0;
  }
  .avatar {
    width: 80px;
    height: 80px;
  }
  .avatar-text {
    font-size: 36px;
  }
  h1 {
    font-size: 1.8rem;
  }
  .tech-grid {
    grid-template-columns: 1fr;
  }
  .philosophy-cards {
    grid-template-columns: 1fr;
  }
}
</style>