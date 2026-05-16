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
        <template v-if="(currentData as any).demoUrl">
            <a
                v-if="parseDemoUrl((currentData as any).demoUrl).user"
                :href="parseDemoUrl((currentData as any).demoUrl).user"
                target="_blank"
                class="action-btn"
            >
                🚀 線上體驗
            </a>
            <a
                v-if="parseDemoUrl((currentData as any).demoUrl).admin"
                :href="parseDemoUrl((currentData as any).demoUrl).admin"
                target="_blank"
                class="action-btn"
            >
                🔑 管理員入口
            </a>
            </template>
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

        <!-- 架構圖 -->
        <section v-if="(currentData as any).architectureDiagram">
          <h2>📐 系統架構圖</h2>
          <img :src="(currentData as any).architectureDiagram" alt="架構圖" class="arch-img" />
        </section>

        <!-- 資料流 -->
        <section>
          <h2>📡 資料流</h2>
          <p class="code-block">{{ (currentData as any).dataFlow }}</p>
        </section>

        <!-- 核心流程 -->
        <section v-if="(currentData as any).keyProcesses?.length">
          <h2>🔄 核心流程</h2>
          <ul>
            <li v-for="(kp, i) in (currentData as any).keyProcesses" :key="i">{{ kp }}</li>
          </ul>
        </section>

        <!-- 核心問題 -->
        <section v-if="(currentData as any).coreProblems?.length">
          <h2>⚠️ 核心工程問題</h2>
          <div v-for="(cp, i) in (currentData as any).coreProblems" :key="i" class="problem-card">
            <h3>{{ cp.title }}</h3>
            <p>{{ cp.description }}</p>
          </div>
        </section>

        <!-- 設計決策 -->
        <section v-if="(currentData as any).designDecisions?.length">
          <h2>🧠 設計決策</h2>
          <div v-for="(dd, i) in (currentData as any).designDecisions" :key="i" class="decision-card">
            <h3>{{ dd.problem }}</h3>
            <p><strong>根因：</strong>{{ dd.rootCause }}</p>
            <p><strong>解法：</strong>{{ dd.solution }}</p>
            <p v-if="dd.alternative"><strong>替代方案：</strong>{{ dd.alternative }}</p>
          </div>
        </section>

        <!-- Trade-off -->
        <section v-if="(currentData as any).tradeOffs?.length">
          <h2>⚖️ Trade-off</h2>
          <div class="tradeoff-list">
            <div v-for="(t, i) in (currentData as any).tradeOffs" :key="i" class="tradeoff-card">
              <div class="tradeoff-header">{{ t.decision }}</div>
              <div class="tradeoff-body">
                <div class="tradeoff-row">
                  <span class="tradeoff-label">選擇</span>
                  <span>{{ t.chosen }}</span>
                </div>
                <div class="tradeoff-row">
                  <span class="tradeoff-label">捨棄</span>
                  <span>{{ t.sacrificed }}</span>
                </div>
                <div class="tradeoff-row">
                  <span class="tradeoff-label">理由</span>
                  <span>{{ t.reason }}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 影響分析 -->
        <section>
          <h2>📊 系統影響分析</h2>
          <div class="impact-grid">
            <div><strong>可擴展性</strong><p>{{ (currentData as any).impactAnalysis?.scalability }}</p></div>
            <div><strong>可維護性</strong><p>{{ (currentData as any).impactAnalysis?.maintainability }}</p></div>
            <div><strong>可靠性</strong><p>{{ (currentData as any).impactAnalysis?.reliability }}</p></div>
            <div><strong>一致性</strong><p>{{ (currentData as any).impactAnalysis?.consistency }}</p></div>
            <div><strong>效能</strong><p>{{ (currentData as any).impactAnalysis?.performance }}</p></div>
          </div>
        </section>

        <!-- 未來演進 -->
        <section v-if="(currentData as any).futureEvolution?.length">
          <h2>🔭 未來架構演進</h2>
          <div v-for="(fe, i) in (currentData as any).futureEvolution" :key="i" class="evolution-card">
            <strong>{{ fe.level }}</strong>
            <p>{{ fe.plan }}</p>
          </div>
        </section>

        <!-- 面試問題 -->
        <section v-if="(currentData as any).interviewQuestions?.length">
          <h2>📌 面試官可能會問</h2>
          <ol>
            <li v-for="(q, i) in (currentData as any).interviewQuestions" :key="i">{{ q }}</li>
          </ol>
        </section>

        <!-- GitHub 按鈕 -->
        <a
          v-if="(currentData as any).githubUrl"
          :href="(currentData as any).githubUrl"
          target="_blank"
          class="action-btn github-btn"
        >
          💻 GitHub
        </a>

        <!-- 工程紀錄按鈕 -->
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
        <section>
          <h2>迭代目標</h2>
          <p>{{ caseStudyData.iterationGoal }}</p>
        </section>
        <section>
          <h2>核心問題 ({{ caseStudyData.coreProblems.length }})</h2>
          <div v-for="(p, i) in caseStudyData.coreProblems" :key="i" class="problem-card">
            <h3>{{ p.title }}</h3>
            <p><strong>根因：</strong>{{ p.rootCause }}</p>
            <p><strong>解法：</strong>{{ p.solution }}</p>
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
  parseDemoUrl,
} = useProjectDetail();

// 展示版圖片相關
const showcaseImages = computed(() => {
  if (currentMode.value === 'showcase' && showcaseData.value) {
    return showcaseData.value.images || [];
  }
  return [];
});

const currentImageIndex = ref(0);

function nextImage() {
  if (showcaseImages.value.length > 0) {
    currentImageIndex.value = (currentImageIndex.value + 1) % showcaseImages.value.length;
  }
}

function prevImage() {
  if (showcaseImages.value.length > 0) {
    currentImageIndex.value = (currentImageIndex.value - 1 + showcaseImages.value.length) % showcaseImages.value.length;
  }
}

onMounted(() => loadProject(route.params.slug as string));
onUnmounted(() => cleanup());
</script>

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
}
.carousel-img {
  max-width: 100%;
  max-height: 400px;
  border-radius: var(--radius);
  border: 1px solid var(--border);
}
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
</style>