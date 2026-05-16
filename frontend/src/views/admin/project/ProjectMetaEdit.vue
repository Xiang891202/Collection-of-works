<template>
  <div class="meta-editor">
    <h1>{{ isNew ? '新增專案' : '編輯基本資料' }}</h1>
    <form @submit.prevent="save" class="meta-form">
      <div class="form-group">
        <label>標題</label>
        <input v-model="form.title" required class="form-control" />
      </div>

      <div class="form-group">
        <label>Slug (網址識別碼)</label>
        <input 
          v-model="form.slug" 
          required 
          :disabled="!isNew" 
          placeholder="例如：my-project"
          class="form-control"
        />
        <p class="hint">建立後不可修改</p>
      </div>

      <div class="form-group">
        <label>標籤</label>
        <select v-model="form.tag" class="form-control">
          <option>商業專案</option>
          <option>練習專案</option>
        </select>
      </div>

      <div class="form-group">
        <label>一句話描述</label>
        <textarea v-model="form.one_liner" rows="3" class="form-control"></textarea>
      </div>

      <div class="form-group">
        <label>縮圖圖片</label>
        <SingleImageUpload
          v-if="!isNew"
          v-model="form.thumbnail_url"
          :projectId="projectId"
        />
        <div v-else class="hint">請先建立專案後再上傳縮圖</div>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn-primary">{{ isNew ? '建立專案' : '儲存變更' }}</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { fetchAdminProject, createProject, updateProjectMeta } from '../../../api/index.api';
import SingleImageUpload from '../../../components/admin/SingleImageUpload.vue';

const route = useRoute();
const router = useRouter();
const isNew = route.path.includes('/new');
const projectId = route.params.id as string;

const form = ref({
  slug: '',
  title: '',
  tag: '練習專案',
  one_liner: '',
  thumbnail_url: '',
});

onMounted(async () => {
  if (!isNew && projectId) {
    const res = await fetchAdminProject(projectId);
    const p = res.data.data!;
    form.value = {
      slug: p.slug,
      title: p.title,
      tag: p.tag,
      one_liner: p.one_liner,
      thumbnail_url: p.thumbnail_url || '',
    };
  }
});

async function save() {
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
/* 和上一版相同 */
.meta-editor { max-width: 800px; }
.meta-form { display: flex; flex-direction: column; gap: 1.5rem; }
.form-group { display: flex; flex-direction: column; gap: 0.5rem; }
.form-group label { font-weight: 600; font-size: 0.9rem; color: var(--text); }
.form-control { padding: 0.6rem 0.8rem; background: var(--bg); border: 1px solid var(--border); border-radius: var(--radius); color: var(--text); font-size: 0.9rem; transition: border 0.2s; }
.form-control:focus { outline: none; border-color: var(--accent); }
.form-control:disabled { background: var(--surface); opacity: 0.7; cursor: not-allowed; }
.hint { font-size: 0.75rem; color: var(--text-muted); margin-top: 0.2rem; }
.form-actions { margin-top: 1rem; }
.btn-primary { background: var(--accent); color: white; border: none; padding: 0.6rem 1.2rem; border-radius: var(--radius); font-size: 0.9rem; cursor: pointer; transition: opacity 0.2s; }
.btn-primary:hover { opacity: 0.85; }
</style>