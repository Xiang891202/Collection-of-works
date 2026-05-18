<template>
  <div class="case-study-editor">
    <h1>編輯工程紀錄</h1>
    <form @submit.prevent="save" class="case-study-form">
      <!-- 初始假設區塊 -->
      <div class="form-section">
        <h3>📐 初始假設</h3>
        <div class="form-group">
          <label>架構假設</label>
          <textarea v-model="form.initialAssumption.architecture" rows="2" class="form-control"></textarea>
        </div>
        <div class="form-group">
          <label>資料流假設</label>
          <textarea v-model="form.initialAssumption.dataFlow" rows="2" class="form-control"></textarea>
        </div>
        <div class="form-group">
          <label>限制假設</label>
          <textarea v-model="form.initialAssumption.limitations" rows="2" class="form-control"></textarea>
        </div>
      </div>

      <!-- 迭代目標 -->
      <div class="form-group">
        <label>🎯 迭代目標</label>
        <textarea v-model="form.iterationGoal" rows="3" class="form-control"></textarea>
      </div>

      <!-- 核心問題 -->
      <div class="form-group">
        <label>⚠️ 核心問題</label>
        <ObjectListInput
          :key="`coreProblems_${componentKey}`"
          v-model="form.coreProblems"
          :fields="coreProblemFields"
        />
      </div>

      <!-- 限制條件 -->
      <div class="form-group">
        <label>🔒 限制條件</label>
        <ObjectListInput
          :key="`constraints_${componentKey}`"
          v-model="form.constraints"
          :fields="constraintFields"
        />
      </div>

      <!-- 工程決策 -->
      <div class="form-group">
        <label>🔧 工程決策</label>
        <ObjectListInput
          :key="`engineeringDecisions_${componentKey}`"
          v-model="form.engineeringDecisions"
          :fields="engineeringDecisionFields"
        />
      </div>

      <!-- 技術影響 -->
      <div class="form-section">
        <h3>⚙️ 技術影響</h3>
        <div class="form-group">
          <label>可維護性</label>
          <textarea v-model="form.technicalImpact.maintainability" rows="2" class="form-control"></textarea>
        </div>
        <div class="form-group">
          <label>可擴展性</label>
          <textarea v-model="form.technicalImpact.scalability" rows="2" class="form-control"></textarea>
        </div>
        <div class="form-group">
          <label>可靠性</label>
          <textarea v-model="form.technicalImpact.reliability" rows="2" class="form-control"></textarea>
        </div>
        <div class="form-group">
          <label>效能</label>
          <textarea v-model="form.technicalImpact.performance" rows="2" class="form-control"></textarea>
        </div>
        <div class="form-group">
          <label>安全性</label>
          <textarea v-model="form.technicalImpact.security" rows="2" class="form-control"></textarea>
        </div>
      </div>

      <!-- Production 思維 -->
      <div class="form-group">
        <label>🏭 Production 思維</label>
        <ObjectListInput
          :key="`productionThinking_${componentKey}`"
          v-model="form.productionThinking"
          :fields="productionThinkingFields"
        />
      </div>

      <!-- 未來演進 -->
      <div class="form-group">
        <label>🔭 未來演進</label>
        <ObjectListInput
          :key="`futureEvolution_${componentKey}`" 
          v-model="form.futureEvolution"
          :fields="futureEvolutionFields"
        />
      </div>

      <!-- 面試問題 -->
      <div class="form-group">
        <label>📌 面試問題</label>
        <DynamicListInput 
        :key="`interviewQuestions_${componentKey}`"
        v-model="form.interviewQuestions" />
      </div>

      <!-- 架構圖（輪播多圖） -->
      <div class="form-group">
        <label>🖼 架構圖（輪播）</label>
        <ImageManager 
        :key="`diagramImages_${componentKey}`"
        v-model="diagramImages" :projectId="projectId" />
      </div>

      <div class="form-actions">
        <button type="submit" class="btn-primary">儲存工程紀錄</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { fetchAdminProject, updateCaseStudyContent } from '../../../api/index.api';
import DynamicListInput from '../../../components/admin/DynamicListInput.vue';
import ObjectListInput from '../../../components/admin/ObjectListInput.vue';
import ImageManager from '../../../components/admin/ImageManager.vue';
import type { CaseStudyDTO } from '../../../types/dto';

