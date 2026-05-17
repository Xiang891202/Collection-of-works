<template>
  <div class="showcase-editor">
    <h1>編輯展示版內容</h1>
    <form @submit.prevent="save" class="showcase-form">
      <div class="form-grid">
        <div class="form-group full-width">
          <label>系統定義</label>
          <textarea v-model="form.systemDefinition" rows="3" class="form-control"></textarea>
        </div>
        <div class="form-group full-width">
          <label>解決的問題</label>
          <textarea v-model="form.problem" rows="4" class="form-control"></textarea>
        </div>
        <div class="form-group full-width">
          <label>如何解決</label>
          <textarea v-model="form.solution" rows="4" class="form-control"></textarea>
        </div>
        <div class="form-group full-width">
          <label>帶來的改變</label>
          <textarea v-model="form.impact" rows="4" class="form-control"></textarea>
        </div>
        
        <!-- 🛠️ 加上 :key="componentKey"，確保非同步資料回來後元件會刷新 -->
        <div class="form-group full-width">
          <label>延伸應用</label>
          <DynamicListInput :key="componentKey" v-model="form.extendedApplications" />
        </div>
        <div class="form-group full-width">
          <label>展示圖片</label>
          <ImageManager v-model="form.images" :projectId="projectId" />
        </div>
        <div class="form-group full-width">
          <label>線上體驗連結</label>
          <LinkListInput :key="componentKey" v-model="form.demoUrl" />
        </div>
      </div>
      <div class="form-actions">
        <button type="submit" class="btn-primary">儲存展示版</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { fetchAdminProject, updateShowcaseContent } from '../../../api/index.api';
import DynamicListInput from '../../../components/admin/DynamicListInput.vue';
import ImageManager from '../../../components/admin/ImageManager.vue';
import LinkListInput from '../../../components/admin/LinkListInput.vue';

const props = defineProps<{ projectId: string }>();

// 🛠️ 新增一個控制元件刷新的計數器
const componentKey = ref(0);

const form = ref({
  systemDefinition: '',
  problem: '',
  solution: '',
  impact: '',
  extendedApplications: [] as string[],
  images: [] as string[],
  demoUrl: [] as { label: string; url: string }[],
});

async function loadData(keepLocalDemoUrl = false) {
  if (!props.projectId) return;
  
  // 先把目前畫面上使用者填寫的連結暫存起來
  const previousLocalDemoUrl = [...form.value.demoUrl];
  
  try {
    const res = await fetchAdminProject(props.projectId);
    const apiResponse = res.data as any; 
    const projectDetail = apiResponse?.data;
    const showcase = projectDetail?.showcase;
    
    if (!showcase) return;

    form.value.systemDefinition = showcase.systemDefinition || '';
    form.value.problem = showcase.problem || '';
    form.value.solution = showcase.solution || '';
    form.value.impact = showcase.impact || '';
    
    form.value.extendedApplications = Array.isArray(showcase.extendedApplications) 
      ? [...showcase.extendedApplications] 
      : [];
      
    form.value.images = Array.isArray(showcase.images) ? [...showcase.images] : [];
    
    // 🛠️ 防禦核心：如果 keepLocalDemoUrl 為 true 且後端撈回來是空的，則強制沿用剛才填寫的值
    if (keepLocalDemoUrl && (!showcase.demoUrl || (Array.isArray(showcase.demoUrl) && showcase.demoUrl.length === 0))) {
      form.value.demoUrl = previousLocalDemoUrl;
      console.log('🛡️ [防禦啟動] 後端回傳 null，已自動為你留存畫面的體驗連結。');
    } else if (Array.isArray(showcase.demoUrl)) {
      form.value.demoUrl = [...showcase.demoUrl];
    } else if (showcase.demoUrl && typeof showcase.demoUrl === 'string') {
      form.value.demoUrl = [{ label: '線上體驗', url: showcase.demoUrl }];
    } else {
      form.value.demoUrl = [];
    }

    // 強制重新整理畫面元件
    componentKey.value++;

  } catch (err) {
    console.error('載入失敗', err);
  }
}

async function save() {
  const payload = {
    systemDefinition: form.value.systemDefinition,
    problem: form.value.problem,
    solution: form.value.solution,
    impact: form.value.impact,
    extendedApplications: form.value.extendedApplications,
    images: form.value.images,
    demoUrl: form.value.demoUrl.length ? form.value.demoUrl : null, 
  };
  
  try {
    await updateShowcaseContent(props.projectId, payload);
    alert('展示版已儲存');
    
    // 🛠️ 儲存成功後傳入 true，告訴 loadData：「如果後端回傳 null，請幫我保留目前的畫面連結！」
    await loadData(true); 
    
  } catch (err: any) {
    console.error('儲存失敗', err);
    alert(err.response?.data?.error || '儲存失敗，請檢查網路或後端狀態');
  }
}



onMounted(loadData);
</script>


<style scoped>
/* 保持原有樣式不變 */
.showcase-editor { max-width: 1000px; margin: 0 auto; }
.showcase-form { margin-top: 24px; }
.form-grid { display: flex; flex-direction: column; gap: 24px; }
.form-group { display: flex; flex-direction: column; gap: 8px; }
.form-group.full-width { width: 100%; }
.form-group label { font-weight: 600; font-size: 0.9rem; color: var(--text); }
.form-control { padding: 10px 12px; background: var(--bg); border: 1px solid var(--border); border-radius: var(--radius); color: var(--text); font-size: 0.9rem; font-family: inherit; resize: vertical; }
.form-control:focus { outline: none; border-color: var(--accent); }
.form-actions { margin-top: 32px; text-align: right; }
.btn-primary { background: var(--accent); color: white; border: none; padding: 10px 24px; border-radius: var(--radius); font-size: 1rem; cursor: pointer; transition: opacity 0.2s; }
.btn-primary:hover { opacity: 0.85; }
</style>