<template>
  <div>
    <!-- Loading -->
    <div v-if="isLoading" class="loading">載入中...</div>

    <!-- 展示版 -->
    <div v-else-if="currentMode === 'showcase' && currentData">
      <article class="showcase">
        <h1>{{ (currentData as any).systemDefinition }}</h1>
        <section>
          <h2>⚠️ 解決的問題</h2>
          <p>{{ (currentData as any).problem }}</p>
        </section>
        <section>
          <h2>🧩 如何解決</h2>
          <p>{{ (currentData as any).solution }}</p>
        </section>
        <section>
          <h2>🏗 帶來的改變</h2>
          <p>{{ (currentData as any).impact }}</p>
        </section>
        <section v-if="(currentData as any).extendedApplications?.length">
          <h2>🔭 延伸應用</h2>
          <ul>
            <li v-for="app in (currentData as any).extendedApplications" :key="app">
              {{ app }}
            </li>
          </ul>
        </section>
        <!-- 圖片輪播 -->
        <section v-if="showcaseImages.length" class="carousel-section">
          <h2>🖼 系統畫面</h2>
          <div class="carousel">
            <button @click="prevImage" class="carousel-btn">‹</button>
            <img :src="showcaseImages[currentImageIndex]" alt="展示圖片" class="carousel-img" />
            <button @click="nextImage" class="carousel-btn">›</button>
          </div>
          <div class="carousel-dots">
            <span
              v-for="(_img, i) in showcaseImages"
              :key="i"
              class="dot"
              :class="{ active: i === currentImageIndex }"
              @click="currentImageIndex = i"
            ></span>
          </div>
        </section>
        <!-- 展示版連結區塊 -->
        <div class="demo-links">
          <!-- 處理陣列格式 -->
          <template v-if="Array.isArray((currentData as any).demoUrl)">
            <a
              v-for="(link, idx) in (currentData as any).demoUrl"
              :key="idx"
              :href="link.url"
              target="_blank"
              class="action-btn"
            >
              🚀 {{ link.label || '線上體驗' }}
            </a>
          </template>
          <!-- 處理物件格式 { user, admin } -->
          <template v-else-if="(currentData as any).demoUrl && typeof (currentData as any).demoUrl === 'object'">
            <a
              v-if="(currentData as any).demoUrl.user"
              :href="(currentData as any).demoUrl.user"
              target="_blank"
              class="action-btn"
            >
              🚀 線上體驗
            </a>
            <a
              v-if="(currentData as any).demoUrl.admin"
              :href="(currentData as any).demoUrl.admin"
              target="_blank"
              class="action-btn"
            >
              <!-- 🔑 管理員入口 -->
            </a>
          </template>
          <!-- 處理字串格式 -->
          <template v-else-if="typeof (currentData as any).demoUrl === 'string'">
            <a :href="(currentData as any).demoUrl" target="_blank" class="action-btn">
              🚀 線上體驗
            </a>
          </template>
        </div>
      </article>
    </div>

    <!-- 專業版 -->
    <div v-else-if="currentMode === 'professional' && !showCaseStudy && currentData">
      <article class="professional">
        <h1>{{ (currentData as any).systemGoal }}</h1>

        <!-- 技術棧 -->
        <section>
          <h2>🏗 技術棧</h2>
          <div class="tech-stack" v-if="(currentData as any).techStack">
            <div>
              <strong>Frontend</strong>
              <p>{{ (currentData as any).techStack.frontend?.join(', ') }}</p>
            </div>
            <div>
              <strong>Backend</strong>
              <p>{{ (currentData as any).techStack.backend?.join(', ') }}</p>
            </div>
            <div>
              <strong>Storage</strong>
              <p>{{ (currentData as any).techStack.storage?.join(', ') }}</p>
            </div>
          </div>
        </section>

        <!-- 架構全景圖 -->
        <section v-if="(currentData as any).architectureDiagram">
          <h2>📐 架構全景圖</h2>
          <img :src="(currentData as any).architectureDiagram" alt="架構圖" class="arch-img" />
        </section>

        <!-- 資料流 -->
        <section>
          <h2>📡 資料流</h2>
          <p class="code-block">{{ (currentData as any).dataFlow }}</p>
        </section>

        <!-- 邊界 -->
        <section v-if="(currentData as any).boundary">
          <h2>🔲 邊界</h2>
          <p>{{ (currentData as any).boundary }}</p>
        </section>

        <!-- 最關鍵的架構挑戰 -->
        <section v-if="(currentData as any).coreProblems?.length">
          <h2>⚠️ 最關鍵的架構挑戰</h2>
          <div v-for="(cp, i) in (currentData as any).coreProblems" :key="i" class="problem-card">
            <h3>{{ cp.title }}</h3>
            <p>{{ cp.description }}</p>
          </div>
        </section>

        <!-- 最關鍵的設計決策 -->
        <section v-if="(currentData as any).designDecisions?.length">
          <h2>🧩 最關鍵的設計決策</h2>
          <div v-for="(dd, i) in (currentData as any).designDecisions" :key="i" class="decision-card">
            <h3>{{ dd.problem }}</h3>
            <p><strong>根因：</strong>{{ dd.rootCause }}</p>
            <p><strong>解法：</strong>{{ dd.solution }}</p>
            <p v-if="dd.alternative"><strong>替代方案：</strong>{{ dd.alternative }}</p>
          </div>
        </section>

        <!-- 一個演進方向（文字） -->
        <section v-if="(currentData as any).evolutionDirection">
          <h2>🔭 一個演進方向</h2>
          <p>{{ (currentData as any).evolutionDirection }}</p>
        </section>

        <!-- 演進方向配圖（輪播） -->
        <section v-if="evolutionImages.length" class="carousel-section">
          <h2>🖼 演進方向配圖</h2>
          <div class="carousel">
            <button @click="prevEvolutionImage" class="carousel-btn">‹</button>
            <img :src="evolutionImages[evolutionImageIndex]" class="carousel-img" />
            <button @click="nextEvolutionImage" class="carousel-btn">›</button>
          </div>
          <div class="carousel-dots">
            <span
              v-for="(_img, i) in evolutionImages"
              :key="i"
              class="dot"
              :class="{ active: i === evolutionImageIndex }"
              @click="evolutionImageIndex = Number(i)"
            ></span>
          </div>
        </section>

        <!-- 引導至工程紀錄 -->
        <section v-if="(currentData as any).caseStudyGuide">
          <h2>📘 引導至工程紀錄</h2>
          <p>{{ (currentData as any).caseStudyGuide }}</p>
        </section>

        <!-- GitHub 按鈕 -->
        <a
            v-if="(currentData as any).githubUrl && (currentData as any).githubUrl.trim() !== ''"
            :href="(currentData as any).githubUrl"
            target="_blank"
            class="action-btn github-btn"
          >
            💻 GitHub
        </a>

        <!-- 查看工程紀錄按鈕 -->
        <button @click="openCaseStudy(route.params.slug as string)" class="case-study-btn">
          📋 查看工程紀錄
        </button>
      </article>
    </div>

    <!-- 工程紀錄 -->
    <div v-if="showCaseStudy">
      <button @click="closeCaseStudy" class="back-btn">← 返回專業版</button>
      <div v-if="isCaseStudyLoading && !caseStudyData" class="loading">載入工程紀錄中...</div>
      <article v-else-if="caseStudyData" class="case-study">
        <h1>工程紀錄</h1>

        <!-- 初始假設 -->
        <section>
          <h2>📐 初始假設</h2>
          <div class="assumption-block">
            <p><strong>架構假設：</strong> {{ caseStudyData.initialAssumption.architecture }}</p>
            <p><strong>資料流假設：</strong> {{ caseStudyData.initialAssumption.dataFlow }}</p>
            <p><strong>限制假設：</strong> {{ caseStudyData.initialAssumption.limitations }}</p>
          </div>
        </section>

        <!-- 迭代目標 -->
        <section>
          <h2>🎯 迭代目標</h2>
          <p>{{ caseStudyData.iterationGoal }}</p>
        </section>

        <!-- 核心問題 -->
        <section v-if="caseStudyData.coreProblems?.length">
          <h2>⚠️ 核心問題</h2>
          <div v-for="(p, i) in caseStudyData.coreProblems" :key="i" class="problem-card">
            <h3>{{ p.title }}</h3>
            <p><strong>根因：</strong> {{ p.rootCause }}</p>
            <p><strong>解法：</strong> {{ p.solution }}</p>
            <p v-if="p.alternative"><strong>替代方案：</strong> {{ p.alternative }}</p>
          </div>
        </section>

        <!-- 限制條件 -->
        <section v-if="caseStudyData.constraints?.length">
          <h2>🔒 限制條件</h2>
          <ul>
            <li v-for="(c, i) in caseStudyData.constraints" :key="i">
              <strong>{{ c.constraint }}</strong>：{{ c.reason }}
            </li>
          </ul>
        </section>

        <!-- 工程決策 -->
        <section v-if="caseStudyData.engineeringDecisions?.length">
          <h2>🔧 工程決策</h2>
          <div v-for="(d, i) in caseStudyData.engineeringDecisions" :key="i" class="decision-card">
            <h3>{{ d.problem }}</h3>
            <p><strong>決策：</strong> {{ d.decision }}</p>
            <p><strong>為何：</strong> {{ d.why }}</p>
          </div>
        </section>

        <!-- 技術影響 -->
        <section>
          <h2>⚙️ 技術影響</h2>
          <div class="impact-grid">
            <div><strong>可維護性</strong><p>{{ caseStudyData.technicalImpact.maintainability }}</p></div>
            <div><strong>可擴展性</strong><p>{{ caseStudyData.technicalImpact.scalability }}</p></div>
            <div><strong>可靠性</strong><p>{{ caseStudyData.technicalImpact.reliability }}</p></div>
            <div><strong>效能</strong><p>{{ caseStudyData.technicalImpact.performance }}</p></div>
            <div><strong>安全性</strong><p>{{ caseStudyData.technicalImpact.security }}</p></div>
          </div>
        </section>

        <!-- Production 思維 -->
        <section v-if="caseStudyData.productionThinking?.length">
          <h2>🏭 Production 思維</h2>
          <ul>
            <li v-for="(pt, i) in caseStudyData.productionThinking" :key="i">
              <strong>{{ pt.scenario }}</strong>：{{ pt.strategy }}
            </li>
          </ul>
        </section>

        <!-- 未來演進 -->
        <section v-if="caseStudyData.futureEvolution?.length">
          <h2>🔭 未來演進</h2>
          <ul>
            <li v-for="(fe, i) in caseStudyData.futureEvolution" :key="i">
              <strong>{{ fe.scale }}</strong>：{{ fe.approach }}
            </li>
          </ul>
        </section>

        <!-- 面試問題 -->
        <section v-if="caseStudyData.interviewQuestions?.length">
          <h2>📌 面試問題</h2>
          <ol>
            <li v-for="(q, i) in caseStudyData.interviewQuestions" :key="i">{{ q }}</li>
          </ol>
        </section>

        <!-- 架構圖輪播 -->
        <section v-if="caseStudyDiagrams.length" class="carousel-section">
          <h2>🖼 架構圖</h2>
          <div class="carousel">
            <button @click="prevDiagram" class="carousel-btn">‹</button>
            <img :src="caseStudyDiagrams[diagramIndex]" class="carousel-img" />
            <button @click="nextDiagram" class="carousel-btn">›</button>
          </div>
          <div class="carousel-dots">
            <span
              v-for="(_img, i) in caseStudyDiagrams"
              :key="i"
              class="dot"
              :class="{ active: i === diagramIndex }"
              @click="diagramIndex = Number(i)"
            ></span>
          </div>
        </section>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useProjectDetail } from '../composables/useProjectDetail';

