<template>
  <article class="case-study">
    <h1>工程紀錄</h1>
    
    <!-- 初始假設（只有當至少一個欄位有內容時才顯示） -->
    <section v-if="hasInitialAssumption">
      <h2>📐 初始假設</h2>
      <div class="assumption-block">
        <p v-if="data.initialAssumption.architecture"><strong>架構假設：</strong> <span v-html="formatText(data.initialAssumption.architecture)"></span></p>
        <p v-if="data.initialAssumption.dataFlow"><strong>資料流假設：</strong> <span v-html="formatText(data.initialAssumption.dataFlow)"></span></p>
        <p v-if="data.initialAssumption.limitations"><strong>限制假設：</strong> <span v-html="formatText(data.initialAssumption.limitations)"></span></p>
      </div>
    </section>
    
    <!-- 迭代目標 -->
    <section v-if="data.iterationGoal">
      <h2>🎯 迭代目標</h2>
      <p v-html="formatText(data.iterationGoal)"></p>
    </section>
    
    <!-- 核心問題 -->
    <section v-if="data.coreProblems?.length">
      <h2>⚠️ 核心問題</h2>
      <div v-for="(p, i) in data.coreProblems" :key="i" class="problem-card">
        <h3>{{ p.title }}</h3>
        <p><strong>根因：</strong> <span v-html="formatText(p.rootCause)"></span></p>
        <p><strong>解法：</strong> <span v-html="formatText(p.solution)"></span></p>
        <p v-if="p.alternative"><strong>替代方案：</strong> <span v-html="formatText(p.alternative)"></span></p>
      </div>
    </section>

    <!-- 限制條件 -->
    <section v-if="data.constraints?.length">
      <h2>🔒 限制條件</h2>
      <ul>
        <li v-for="(c, i) in data.constraints" :key="i">
          <strong>{{ c.constraint }}</strong>：<span v-html="formatText(c.reason)"></span>
        </li>
      </ul>
    </section>

    <!-- 工程決策 -->
    <section v-if="data.engineeringDecisions?.length">
      <h2>🔧 工程決策</h2>
      <div v-for="(d, i) in data.engineeringDecisions" :key="i" class="decision-card">
        <h3>{{ d.problem }}</h3>
        <p><strong>決策：</strong> <span v-html="formatText(d.decision)"></span></p>
        <p><strong>為何：</strong> <span v-html="formatText(d.why)"></span></p>
      </div>
    </section>

    <!-- 技術影響（五個欄位有任何一個有內容就顯示） -->
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

    <!-- Production 思維 -->
    <section v-if="data.productionThinking?.length">
      <h2>🏭 Production 思維</h2>
      <ul>
        <li v-for="(pt, i) in data.productionThinking" :key="i">
          <strong>{{ pt.scenario }}</strong>：<span v-html="formatText(pt.strategy)"></span>
        </li>
      </ul>
    </section>

    <!-- 未來演進 -->
    <section v-if="data.futureEvolution?.length">
      <h2>🔭 未來演進</h2>
      <ul>
        <li v-for="(fe, i) in data.futureEvolution" :key="i">
          <strong>{{ fe.scale }}</strong>：<span v-html="formatText(fe.approach)"></span>
        </li>
      </ul>
    </section>

    <!-- 面試問題 -->
    <section v-if="data.interviewQuestions?.length">
      <h2>📌 面試問題</h2>
      <ol>
        <li v-for="(q, i) in data.interviewQuestions" :key="i" v-html="formatText(q)"></li>
      </ol>
    </section>

    <!-- 架構圖輪播（無圖片時不顯示整個區塊） -->
    <section v-if="diagrams.length" class="carousel-section">
      <h2>🖼 架構圖</h2>
      <ImageCarousel :images="diagrams" />
    </section>

    <!-- 補充記錄 -->
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
import { computed } from 'vue';
import type { CaseStudyDTO } from '../../../types/dto';
import { formatText } from '../../../utils/textFormatter';
import ImageCarousel from '../../../components/common/ImageCarousel.vue';

const props = defineProps<{ data: CaseStudyDTO }>();

// 如果不再需要這個 emit，也可以刪除
// const emit = defineEmits<{
//   (e: 'openDiagrams', images: string[], index: number): void;
// }>();

const diagrams = computed(() => props.data.diagrams?.map(d => d.url) || []);

// ✅ 刪除了 nextDiagram, prevDiagram, openDiagrams 函數
// ✅ 刪除了 diagramIndex ref
// ✅ ImageCarousel 元件會自己處理輪播和點擊放大

// 其他 computed 保持不變
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
/* 樣式保持原有 */
/* 輪播容器固定佈局 */
/* 替換原有的輪播樣式 */
.carousel-container {
  position: relative;
  width: 100%;
  border-radius: var(--radius);
  overflow: hidden;
  background: var(--surface);
}

.carousel {
  position: relative;
  width: 100%;
}

.carousel-image-wrapper {
  position: relative;
  width: 100%;
  background: var(--bg);
  overflow: hidden;
}

/* 桌面版 */
@media (min-width: 1024px) {
  .carousel-image-wrapper {
    aspect-ratio: 16 / 9;
  }
}

/* 平板 */
@media (min-width: 768px) and (max-width: 1023px) {
  .carousel-image-wrapper {
    aspect-ratio: 4 / 3;
  }
}

/* 手機 */
@media (max-width: 767px) {
  .carousel-image-wrapper {
    aspect-ratio: 3 / 4;
  }
}

.carousel-img {
  width: 100%;
  height: 100%;
  object-fit: cover;  /* 關鍵：填滿容器不變形 */
  cursor: pointer;
  transition: transform 0.3s ease;
}

.carousel-img:hover {
  transform: scale(1.02);
}

.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  border-radius: 50%;
  color: white;
  font-size: 24px;
  cursor: pointer;
  z-index: 10;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-btn:hover {
  background: rgba(0, 0, 0, 0.8);
}

.carousel-btn.prev {
  left: 16px;
}

.carousel-btn.next {
  right: 16px;
}

.carousel-dots {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 16px;
}

.dot {
  width: 8px;
  height: 8px;
  background: var(--text-muted);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
}

.dot.active {
  background: var(--accent);
  width: 24px;
  border-radius: 4px;
}

/* 手機板按鈕調整 */
@media (max-width: 768px) {
  .carousel-btn {
    width: 32px;
    height: 32px;
    font-size: 18px;
  }
  
  .carousel-btn.prev {
    left: 8px;
  }
  
  .carousel-btn.next {
    right: 8px;
  }
}
</style>