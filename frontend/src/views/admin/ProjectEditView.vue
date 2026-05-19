<template>
  <div>
    <h1>{{ isNew ? '新增專案' : '編輯專案' }}</h1>
    <div class="tabs">
      <button @click="tab = 'meta'">主表</button>
      <button @click="tab = 'showcase'">展示版</button>
      <button @click="tab = 'professional'">專業版</button>
      <button @click="tab = 'case-study'">工程紀錄</button>
    </div>

    <!-- 主表編輯（保留原樣） -->
    <button @click="router.push('/admin/dashboard')">返回列表</button>
    <div v-if="tab === 'meta'">
      <form @submit.prevent="saveMeta">
        <input v-model="form.title" placeholder="標題" required />
        <select v-model="form.tag">
          <option>商業專案</option>
          <option>練習專案</option>
        </select>
        <input v-model="form.thumbnail_url" placeholder="縮圖 URL" />
        <textarea v-model="form.one_liner" placeholder="一句話描述"></textarea>
        <input v-model="form.demo_url" placeholder="Demo URL (可為 JSON)" />
        <input v-model="form.github_url" placeholder="GitHub URL" />
        <button type="submit">{{ isNew ? '建立' : '更新' }}</button>
      </form>
    </div>

    <!-- 展示版元件 -->
    <ShowcaseEditor
      v-else-if="tab === 'showcase'"
      :project-id="projectId"
      :disabled="disabled"
    />

    <!-- 專業版元件 -->
    <ProfessionalEditor
      v-else-if="tab === 'professional'"
      :project-id="projectId"
      :disabled="disabled"
    />

    <!-- 工程紀錄元件 -->
    <CaseStudyEditor
      v-else-if="tab === 'case-study'"
      :project-id="projectId"
      :disabled="disabled"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  fetchAdminProject,
  createProject,
  updateProjectMeta,
  // 不再需要導入 updateShowcaseContent 等，因為各元件會自行呼叫
} from '../../api/index.api';
import ShowcaseEditor from './components/ShowcaseEditor.vue';
import ProfessionalEditor from './components/ProfessionalEditor.vue';
import CaseStudyEditor from './components/CaseStudyEditor.vue';

const route = useRoute();
const router = useRouter();
const isNew = route.params.id === undefined;
const projectId = route.params.id as string;

// 從路由傳入的 disabled 屬性（來自父層 AdminProjectLayout）
const props = defineProps<{ disabled?: boolean }>();

const tab = ref('meta');

// 主表表單資料
const form = ref({
  slug: '',
  title: '',
  tag: '練習專案',
  thumbnail_url: '',
  one_liner: '',
  demo_url: '',
  github_url: '',
});

onMounted(async () => {
  if (!isNew) {
    const res = await fetchAdminProject(projectId);
    const p = res.data.data!;
    form.value = {
      slug: p.slug,
      title: p.title,
      tag: p.tag,
      thumbnail_url: p.thumbnail_url || '',
      one_liner: p.one_liner,
      demo_url: p.showcase?.demoUrl ? JSON.stringify(p.showcase.demoUrl) : '',
      github_url: p.professional?.githubUrl || '',
    };
  }
});

async function saveMeta() {
  if (isNew) {
    const res = await createProject(form.value);
    router.replace(`/admin/projects/${res.data.data!.id}/meta`);
  } else {
    await updateProjectMeta(projectId, form.value);
    alert('已更新');
  }
}
</script>

<style scoped>
form input, form select, form textarea { display: block; width: 100%; margin-bottom: 10px; padding: 8px; }
.tabs { display: flex; gap: 8px; margin-bottom: 20px; }
.upload-section { margin-top: 40px; }

form label { display: block; margin-top: 12px; font-weight: bold; }
form textarea { min-height: 80px; }
input, textarea { color: #fff; background: var(--bg); border: 1px solid var(--border); padding: 6px 8px; border-radius: 4px; }

/* 讓標籤與輸入框各自獨佔一行 */
label {
  display: block;
  margin-top: 16px;
  margin-bottom: 4px;
  font-weight: bold;
  color: var(--text);
}

input,
textarea,
select {
  display: block;
  width: 100%;
  padding: 8px 10px;
  color: #fff;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

textarea {
  min-height: 80px;
  resize: vertical;
}

button {
  margin-top: 16px;
}

.image-manager {
  margin-top: 24px;
  padding: 16px;
  background: var(--surface);
  border-radius: var(--radius);
}
.image-upload-row {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 12px;
}
.image-preview-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.image-preview-item {
  position: relative;
  width: 120px;
}
.preview-thumb {
  width: 100%;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid var(--border);
}
.remove-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #f44;
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  font-size: 14px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
}
.small-btn {
  padding: 4px 12px;
  font-size: 12px;
}

/* 輪播預覽 */
.preview-carousel {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 16px;
}
.preview-main-img {
  max-width: 100%;
  max-height: 300px;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  object-fit: contain;
}
.carousel-btn {
  background: var(--surface);
  color: #fff;
  font-size: 28px;
  border: none;
  cursor: pointer;
  padding: 0 10px;
  line-height: 1;
}
.carousel-btn:disabled {
  opacity: 0.3;
  cursor: default;
}

/* 縮圖選中狀態 */
.image-preview-item.active {
  outline: 2px solid var(--accent);
}

/* 手機版 Tab 按鈕換行、增大點擊區域 */
@media (max-width: 768px) {
  .tabs {
    flex-wrap: wrap;
    gap: 8px;
  }
  .tabs button {
    flex: 1;
    padding: 8px 12px;
  }
  form input, form select, form textarea {
    font-size: 16px; /* 避免 iOS 自動縮放 */
  }
  .form-group {
    margin-bottom: 16px;
  }
  .form-actions button {
    width: 100%;
  }
}
</style>