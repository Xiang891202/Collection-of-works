<template>
  <div class="admin-dashboard">
    <h1>管理後台</h1>
    <div class="toolbar">
      <button @click="goToNew" class="btn-primary">新增專案</button>
      <select v-model="filter" @change="loadProjects" class="filter-select">
        <option value="active">Active</option>
        <option value="draft">Draft</option>
        <option value="deleted">Deleted</option>
        <option value="all">All</option>
      </select>
    </div>

    <div class="table-wrapper">
      <div v-if="isLoading" class="loading-spinner">載入中...</div>
      <table v-if="projects.length">
        <thead>
          <tr>
            <th class="col-title">標題</th>
            <th class="col-slug">Slug</th>
            <th class="col-status">狀態</th>
            <th class="col-date">更新時間</th>
            <th class="col-actions">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in projects" :key="p.id">
            <td class="col-title">{{ p.title }}</td>
            <td class="col-slug">{{ p.slug }}</td>
            <td class="col-status">
              <span :class="['status-badge', p.status]">
                {{ statusText(p.status) }}
              </span>
            </td>
            <td class="col-date">{{ formatDate(p.updated_at) }}</td>
            <td class="col-actions">
              <button @click="goToEdit(p.id)" class="btn-icon">編輯</button>
              <button
                v-if="p.status !== 'deleted'"
                @click="handleDelete(p.id)"
                class="btn-icon danger"
              >刪除</button>
              <button
                v-if="p.status === 'deleted'"
                @click="handleRestore(p.id)"
                class="btn-icon restore"
              >復原</button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else class="empty-message">尚無專案</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, onBeforeRouteUpdate } from 'vue-router';
import { fetchAdminProjects, softDeleteProject, restoreProject } from '../../api/index.api';
import type { AdminProjectListItemDTO } from '../../types/dto';

const router = useRouter();
const projects = ref<AdminProjectListItemDTO[]>([]);
const filter = ref('active');
const isLoading = ref(false);

function formatDate(isoString: string): string {
  if (!isoString) return '—';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return isoString;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function statusText(status: string): string {
  switch (status) {
    case 'active': return '已發布';
    case 'draft': return '草稿';
    case 'deleted': return '已刪除';
    default: return status;
  }
}

const goToNew = () => {
  console.log('前往新增專案');
  router.push('/admin/projects/new');
};

const goToEdit = (id: string) => {
  console.log('前往編輯專案', id);
  router.push(`/admin/projects/${id}`);
};

async function handleDelete(id: string) {
  try {
    await softDeleteProject(id);
    alert('已刪除');
    await new Promise(resolve => setTimeout(resolve, 300));
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

async function loadProjects() {
  isLoading.value = true;
  try {
    const res = await fetchAdminProjects(filter.value);
    projects.value = res.data.data || [];
  } catch (err) {
    console.error(err);
  } finally {
    isLoading.value = false;
  }
}

onMounted(loadProjects);

// ✅ 修正：只監聽此組件網址更新，且組件銷毀時會自動移除監聽，不會有死迴圈
onBeforeRouteUpdate((to) => {
  if (to.path === '/admin/dashboard') {
    loadProjects();
  }
});

</script>

<style scoped>
.admin-dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

.toolbar {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.btn-primary {
  background: var(--accent);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.filter-select {
  background: var(--bg);
  border: 1px solid var(--border);
  color: var(--text);
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
}

/* 表格容器 – 水平滾動（小螢幕） */
.table-wrapper {
  overflow-x: auto;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: var(--surface);
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
}

th, td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid var(--border);
  vertical-align: middle;
}

th {
  background: var(--bg);
  font-weight: 600;
  color: var(--text);
  font-size: 0.85rem;
  letter-spacing: 0.5px;
}

/* 欄位寬度建議 */
.col-title { width: 25%; }
.col-slug { width: 20%; }
.col-status { width: 12%; }
.col-date { width: 25%; }
.col-actions { width: 18%; }

/* 狀態標籤 */
.status-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  text-align: center;
  white-space: nowrap;
}
.status-badge.active {
  background: #1e3a2f;
  color: #4ade80;
}
.status-badge.draft {
  background: #2d2a1e;
  color: #facc15;
}
.status-badge.deleted {
  background: #3d1e1e;
  color: #f87171;
}

/* 操作按鈕組 */
.col-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.btn-icon {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text);
  padding: 4px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}
.btn-icon:hover {
  background: var(--accent);
  color: white;
  border-color: var(--accent);
}
.btn-icon.danger:hover {
  background: #e44;
  border-color: #e44;
}
.btn-icon.restore:hover {
  background: #2c6e2c;
  border-color: #2c6e2c;
}

.empty-message {
  text-align: center;
  padding: 48px;
  color: var(--text-muted);
}

/* 日期字體等寬 */
.col-date {
  font-family: monospace;
  white-space: nowrap;
  font-size: 0.85rem;
}

/* 手機極小 */
@media (max-width: 480px) {
  .admin-dashboard {
    padding: 0 12px;
  }
  h1 {
    font-size: 1.5rem;
  }
  .col-actions {
    gap: 4px;
  }
}

/* ========== 手機板卡片式佈局（≤768px） ========== */
@media (max-width: 768px) {
  .table-wrapper {
    overflow-x: visible;
    margin: 0 -16px;
    border-radius: 0;
    border-left: none;
    border-right: none;
  }
  table,
  thead,
  tbody,
  tr,
  th,
  td {
    display: block;
  }
  thead {
    display: none;
  }
  tr {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    margin-bottom: 20px;
    padding: 16px;
  }
  td {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    padding: 8px 0;
    border-bottom: none;
  }
  /* 所有欄位的標籤固定寬度 */
  .col-title:before,
  .col-slug:before,
  .col-status:before,
  .col-date:before,
  .col-actions:before {
    font-weight: 600;
    color: var(--text);
    flex-shrink: 0;
    width: 70px;
  }
  .col-title:before { content: "標題"; }
  .col-slug:before { content: "Slug"; }
  .col-status:before { content: "狀態"; }
  .col-date:before { content: "更新時間"; }
  .col-actions:before { content: "操作"; }

  /* 操作按鈕組：橫排，靠右 */
  .col-actions {
    justify-content: flex-end;
    flex-wrap: nowrap;
    gap: 8px;
  }
  .col-actions .btn-icon {
    flex: 0 0 auto;
    margin: 0;
  }
  .status-badge {
    display: inline-block;
  }
}
</style>