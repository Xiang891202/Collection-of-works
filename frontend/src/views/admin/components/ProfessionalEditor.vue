<template>
  <div class="professional-editor">
    <h1>編輯專業版內容</h1>
    <form @submit.prevent="save" class="professional-form">
      <div class="form-group">
        <label>🧠 系統一句話定位</label>
        <textarea v-model="form.systemGoal" rows="2" class="form-control" :disabled="disabled"></textarea>
      </div>

      <div class="form-group">
        <label>🏗 架構全景圖</label>
        <SingleImageUpload v-model="form.architectureDiagram" :projectId="projectId" />
      </div>

      <div class="form-group">
        <label>📡 資料流</label>
        <textarea v-model="form.dataFlow" rows="4" class="form-control" :disabled="disabled"></textarea>
      </div>
      <!-- 資料流圖片 -->
      <div class="form-group">
        <label>📡 資料流圖片</label>
        <SingleImageUpload v-model="form.dataFlowImage" :projectId="projectId" />
      </div>

      <div class="form-group">
        <label>🔲 邊界</label>
        <textarea v-model="form.boundary" rows="3" class="form-control" :disabled="disabled"></textarea>
      </div>
      <!-- 邊界圖片 -->
      <div class="form-group">
        <label>🔲 邊界圖片</label>
        <SingleImageUpload v-model="form.boundaryImage" :projectId="projectId" />
      </div>

      <div class="form-group">
        <label>⚠️ 最關鍵的架構挑戰</label>
        <ObjectListInput
          :key="`core_${componentKey}`"
          v-model="form.coreProblems"
          :fields="challengeFields"
        />
      </div>

      <div class="form-group">
        <label>🧩 最關鍵的設計決策</label>
        <ObjectListInput
          :key="`decision_${componentKey}`"
          v-model="form.designDecisions"
          :fields="decisionFields"
        />
      </div>

      <div class="form-group">
        <label>🔭 一個演進方向</label>
        <textarea v-model="form.evolutionDirection" rows="3" class="form-control" :disabled="disabled"></textarea>
      </div>

      <div class="form-group">
        <label>🖼 演進方向配圖</label>
        <ImageManager :key="`images_${componentKey}`" v-model="form.evolutionImages" :projectId="projectId" />
      </div>

      <div class="form-group">
        <label>📘 引導至工程紀錄</label>
        <textarea v-model="form.caseStudyGuide" rows="2" class="form-control" :disabled="disabled"></textarea>
      </div>

      <div class="form-group">
        <label>💻 GitHub URL</label>
        <input v-model="form.githubUrl" class="form-control" :disabled="disabled" />
      </div>

      <div class="form-actions">
        <button type="submit" class="btn-primary" :disabled="disabled">儲存專業版</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { fetchAdminProject, updateProfessionalContent } from '../../../api/index.api';
import SingleImageUpload from '../../../components/admin/SingleImageUpload.vue';
import ImageManager from '../../../components/admin/ImageManager.vue';
import ObjectListInput from '../../../components/admin/ObjectListInput.vue';

// 定義表單資料的型別
interface ProfessionalForm {
  systemGoal: string;
  architectureDiagram: string;
  dataFlow: string;
  boundary: string;
  coreProblems: Array<{ title: string; description: string }>;
  designDecisions: Array<{ problem: string; solution: string; alternative: string }>;
  evolutionDirection: string;
  evolutionImages: string[];
  caseStudyGuide: string;
  githubUrl: string;
  dataFlowImage: string;
  boundaryImage: string;
}

const props = defineProps<{ projectId: string; disabled?: boolean }>();

const componentKey = ref(0);
const form = ref<ProfessionalForm>({
  systemGoal: '',
  architectureDiagram: '',
  dataFlow: '',
  boundary: '',
  coreProblems: [],
  designDecisions: [],
  evolutionDirection: '',
  evolutionImages: [],
  caseStudyGuide: '',
  githubUrl: '',
  dataFlowImage: '',
  boundaryImage: '',
});

const challengeFields = [
  { key: 'title', label: '挑戰標題', type: 'text' },
  { key: 'description', label: '描述', type: 'textarea' },
];
const decisionFields = [
  { key: 'problem', label: '問題', type: 'text' },
  { key: 'solution', label: '解法', type: 'textarea' },
  { key: 'alternative', label: '替代方案', type: 'textarea' },
];

async function loadData() {
  const res = await fetchAdminProject(props.projectId);
  const prof = res.data.data?.professional;
  if (prof) {
    form.value = {
      systemGoal: prof.systemGoal || '',
      architectureDiagram: prof.architectureDiagram || '',
      dataFlow: prof.dataFlow || '',
      boundary: prof.boundary || '',
      coreProblems: prof.coreProblems || [],
      designDecisions: prof.designDecisions || [],
      evolutionDirection: prof.evolutionDirection || '',
      evolutionImages: prof.images || [],
      caseStudyGuide: prof.caseStudyGuide || '',
      githubUrl: prof.githubUrl || '',
      dataFlowImage: prof.dataFlowImage || '',
      boundaryImage: prof.boundaryImage || '',
    };
    componentKey.value++;
  }
}

async function save() {
  const payload = {
    systemGoal: form.value.systemGoal,
    architectureDiagram: form.value.architectureDiagram,
    dataFlow: form.value.dataFlow,
    githubUrl: form.value.githubUrl,
    coreProblems: form.value.coreProblems,
    designDecisions: form.value.designDecisions,
    boundary: form.value.boundary,
    evolutionDirection: form.value.evolutionDirection,
    caseStudyGuide: form.value.caseStudyGuide,
    images: form.value.evolutionImages,
    techStack: { frontend: [], backend: [], storage: [] },
    keyProcesses: [],
    tradeOffs: [],
    impactAnalysis: {
      scalability: '',
      maintainability: '',
      reliability: '',
      consistency: '',
      performance: ''
    },
    futureEvolution: [],
    interviewQuestions: [],
    dataFlowImage: form.value.dataFlowImage || '',
    boundaryImage: form.value.boundaryImage || '',
  };
  await updateProfessionalContent(props.projectId, payload);
  alert('專業版已儲存');
  await loadData();
}

onMounted(loadData);
</script>

<style scoped>
.professional-editor {
  max-width: 1000px;
  margin: 0 auto;
}
.professional-form {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 28px;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.form-group label {
  font-weight: 600;
  font-size: 0.95rem;
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