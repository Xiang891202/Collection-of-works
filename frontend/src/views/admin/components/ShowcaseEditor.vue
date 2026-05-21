<template>
  <div class="showcase-editor">
    <h1>編輯展示版內容</h1>
    <form @submit.prevent="save" class="showcase-form">
      <div class="form-group">
        <label>系統定義</label>
        <textarea v-model="form.systemDefinition" rows="3" class="form-control" :disabled="disabled"></textarea>
      </div>

      <div class="form-group">
        <label>解決的問題</label>
        <textarea v-model="form.problem" rows="4" class="form-control" :disabled="disabled"></textarea>
      </div>

      <div class="form-group">
        <label>如何解決</label>
        <textarea v-model="form.solution" rows="4" class="form-control" :disabled="disabled"></textarea>
      </div>

      <div class="form-group">
        <label>帶來的改變</label>
        <textarea v-model="form.impact" rows="4" class="form-control" :disabled="disabled"></textarea>
      </div>

      <div class="form-group">
        <label>延伸應用</label>
        <DynamicListInput :key="componentKey" v-model="form.extendedApplications" />
      </div>

      <!-- 🖼 展示圖片：串接前端暫存狀態與雙向綁定 -->
      <div class="form-group">
        <label>展示圖片</label>
        <ImageManager 
          :key="`images_${componentKey}`" 
          v-model="form.images" 
          v-model:newFiles="managerNewFiles"
          v-model:deletedUrls="managerDeletedUrls"
          :projectId="projectId" 
        />
      </div>

      <div class="form-group">
        <label>線上體驗連結</label>
        <LinkListInput :key="componentKey" v-model="form.demoUrl" />
      </div>

      <div class="form-actions">
        <button type="submit" class="btn-primary" :disabled="disabled">儲存展示版</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
// 💡 補上 uploadImage 和 deleteImage 的 API 引入
import { fetchAdminProject, updateShowcaseContent, uploadImage, deleteImage } from '../../../api/index.api';
import DynamicListInput from '../../../components/admin/DynamicListInput.vue';
import ImageManager from '../../../components/admin/ImageManager.vue';
import LinkListInput from '../../../components/admin/LinkListInput.vue';

// 定義表單資料的型別
interface ShowcaseForm {
  systemDefinition: string;
  problem: string;
  solution: string;
  impact: string;
  extendedApplications: string[];
  images: string[];
  demoUrl: { label: string; url: string }[];
}

const props = defineProps<{ projectId: string; disabled?: boolean }>();

const componentKey = ref(0);

// ─── 1. 宣告圖片上傳與刪除的狀態暫存區 ───
const managerNewFiles = ref<{ file: File; localUrl: string }[]>([]);
const managerDeletedUrls = ref<string[]>([]);

const form = ref<ShowcaseForm>({
  systemDefinition: '',
  problem: '',
  solution: '',
  impact: '',
  extendedApplications: [],
  images: [],
  demoUrl: [],
});

async function loadData() {
  const res = await fetchAdminProject(props.projectId);
  const showcase = res.data.data?.showcase;
  if (showcase) {
    form.value = {
      systemDefinition: showcase.systemDefinition || '',
      problem: showcase.problem || '',
      solution: showcase.solution || '',
      impact: showcase.impact || '',
      extendedApplications: Array.isArray(showcase.extendedApplications) ? showcase.extendedApplications : [],
      images: Array.isArray(showcase.images) ? showcase.images : [],
      demoUrl: Array.isArray(showcase.demoUrl) ? showcase.demoUrl : [],
    };
    
    // ─── 2. 重新加載資料時，一併清空舊的圖片暫存區並釋放記憶體 ───
    managerDeletedUrls.value = [];
    managerNewFiles.value.forEach(item => URL.revokeObjectURL(item.localUrl));
    managerNewFiles.value = [];

    componentKey.value++;
  }
}

// ─── 3. 修改後的 save 函式：將圖片批次操作與表單儲存完美打包 ───
async function save() {
  if (!props.projectId) return;

  try {
    // A. 處理圖片刪除 API
    for (const url of managerDeletedUrls.value) {
      await deleteImage(props.projectId, url);
    }

    // B. 處理新圖片上傳 API
    const uploadedUrls: string[] = [];
    for (const item of managerNewFiles.value) {
      const res = await uploadImage(props.projectId, item.file);
      uploadedUrls.push(res.data.data!.url);
    }

    // C. 計算變更後留下來的最終展示圖片網址陣列
    const finalShowcaseImages = [
      ...form.value.images.filter(url => !managerDeletedUrls.value.includes(url)),
      ...uploadedUrls
    ];

    // D. 包裝最終要送出給後端的 Payload
    const payload = {
      systemDefinition: form.value.systemDefinition,
      problem: form.value.problem,
      solution: form.value.solution,
      impact: form.value.impact,
      extendedApplications: form.value.extendedApplications,
      images: finalShowcaseImages, // 帶入計算好的最新網址陣列
      demoUrl: form.value.demoUrl.length ? form.value.demoUrl : null,
    };

    // E. 觸發展示版內容儲存 API
    await updateShowcaseContent(props.projectId, payload);
    alert('展示版已儲存');
    
    // F. 重新拉取資料，刷新前端畫面
    await loadData();
  } catch (err) {
    console.error('儲存展示版內容失敗', err);
    alert('儲存失敗，請重試。');
  }
}

onMounted(loadData);
</script>

<style scoped>
.showcase-editor {
  max-width: 1000px;
  margin: 0 auto;
}
.showcase-form {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
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