const route = useRoute();
const {
  currentMode,
  showcaseData,
  caseStudyData,
  showCaseStudy,
  isLoading,
  isCaseStudyLoading,
  currentData,
  loadProject,
  openCaseStudy,
  closeCaseStudy,
  cleanup,
  // parseDemoUrl,
} = useProjectDetail();

// 展示版圖片
const showcaseImages = computed(() => {
  if (currentMode.value === 'showcase' && showcaseData.value) {
    return showcaseData.value.images || [];
  }
  return [];
});
const currentImageIndex = ref(0);
function nextImage() { if (showcaseImages.value.length) currentImageIndex.value = (currentImageIndex.value + 1) % showcaseImages.value.length; }
function prevImage() { if (showcaseImages.value.length) currentImageIndex.value = (currentImageIndex.value - 1 + showcaseImages.value.length) % showcaseImages.value.length; }

// 專業版演進方向配圖
const evolutionImages = computed(() => {
  if (currentMode.value === 'professional' && currentData.value) {
    return (currentData.value as any).images || [];
  }
  return [];
});
const evolutionImageIndex = ref(0);
function nextEvolutionImage() { if (evolutionImages.value.length) evolutionImageIndex.value = (evolutionImageIndex.value + 1) % evolutionImages.value.length; }
function prevEvolutionImage() { if (evolutionImages.value.length) evolutionImageIndex.value = (evolutionImageIndex.value - 1 + evolutionImages.value.length) % evolutionImages.value.length; }

