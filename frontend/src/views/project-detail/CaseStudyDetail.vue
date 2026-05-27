<template>
  <article class="case-study">
    <div class="back-nav">
      <button @click="goBackToProfessional" class="back-to-professional-btn">
        ← 返回專業版
      </button>
    </div>

    <h1>工程紀錄</h1>
    
    <section v-if="hasInitialAssumption" class="accordion-item" :class="{ active: isOpen('initialAssumption') }">
      <header class="accordion-header" @click="toggleSection('initialAssumption')">
        <h2>📐 初始假設</h2>
        <span class="toggle-icon"></span>
      </header>
      <div class="accordion-content">
        <div class="assumption-block">
          <p v-if="data.initialAssumption.architecture"><strong>架構假設：</strong> <span v-html="formatText(data.initialAssumption.architecture)"></span></p>
          <p v-if="data.initialAssumption.dataFlow"><strong>資料流假設：</strong> <span v-html="formatText(data.initialAssumption.dataFlow)"></span></p>
          <p v-if="data.initialAssumption.limitations"><strong>限制假設：</strong> <span v-html="formatText(data.initialAssumption.limitations)"></span></p>
        </div>
      </div>
    </section>
    
    <section v-if="data.iterationGoal" class="accordion-item" :class="{ active: isOpen('iterationGoal') }">
      <header class="accordion-header" @click="toggleSection('iterationGoal')">
        <h2>🎯 迭代目標</h2>
        <span class="toggle-icon"></span>
      </header>
      <div class="accordion-content">
        <p v-html="formatText(data.iterationGoal)"></p>
      </div>
    </section>
    
    <section v-if="data.coreProblems?.length" class="accordion-item" :class="{ active: isOpen('coreProblems') }">
      <header class="accordion-header" @click="toggleSection('coreProblems')">
        <h2>⚠️ 核心問題</h2>
        <span class="toggle-icon"></span>
      </header>
      <div class="accordion-content">
        <div v-for="(p, i) in data.coreProblems" :key="i" class="problem-card">
          <h3>{{ p.title }}</h3>
          <p><strong>根因：</strong> <span v-html="formatText(p.rootCause)"></span></p>
          <p><strong>解法：</strong> <span v-html="formatText(p.solution)"></span></p>
          <p v-if="p.alternative"><strong>替代方案：</strong> <span v-html="formatText(p.alternative)"></span></p>
        </div>
      </div>
    </section>

    <section v-if="data.constraints?.length" class="accordion-item" :class="{ active: isOpen('constraints') }">
      <header class="accordion-header" @click="toggleSection('constraints')">
        <h2>🔒 限制條件</h2>
        <span class="toggle-icon"></span>
      </header>
      <div class="accordion-content">
        <ul>
          <li v-for="(c, i) in data.constraints" :key="i">
            <strong>{{ c.constraint }}</strong>：<span v-html="formatText(c.reason)"></span>
          </li>
        </ul>
      </div>
    </section>

    <section v-if="data.engineeringDecisions?.length" class="accordion-item" :class="{ active: isOpen('engineeringDecisions') }">
      <header class="accordion-header" @click="toggleSection('engineeringDecisions')">
        <h2>🔧 工程決策</h2>
        <span class="toggle-icon"></span>
      </header>
      <div class="accordion-content">
        <div v-for="(d, i) in data.engineeringDecisions" :key="i" class="decision-card">
          <h3>{{ d.problem }}</h3>
          <p><strong>決策：</strong> <span v-html="formatText(d.decision)"></span></p>
          <p><strong>為何：</strong> <span v-html="formatText(d.why)"></span></p>
        </div>
      </div>
    </section>

    <section v-if="hasTechnicalImpact" class="accordion-item" :class="{ active: isOpen('technicalImpact') }">
      <header class="accordion-header" @click="toggleSection('technicalImpact')">
        <h2>⚙️ 技術影響</h2>
        <span class="toggle-icon"></span>
      </header>
      <div class="accordion-content">
        <div class="impact-grid">
          <div v-if="data.technicalImpact.maintainability"><strong>可維護性</strong><p v-html="formatText(data.technicalImpact.maintainability)"></p></div>
          <div v-if="data.technicalImpact.scalability"><strong>可擴展性</strong><p v-html="formatText(data.technicalImpact.scalability)"></p></div>
          <div v-if="data.technicalImpact.reliability"><strong>可靠性</strong><p v-html="formatText(data.technicalImpact.reliability)"></p></div>
          <div v-if="data.technicalImpact.performance"><strong>效能</strong><p v-html="formatText(data.technicalImpact.performance)"></p></div>
          <div v-if="data.technicalImpact.security"><strong>安全性</strong><p v-html="formatText(data.technicalImpact.security)"></p></div>
        </div>
      </div>
    </section>

    <section v-if="data.productionThinking?.length" class="accordion-item" :class="{ active: isOpen('productionThinking') }">
      <header class="accordion-header" @click="toggleSection('productionThinking')">
        <h2>🏭 Production 思維</h2>
        <span class="toggle-icon"></span>
      </header>
      <div class="accordion-content">
        <ul>
          <li v-for="(pt, i) in data.productionThinking" :key="i">
            <strong>{{ pt.scenario }}</strong>：<span v-html="formatText(pt.strategy)"></span>
          </li>
        </ul>
      </div>
    </section>

    <section v-if="data.futureEvolution?.length" class="accordion-item" :class="{ active: isOpen('futureEvolution') }">
      <header class="accordion-header" @click="toggleSection('futureEvolution')">
        <h2>🔭 未來演進</h2>
        <span class="toggle-icon"></span>
      </header>
      <div class="accordion-content">
        <ul>
          <li v-for="(fe, i) in data.futureEvolution" :key="i">
            <strong>{{ fe.scale }}</strong>：<span v-html="formatText(fe.approach)"></span>
          </li>
        </ul>
      </div>
    </section>

    <section v-if="data.interviewQuestions?.length" class="accordion-item" :class="{ active: isOpen('interviewQuestions') }">
      <header class="accordion-header" @click="toggleSection('interviewQuestions')">
        <h2>📌 面試問題</h2>
        <span class="toggle-icon"></span>
      </header>
      <div class="accordion-content">
        <ol>
          <li v-for="(q, i) in data.interviewQuestions" :key="i" v-html="formatText(q)"></li>
        </ol>
      </div>
    </section>

    <section v-if="diagrams.length" class="accordion-item" :class="{ active: isOpen('diagrams') }">
      <header class="accordion-header" @click="toggleSection('diagrams')">
        <h2>🖼 設計文件</h2>
        <span class="toggle-icon"></span>
      </header>
      <div class="accordion-content">
        <image-carousel :images="diagrams" />
      </div>
    </section>

    <section v-if="hasEnabledSupplements" class="accordion-item" :class="{ active: isOpen('supplements') }">
      <header class="accordion-header" @click="toggleSection('supplements')">
        <h2>📝 補充記錄</h2>
        <span class="toggle-icon"></span>
      </header>
      <div class="accordion-content">
        <div v-for="(sup, idx) in enabledSupplements" :key="idx" class="supplement-card">
          <h3>{{ sup.title }}</h3>
          <p><strong>問題：</strong> <span v-html="formatText(sup.problem)"></span></p>
          <p><strong>根因：</strong> <span v-html="formatText(sup.rootCause)"></span></p>
          <p><strong>解決方式：</strong> <span v-html="formatText(sup.solution)"></span></p>
          <p><strong>預防措施：</strong> <span v-html="formatText(sup.prevention)"></span></p>
        </div>
      </div>
    </section>
  </article>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import type { CaseStudyDTO } from '../../types/dto.ts';
