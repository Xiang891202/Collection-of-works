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
        <section>
          <h2>📡 資料流</h2>
          <p class="code-block">{{ (currentData as any).dataFlow }}</p>
        </section>
        <a
                v-if="(currentData as any).githubUrl"
                :href="(currentData as any).githubUrl"
                target="_blank"
                class="action-btn github-btn"
                >
                💻 GitHub
                </a>
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
import { onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useProjectDetail } from '../composables/useProjectDetail';

const route = useRoute();
const {
  currentMode,
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
</style>