const props = defineProps<{ projectId: string }>();
const componentKey = ref(0);

// 專門存放架構圖片的 URL 陣列
const diagramImages = ref<string[]>([]);

// 明確定義 form 的類型，避免 TypeScript 推斷為 never
const form = ref<Omit<CaseStudyDTO, 'diagrams'>>({
  initialAssumption: { architecture: '', dataFlow: '', limitations: '' },
  iterationGoal: '',
  coreProblems: [],
  constraints: [],
  engineeringDecisions: [],
  technicalImpact: { maintainability: '', scalability: '', reliability: '', performance: '', security: '' },
  productionThinking: [],
  futureEvolution: [],
  interviewQuestions: [],
  images: [],
});

// ObjectListInput 欄位定義
const coreProblemFields = [
  { key: 'title', label: '問題標題', type: 'text' },
  { key: 'rootCause', label: '根因', type: 'textarea' },
  { key: 'solution', label: '解法', type: 'textarea' },
  { key: 'alternative', label: '替代方案', type: 'textarea' },
];
const constraintFields = [
  { key: 'constraint', label: '限制', type: 'text' },
  { key: 'reason', label: '原因', type: 'textarea' },
];
const engineeringDecisionFields = [
  { key: 'problem', label: '問題', type: 'text' },
  { key: 'decision', label: '決策', type: 'textarea' },
  { key: 'why', label: '為何', type: 'textarea' },
];
const productionThinkingFields = [
  { key: 'scenario', label: '場景', type: 'text' },
  { key: 'strategy', label: '策略', type: 'textarea' },
];
const futureEvolutionFields = [
  { key: 'scale', label: '規模', type: 'text' },
  { key: 'approach', label: '方法', type: 'textarea' },
];

onMounted(async () => {
  const res = await fetchAdminProject(props.projectId);
  const cs = res.data.data!.caseStudy;
  if (cs) {
    // 將後端的 diagrams 轉為 diagramImages（純 URL 陣列）
    if (cs.diagrams && Array.isArray(cs.diagrams)) {
      diagramImages.value = cs.diagrams.map(d => d.url);
    }
    // 其餘欄位直接賦值（確保類型匹配）
    form.value = {
      initialAssumption: cs.initialAssumption || { architecture: '', dataFlow: '', limitations: '' },
      iterationGoal: cs.iterationGoal || '',
      coreProblems: cs.coreProblems || [],
      constraints: cs.constraints || [],
      engineeringDecisions: cs.engineeringDecisions || [],
      technicalImpact: cs.technicalImpact || { maintainability: '', scalability: '', reliability: '', performance: '', security: '' },
      productionThinking: cs.productionThinking || [],
      futureEvolution: cs.futureEvolution || [],
      interviewQuestions: cs.interviewQuestions || [],
      images: cs.images || [],
    };
  }
  componentKey.value++; // 讓 DynamicListInput 重新渲染以顯示新資料
});

async function save() {
  const diagramsPayload = diagramImages.value.map((url, idx) => ({
    type: `架構圖 ${idx + 1}`,
    url,
  }));

  const payload: CaseStudyDTO = {
    ...form.value,
    diagrams: diagramsPayload,
  };

  await updateCaseStudyContent(props.projectId, payload);
  alert('工程紀錄已儲存');
}
</script>

<style scoped>
.case-study-editor {
  max-width: 1000px;
  margin: 0 auto;
}
.case-study-form {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 28px;
}
.form-section {
  border-top: 1px solid var(--border);
  padding-top: 16px;
  margin-top: 8px;
}
.form-section h3 {
  margin-bottom: 16px;
  font-size: 1.1rem;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.form-group label {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--text);
}
.form-control {
  padding: 10px 12px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  color: var(--text);
  font-size: 0.9rem;
  font-family: inherit;
  resize: vertical;
}
.form-control:focus {
  outline: none;
  border-color: var(--accent);
}
.form-actions {
  text-align: right;
  margin-top: 16px;
}
.btn-primary {
  background: var(--accent);
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: var(--radius);
  font-size: 1rem;
  cursor: pointer;
  transition: opacity 0.2s;
}
.btn-primary:hover {
  opacity: 0.85;
}
</style>