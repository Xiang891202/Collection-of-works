<template>
  <div>
    <h1>管理後台</h1>
    <div class="toolbar">
      <button @click="goToNew">新增專案</button>
      <select v-model="filter" @change="loadProjects">
        <option value="active">Active</option>
        <option value="draft">Draft</option>
        <option value="deleted">Deleted</option>
        <option value="all">All</option>
      </select>
    </div>
    <table v-if="projects.length">
      <thead>
        <tr><th>標題</th><th>Slug</th><th>狀態</th><th>更新時間</th><th>操作</th></tr>
      </thead>
      <tbody>
        <tr v-for="p in projects" :key="p.id">
          <td>{{ p.title }}</td>
          <td>{{ p.slug }}</td>
          <td>{{ p.status }}</td>
          <td>{{ p.updated_at }}</td>
          <td>
            <button @click="goToEdit(p.id)">編輯</button>
            <button v-if="p.status !== 'deleted'" @click="handleDelete(p.id)">刪除</button>
            <button v-if="p.status === 'deleted'" @click="handleRestore(p.id)">復原</button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else>尚無專案</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { fetchAdminProjects, softDeleteProject, restoreProject } from '../../api/index.api';
import type { AdminProjectListItemDTO } from '../../types/dto';

const router = useRouter();
const projects = ref<AdminProjectListItemDTO[]>([]);
const filter = ref('active');

const goToNew = () => {
  console.log('前往新增專案');
  router.push('/admin/projects/new');
};

const goToEdit = (id: string) => {
  console.log('前往編輯專案', id);
  router.push(`/admin/projects/${id}`);
};

async function loadProjects() {
  const res = await fetchAdminProjects(filter.value);
  projects.value = res.data.data || [];
}

async function handleDelete(id: string) {
  try {
    await softDeleteProject(id);
    alert('已刪除');
    await new Promise(resolve => setTimeout(resolve, 300)); // 等待後端處理
    await loadProjects();
  } catch (err: any) {
    alert(err.response?.data?.error || '刪除失敗');
  }
}

async function handleRestore(id: string) {
  try {
    await restoreProject(id);
    alert('復原成功，專案狀態變為草稿');
    await new Promise(resolve => setTimeout(resolve, 300));
    await loadProjects();
  } catch (err: any) {
    console.error('復原失敗', err);
    alert(err.response?.data?.error || '復原失敗，請檢查專案狀態是否為已刪除');
  }
}

onMounted(loadProjects);
</script>

<style scoped>
table { width: 100%; border-collapse: collapse; }
th, td { padding: 8px; border-bottom: 1px solid var(--border); }
.toolbar { display: flex; gap: 12px; margin-bottom: 20px; }
</style>