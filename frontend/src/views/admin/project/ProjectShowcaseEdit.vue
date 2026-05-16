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

        <div class="form-group full-width">
          <label>延伸應用</label>
          <DynamicListInput v-model="form.extendedApplications" />
        </div>

        <div class="form-group full-width">
          <label>展示圖片</label>
          <ImageManager v-model="form.images" :projectId="projectId" />
        </div>

        <div class="form-group full-width">
          <label>線上體驗連結</label>
          <LinkListInput v-model="form.demoUrl" />
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
import LinkListInput from '../../../components/admin/LinkListInput.vue';
import ImageManager from '../../../components/admin/ImageManager.vue';
import type { ShowcaseDTO } from '../../../types/dto';

const props = defineProps<{ projectId: string }>();

const form = ref<Omit<ShowcaseDTO, 'demoUrl'> & { demoUrl: { label: string; url: string }[] }>({
  systemDefinition: '',
  problem: '',
  solution: '',
  impact: '',
  extendedApplications: [],
  images: [],
  demoUrl: [],
});

onMounted(async () => {
  const res = await fetchAdminProject(props.projectId);
  const showcase = res.data.data!.showcase;
  if (showcase) {
    form.value = {
      systemDefinition: showcase.systemDefinition || '',
      problem: showcase.problem || '',
      solution: showcase.solution || '',
      impact: showcase.impact || '',
      extendedApplications: showcase.extendedApplications || [],
      images: showcase.images || [],
      demoUrl: showcase.demoUrl || [],
    };
  }
});

async function save() {
  const payload: ShowcaseDTO = {
    ...form.value,
    demoUrl: form.value.demoUrl.length ? form.value.demoUrl : null,
  };
  await updateShowcaseContent(props.projectId, payload);
  alert('展示版已儲存');
}
</script>

<style scoped>
.showcase-editor {
  max-width: 1000px;
  margin: 0 auto;
}
.showcase-form {
  margin-top: 24px;
}
.form-grid {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.form-group.full-width {
  width: 100%;
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
  margin-top: 32px;
  text-align: right;
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