// 工程紀錄架構圖
const caseStudyDiagrams = computed(() => {
  if (caseStudyData.value) {
    return caseStudyData.value.diagrams?.map(d => d.url) || [];
  }
  return [];
});
const diagramIndex = ref(0);
function nextDiagram() { if (caseStudyDiagrams.value.length) diagramIndex.value = (diagramIndex.value + 1) % caseStudyDiagrams.value.length; }
function prevDiagram() { if (caseStudyDiagrams.value.length) diagramIndex.value = (diagramIndex.value - 1 + caseStudyDiagrams.value.length) % caseStudyDiagrams.value.length; }

onMounted(() => loadProject(route.params.slug as string));
onUnmounted(() => cleanup());
</script>

<style scoped>
/* 原有樣式保持不變，可視需要新增 impact-grid 等 */
.impact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 12px;
}
.assumption-block {
  background: var(--surface);
  padding: 16px;
  border-radius: var(--radius);
}
</style>

<style scoped>
article { max-width: 800px; }
section { margin-bottom: 32px; }
h2 { border-bottom: 1px solid var(--border); padding-bottom: 8px; }
.code-block {
  background: var(--surface);
  padding: 16px;
  border-radius: var(--radius);
  font-family: monospace;
  font-size: 13px;
  white-space: pre-wrap;
}
.tech-stack { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
.tech-stack div { background: var(--surface); padding: 16px; border-radius: var(--radius); }
.tech-stack strong { display: block; margin-bottom: 4px; color: var(--text); }
.case-study-btn { margin-top: 16px; padding: 10px 24px; }
.back-btn { margin-bottom: 20px; background: var(--surface); }
.problem-card {
  background: var(--surface);
  padding: 16px;
  border-radius: var(--radius);
  margin-bottom: 12px;
}
.loading { text-align: center; padding: 60px; }
.action-btn {
  display: inline-block;
  margin-top: 20px;
  padding: 10px 24px;
  background: var(--accent);
  color: #fff;
  border-radius: var(--radius);
  font-weight: bold;
}
.github-btn {
  background: #333;
}

.tradeoff-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.tradeoff-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
}