import { formatText } from '../../utils/textFormatter.ts';
import ImageCarousel from '../../components/common/ImageCarousel.vue';

const props = defineProps<{ 
  data: CaseStudyDTO; 
  projectId?: string;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

onMounted(() => {
  window.scrollTo(0, 0);
});

const openedSections = ref<Record<string, boolean>>({
  initialAssumption: true, // 預設展開初始假設
  iterationGoal: false,
  coreProblems: false,
  constraints: false,
  engineeringDecisions: false,
  technicalImpact: false,
  productionThinking: false,
  futureEvolution: false,
  interviewQuestions: false,
  diagrams: false,
  supplements: false
});

function toggleSection(key: string) {
  openedSections.value[key] = !openedSections.value[key];
}

function isOpen(key: string) {
  return !!openedSections.value[key];
}

const diagrams = computed(() => props.data.diagrams?.map(d => d.url) || []);

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
.case-study {
  max-width: 100%;
  overflow-x: hidden;
  word-break: break-word;
  overflow-wrap: break-word;
  padding: 0 1rem;
}

.accordion-item {
  border: 1px solid var(--border, #e2e8f0);
  border-radius: 8px;
  margin-bottom: 1rem;
  background: var(--surface, #ffffff);
  overflow: hidden;
  transition: border-color 0.2s ease;
}

.accordion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s ease;
}

.accordion-header:hover {
  background-color: var(--background-alt, #7e7f81);
}

.accordion-header h2 {
  margin: 0;
  font-size: 1.25rem;
}

.toggle-icon {
  position: relative;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.toggle-icon::before,
.toggle-icon::after {
  content: '';
  position: absolute;
  background-color: var(--text, #334155);
  transition: transform 0.25s ease;
}

.toggle-icon::before {
top: 7px;
left: 0;
width: 16px;
height: 2px;
}
.toggle-icon::after {
top: 0;
left: 7px;
width: 2px;
height: 16px;
}
.accordion-item.active .toggle-icon::after {
transform: rotate(90deg);
opacity: 0;
}
.accordion-item.active .toggle-icon::before {
transform: rotate(180deg);
}
.accordion-content {
display: none;
padding: 0 1.5rem 1.5rem 1.5rem;
border-top: 1px solid transparent;
}
.accordion-item.active .accordion-content {
display: block;
border-top: 1px solid var(--border, #e2e8f0);
}
.supplement-card,
.case-study p,
.case-study li,
.case-study div:not(.carousel-main) {
word-break: break-word;
overflow-wrap: break-word;
white-space: normal;
}
pre,
code {
white-space: pre-wrap;
word-break: break-all;
}
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
.accordion-header {
padding: 0.85rem 1rem;
}
.accordion-header h2 {
font-size: 1.1rem;
}
.accordion-content {
padding: 0 1rem 1rem 1rem;
}
.back-to-professional-btn {
padding: 4px 10px;
font-size: 12px;
}
}

</style>