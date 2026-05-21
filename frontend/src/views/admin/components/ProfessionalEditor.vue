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

      <!-- 🖼 演進方向配圖：整合雙向綁定的暫存狀態 -->
      <div class="form-group">
        <label>🖼 演進方向配圖</label>
        <ImageManager 
          :key="`images_${componentKey}`" 
          v-model="form.evolutionImages" 
          v-model:newFiles="managerNewFiles"
          v-model:deletedUrls="managerDeletedUrls"
          :projectId="projectId" 
        />
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
// 💡 補上 uploadImage 和 deleteImage 的 API 引入
import { fetchAdminProject, updateProfessionalContent, uploadImage, deleteImage } from '../../../api/index.api';
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
  designDecisions: Array<{ problem: string; rootCause: string; solution: string; alternative: string }>;
  evolutionDirection: string;
  evolutionImages: string[];
  caseStudyGuide: string;
  githubUrl: string;
  dataFlowImage: string;
  boundaryImage: string;
}

const props = defineProps<{ projectId: string; disabled?: boolean }>();

const componentKey = ref(0);

// ─── 1. 宣告圖片上傳與刪除的暫存狀態 ───
const managerNewFiles = ref<{ file: File; localUrl: string }[]>([]);
const managerDeletedUrls = ref<string[]>([]);

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
  { key: 'rootCause', label: '根因', type: 'textarea' },
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
    // ─── 2. 重新加載資料時，一併清空舊的圖片暫存 ───
    managerDeletedUrls.value = [];
    managerNewFiles.value.forEach(item => URL.revokeObjectURL(item.localUrl));
    managerNewFiles.value = [];
    
    componentKey.value++;
  }
}

// ─── 3. 修改後的 save 函式：將圖片 API 與表單儲存完美結合 ───
async function save() {
  if (!props.projectId) return;

  try {
    // A. 先處理圖片刪除 API
    for (const url of managerDeletedUrls.value) {
      await deleteImage(props.projectId, url);
    }

    // B. 再處理新圖片上傳 API
    const uploadedUrls: string[] = [];
    for (const item of managerNewFiles.value) {
      const res = await uploadImage(props.projectId, item.file);
      uploadedUrls.push(res.data.data!.url);
    }

    // C. 計算最終留下來的圖片網址陣列 (要存進後端 payload.images 的)
    const finalEvolutionImages = [
      ...form.value.evolutionImages.filter(url => !managerDeletedUrls.value.includes(url)),
      ...uploadedUrls
    ];

    // D. 包裝並整理與舊結構一致的 Payload
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
      images: finalEvolutionImages, // 使用我們計算好的最新網址陣列
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

    // E. 觸發原本的專業版內容儲存 API
    await updateProfessionalContent(props.projectId, payload);
    alert('專業版已儲存');
    
    // F. 重新拉取資料，載入防快取後的全新乾淨狀態
    await loadData();
  } catch (err) {
    console.error('儲存專業版內容失敗', err);
    alert('儲存失敗，請重試。');
  }
}

onMounted(loadData);
</script>

<style scoped>
/* 原有樣式完全保留 ... */
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
.single-image-wrapper {
  width: 100%;
  background: var(--surface);
  border-radius: var(--radius);
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}
.single-image {
  width: 100%;
  height: auto;
  max-height: 400px;
  object-fit: contain;
  cursor: pointer;
}
.media-row .image img {
  width: 100%;
  height: auto;
  max-height: 300px;
  object-fit: contain;
  border-radius: var(--radius);
  cursor: pointer;
}
@media (max-width: 768px) {
  .single-image {
    max-height: 250px;
  }
  .media-row .image img {
    max-height: 200px;
  }
}
</style>