.tradeoff-header {
  background: var(--accent);
  color: #fff;
  padding: 12px 16px;
  font-weight: bold;
  font-size: 15px;
}

.tradeoff-body {
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tradeoff-row {
  display: flex;
  gap: 8px;
  font-size: 14px;
}

.tradeoff-label {
  font-weight: bold;
  color: var(--text);
  min-width: 40px;
}

.carousel-section {
  margin: 32px 0;
}
.carousel {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
}
.carousel-img {
  width: 100%;
  height: 400px;           /* 固定高度 */
  max-width: 100%;
  object-fit: contain;     /* 圖片完整顯示，不裁切，背景可能留白 */
  border-radius: var(--radius);
  border: 1px solid var(--border);
  background: var(--surface); /* 留白區域背景色 */
}
/* 若希望填滿容器且裁切多餘部分，可改用 object-fit: cover */
.carousel-btn {
  background: var(--surface);
  color: #fff;
  font-size: 32px;
  border: none;
  cursor: pointer;
  padding: 0 12px;
  line-height: 1;
}
.carousel-dots {
  text-align: center;
  margin-top: 12px;
}
.dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  background: var(--text-muted);
  border-radius: 50%;
  margin: 0 4px;
  cursor: pointer;
}
.dot.active {
  background: var(--accent);
}

.demo-links {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 24px;
}
</style>