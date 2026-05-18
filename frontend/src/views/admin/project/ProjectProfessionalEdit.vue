<template>
  <div class="professional-editor">
    <h1>編輯專業版內容</h1>
    <form @submit.prevent="save" class="professional-form">
      <!-- 1. 系統一句話定位 -->
      <div class="form-group">
        <label>🧠 系統一句話定位</label>
        <textarea v-model="form.systemGoal" rows="2" class="form-control" placeholder="例如：一個支援會員認證、收藏同步與地圖查詢的房屋平台"></textarea>
      </div>

      <!-- 2. 架構全景圖（單圖） -->
      <div class="form-group">
        <label>🏗 架構全景圖</label>
        <SingleImageUpload v-model="form.architectureDiagram" :projectId="projectId" />
      </div>

      <!-- 3. 資料流 -->
      <div class="form-group">
        <label>📡 資料流</label>
        <textarea v-model="form.dataFlow" rows="4" class="form-control" placeholder="Client → Router Guard → Pinia Store → Axios → Express → ..."></textarea>
      </div>

      <!-- 4. 邊界 -->
      <div class="form-group">
        <label>🔲 邊界</label>
        <textarea v-model="form.boundary" rows="3" class="form-control" placeholder="系統邊界、與外部系統的互動、假設與限制等"></textarea>
      </div>

      <!-- 5. 最關鍵的架構挑戰 -->
      <div class="form-group">
        <label>⚠️ 最關鍵的架構挑戰</label>
        <ObjectListInput
          :key="`coreProblems_${componentKey}`"
          v-model="form.coreProblems"
          :fields="challengeFields"
        />
      </div>

      <!-- 6. 最關鍵的設計決策 -->
      <div class="form-group">
        <label>🧩 最關鍵的設計決策</label>
        <ObjectListInput
          :key="`designDecisions_${componentKey}`"
          v-model="form.designDecisions"
          :fields="decisionFields"
        />
      </div>

      <!-- 7. 一個演進方向 -->
      <div class="form-group">
        <label>🔭 一個演進方向</label>
        <textarea v-model="form.evolutionDirection" rows="3" class="form-control" placeholder="未來可能的架構演進方向"></textarea>
      </div>

      <!-- 8. 演進方向配圖（輪播） -->
      <div class="form-group">
        <!-- <label>🖼 演進方向配圖</label> -->
        <ImageManager
         :key="`evolutionImages_${componentKey}`"
         v-model="form.evolutionImages" 
         :projectId="projectId" 
        />
      </div>

      <!-- 9. 引導至工程紀錄 -->
      <div class="form-group">
        <label>📘 引導至工程紀錄</label>
        <textarea v-model="form.caseStudyGuide" rows="2" class="form-control" placeholder="例如：點擊下方按鈕查看迭代過程中的工程決策與取捨"></textarea>
        <!-- <button type="button" @click="goToCaseStudy" class="case-study-btn">📋 工程紀錄</button> -->
      </div>

      <!-- 10. GitHub URL -->
      <div class="form-group">
        <label>💻 GitHub URL</label>
        <input v-model="form.githubUrl" class="form-control" placeholder="https://github.com/your-repo" />
      </div>

      <div class="form-actions">
        <button type="submit" class="btn-primary">儲存專業版</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
// import { useRouter } from 'vue-router';
import { fetchAdminProject, updateProfessionalContent } from '../../../api/index.api';
import SingleImageUpload from '../../../components/admin/SingleImageUpload.vue';
import ImageManager from '../../../components/admin/ImageManager.vue';
import ObjectListInput from '../../../components/admin/ObjectListInput.vue';
// import type { ProfessionalDTO } from '../../../types/dto';

const props = defineProps<{ projectId: string }>();
// const router = useRouter();
const componentKey = ref(0);

// 定義表單結構（兼容後端 DTO，但新增幾個臨時欄位）
const form = ref({
  // 映射到後端字段
  systemGoal: '',
  architectureDiagram: '',
  dataFlow: '',
  githubUrl: '',
  coreProblems: [] as { title: string; description: string }[],
  designDecisions: [] as { problem: string; solution: string; alternative: string }[],
  // 新增的臨時欄位（儲存時需轉換或忽略）
  boundary: '',
  evolutionDirection: '',
  evolutionImages: [] as string[],
  caseStudyGuide: '',
});

// ObjectListInput 欄位定義
const challengeFields = [
  { key: 'title', label: '挑戰標題', type: 'text' },
  { key: 'description', label: '描述', type: 'textarea' },
];
const decisionFields = [
  { key: 'problem', label: '問題', type: 'text' },
  { key: 'solution', label: '解法', type: 'textarea' },
  { key: 'alternative', label: '替代方案', type: 'textarea' },
];

onMounted(async () => {
  const res = await fetchAdminProject(props.projectId);
  const prof = res.data.data!.professional;
  if (prof) {
  form.value.systemGoal = prof.systemGoal || '';
  form.value.architectureDiagram = prof.architectureDiagram || '';
  form.value.dataFlow = prof.dataFlow || '';
  form.value.githubUrl = prof.githubUrl || '';
  form.value.coreProblems = prof.coreProblems || [];
  form.value.designDecisions = prof.designDecisions || [];
  // ✅ 補上這四個欄位
  form.value.boundary = prof.boundary || '';
  form.value.evolutionDirection = prof.evolutionDirection || '';
  form.value.evolutionImages = Array.isArray(prof.images) ? prof.images : [];
  form.value.caseStudyGuide = prof.caseStudyGuide || '';
}
  componentKey.value++; // 讓 ObjectListInput 重新渲染以顯示新資料
});

// function goToCaseStudy() {
//   router.push(`/admin/projects/${props.projectId}/case-study`);
// }

async function save() {
  const payload: any = {
    // 既有欄位
    systemGoal: form.value.systemGoal,
    architectureDiagram: form.value.architectureDiagram,
    dataFlow: form.value.dataFlow,
    githubUrl: form.value.githubUrl,
    coreProblems: form.value.coreProblems,
    designDecisions: form.value.designDecisions,
    // ✅ 補上遺漏的三個欄位
    boundary: form.value.boundary,
    evolutionDirection: form.value.evolutionDirection,
    caseStudyGuide: form.value.caseStudyGuide,
    // 演進方向配圖（已使用 images 欄位）
    images: form.value.evolutionImages,
    // 以下為後端必填但可不填的欄位，給予預設空值
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
  };

  await updateProfessionalContent(props.projectId, payload);
  alert('專業版已儲存');
}
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
.case-study-btn {
  align-self: flex-start;
  background: #2c3e50;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  margin-top: 8px;
  transition: opacity 0.2s;
}
.case-study-btn:hover {
  opacity: 0.85;
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