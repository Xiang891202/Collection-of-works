<template>
  <article class="case-study">
    <div class="back-nav">
      <button @click="goBackToProfessional" class="back-to-professional-btn">
        ← 返回專業版
      </button>
    </div>

    <h1>工程紀錄</h1>
    
    <!-- 其餘內容保持不變 -->
    <section v-if="hasInitialAssumption">
      <h2>📐 初始假設</h2>
      <div class="assumption-block">
        <p v-if="data.initialAssumption.architecture"><strong>架構假設：</strong> <span v-html="formatText(data.initialAssumption.architecture)"></span></p>
        <p v-if="data.initialAssumption.dataFlow"><strong>資料流假設：</strong> <span v-html="formatText(data.initialAssumption.dataFlow)"></span></p>
        <p v-if="data.initialAssumption.limitations"><strong>限制假設：</strong> <span v-html="formatText(data.initialAssumption.limitations)"></span></p>
      </div>
    </section>
    
    <section v-if="data.iterationGoal">
      <h2>🎯 迭代目標</h2>
      <p v-html="formatText(data.iterationGoal)"></p>
    </section>
    
    <section v-if="data.coreProblems?.length">
      <h2>⚠️ 核心問題</h2>
      <div v-for="(p, i) in data.coreProblems" :key="i" class="problem-card">
        <h3>{{ p.title }}</h3>
        <p><strong>根因：</strong> <span v-html="formatText(p.rootCause)"></span></p>
        <p><strong>解法：</strong> <span v-html="formatText(p.solution)"></span></p>
        <p v-if="p.alternative"><strong>替代方案：</strong> <span v-html="formatText(p.alternative)"></span></p>
      </div>
    </section>

    <section v-if="data.constraints?.length">
      <h2>🔒 限制條件</h2>
      <ul>
        <li v-for="(c, i) in data.constraints" :key="i">
          <strong>{{ c.constraint }}</strong>：<span v-html="formatText(c.reason)"></span>
        </li>
      </ul>
    </section>

    <section v-if="data.engineeringDecisions?.length">
      <h2>🔧 工程決策</h2>
      <div v-for="(d, i) in data.engineeringDecisions" :key="i" class="decision-card">
        <h3>{{ d.problem }}</h3>
        <p><strong>決策：</strong> <span v-html="formatText(d.decision)"></span></p>
        <p><strong>為何：</strong> <span v-html="formatText(d.why)"></span></p>
      </div>
    </section>

    <section v-if="hasTechnicalImpact">
      <h2>⚙️ 技術影響</h2>
      <div class="impact-grid">
        <div v-if="data.technicalImpact.maintainability"><strong>可維護性</strong><p v-html="formatText(data.technicalImpact.maintainability)"></p></div>
        <div v-if="data.technicalImpact.scalability"><strong>可擴展性</strong><p v-html="formatText(data.technicalImpact.scalability)"></p></div>
        <div v-if="data.technicalImpact.reliability"><strong>可靠性</strong><p v-html="formatText(data.technicalImpact.reliability)"></p></div>
        <div v-if="data.technicalImpact.performance"><strong>效能</strong><p v-html="formatText(data.technicalImpact.performance)"></p></div>
        <div v-if="data.technicalImpact.security"><strong>安全性</strong><p v-html="formatText(data.technicalImpact.security)"></p></div>
      </div>
    </section>

    <section v-if="data.productionThinking?.length">
      <h2>🏭 Production 思維</h2>
      <ul>
        <li v-for="(pt, i) in data.productionThinking" :key="i">
          <strong>{{ pt.scenario }}</strong>：<span v-html="formatText(pt.strategy)"></span>
        </li>
      </ul>
    </section>

    <section v-if="data.futureEvolution?.length">
      <h2>🔭 未來演進</h2>
      <ul>
        <li v-for="(fe, i) in data.futureEvolution" :key="i">
          <strong>{{ fe.scale }}</strong>：<span v-html="formatText(fe.approach)"></span>
        </li>
      </ul>
    </section>

    <section v-if="data.interviewQuestions?.length">
      <h2>📌 面試問題</h2>
      <ol>
        <li v-for="(q, i) in data.interviewQuestions" :key="i" v-html="formatText(q)"></li>
      </ol>
    </section>

    <section v-if="diagrams.length" class="carousel-section">
      <h2>🖼 架構圖</h2>
      <ImageCarousel :images="diagrams" />
    </section>

    <section v-if="hasEnabledSupplements">
      <h2>📝 補充記錄</h2>
      <div v-for="(sup, idx) in enabledSupplements" :key="idx" class="supplement-card">
        <h3>{{ sup.title }}</h3>
        <p><strong>問題：</strong> <span v-html="formatText(sup.problem)"></span></p>
        <p><strong>根因：</strong> <span v-html="formatText(sup.rootCause)"></span></p>
        <p><strong>解決方式：</strong> <span v-html="formatText(sup.solution)"></span></p>
        <p><strong>預防措施：</strong> <span v-html="formatText(sup.prevention)"></span></p>
      </div>
    </section>
  </article>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
// import { useRouter } from 'vue-router';
import type { CaseStudyDTO } from '../../../types/dto';
import { formatText } from '../../../utils/textFormatter';
import ImageCarousel from '../../../components/common/ImageCarousel.vue';
// import { currentMode } from '../../../composables/useProjectDetail';

const props = defineProps<{ 
  data: CaseStudyDTO; 
  projectId?: string;
}>();

// ✅ 新增 close 事件
const emit = defineEmits<{
  (e: 'close'): void;
}>();


// const router = useRouter();

// 進入頁面時滾動到頂部
onMounted(() => {
  window.scrollTo(0, 0);
});

const diagrams = computed(() => props.data.diagrams?.map(d => d.url) || []);

// 從當前 URL 路徑中解析出 slug
// function getSlugFromUrl(): string | null {
//   // 路徑格式如 /projects/beauty-crm
//   const match = window.location.pathname.match(/\/projects\/([^/?]+)/);
//   return match ? match[1] : null;
// }

// 返回專業版
function goBackToProfessional() {
  emit('close');
}

const enabledSupplements = computed(() => {
  return props.data.supplements?.filter(s => s.enabled === true) || [];
});
const hasEnabledSupplements = computed(() => enabledSupplements.value.length > 0);

const hasInitialAssumption = computed(() => {
  const ia = props.data.initialAssumption;
  return ia && (ia.architecture || ia.dataFlow || ia.limitations);
});

const hasTechnicalImpact = computed(() => {
  const ti = props.data.technicalImpact;
  return ti && (ti.maintainability || ti.scalability || ti.reliability || ti.performance || ti.security);
});
</script>

<style scoped>
/* 強制整個頁面不超出寬度 */
.case-study {
  max-width: 100%;
  overflow-x: hidden;
  word-break: break-word;
  overflow-wrap: break-word;
}

/* 補充記錄卡片內文字換行 */
.supplement-card,
.case-study p,
.case-study li,
.case-study div:not(.carousel-main) {
  word-break: break-word;
  overflow-wrap: break-word;
  white-space: normal;
}

/* 程式碼區塊強制換行 */
pre,
code {
  white-space: pre-wrap;
  word-break: break-all;
}

/* 返回按鈕區域 */
.back-nav {
  margin-bottom: 1rem;
}

.back-to-professional-btn {
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--text);
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.back-to-professional-btn:hover {
  background: var(--accent);
  color: white;
  border-color: var(--accent);
}

@media (max-width: 768px) {
  .back-to-professional-btn {
    padding: 4px 10px;
    font-size: 12px;
  }
}
</style>