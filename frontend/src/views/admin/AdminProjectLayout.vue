<template>
  <div class="admin-layout">
    <aside class="sidebar">
      <button @click="goBack" class="back-btn">← 返回列表</button>
      <h2>專案編輯</h2>
      <nav>
        <router-link :to="`/admin/projects/${projectId}/meta`" active-class="active">基本資料</router-link>
        <router-link :to="`/admin/projects/${projectId}/showcase`" active-class="active">展示版</router-link>
        <router-link :to="`/admin/projects/${projectId}/professional`" active-class="active">專業版</router-link>
        <router-link :to="`/admin/projects/${projectId}/case-study`" active-class="active">工程紀錄</router-link>
      </nav>

      <div v-if="!isNew" class="publish-section">
        <h3>發布設定</h3>
        <div class="status-row">
          <label>狀態：</label>
          <select v-model="localStatus">
            <option value="draft">草稿</option>
            <option value="active">已發布</option>
          </select>
        </div>
        <div class="publish-row">
          <label>預約發布時間：</label>
          <div class="datetime-wrapper">
            <input
              type="datetime-local"
              v-model="localPublishedAt"
              step="1"
              ref="datetimeInput"
            />
            <button type="button" @click="openDateTimePicker" class="calendar-btn" title="選擇日期時間">
              📅
            </button>
          </div>
        </div>
        <button @click="handlePublish" class="publish-btn">套用發布設定</button>
      </div>
    </aside>
    <main class="content">
      <router-view :project-id="projectId" :is-new="isNew" />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { publishProject, fetchAdminProject } from '../../api/index.api';

const route = useRoute();
const router = useRouter();
const projectId = computed(() => route.params.id as string);
const isNew = computed(() => route.path.includes('/new'));

const localStatus = ref('draft');
const localPublishedAt = ref('');
const datetimeInput = ref<HTMLInputElement | null>(null);

const goBack = () => {
  router.push('/admin/dashboard');
};

async function loadPublishInfo() {
  if (isNew.value) return;
  try {
    const res = await fetchAdminProject(projectId.value);
    if (res && res.data) {
      const p = res.data as any;
      console.log('載入發布資訊 - 原始 status:', p.status);  // 檢查這裡
      localStatus.value = p.status === 'active' ? 'active' : 'draft'; // 強制比對
      if (p.published_at) {
        const date = new Date(p.published_at);
        if (!isNaN(date.getTime())) {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          const hours = String(date.getHours()).padStart(2, '0');
          const minutes = String(date.getMinutes()).padStart(2, '0');
          localPublishedAt.value = `${year}-${month}-${day}T${hours}:${minutes}`;
        } else {
          localPublishedAt.value = '';
        }
      } else {
        localPublishedAt.value = '';
      }
    }
  } catch (error) {
    console.error('載入發布設定失敗:', error);
  }
}

function openDateTimePicker() {
  if (datetimeInput.value) {
    if (typeof datetimeInput.value.showPicker === 'function') {
      datetimeInput.value.showPicker();
    } else {
      datetimeInput.value.focus();
    }
  }
}

async function handlePublish() {
  if (isNew.value) return;
  try {
    await publishProject(projectId.value, {
      status: localStatus.value,
      published_at: localPublishedAt.value ? new Date(localPublishedAt.value).toISOString() : null,
    });
    alert('發布設定已儲存');
    // 重新載入最新資料
    await loadPublishInfo();
  } catch (err: any) {
    console.error('儲存發布設定失敗', err);
    alert(err.response?.data?.error || '儲存失敗，請檢查後端日誌');
  }
}

onMounted(loadPublishInfo);
</script>

<style scoped>
.back-btn {
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--text);
  padding: 6px 12px;
  border-radius: var(--radius);
  margin-bottom: 20px;
  width: 100%;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}
.back-btn:hover {
  background: var(--accent);
  color: white;
  border-color: var(--accent);
}

.admin-layout {
  display: flex;
  gap: 32px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}
.sidebar {
  width: 240px;
  background: var(--surface);
  padding: 20px;
  border-radius: var(--radius);
  height: fit-content;
}
.sidebar nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 32px;
}
.sidebar nav a {
  padding: 8px 12px;
  border-radius: 6px;
  color: var(--text);
}
.sidebar nav a.active {
  background: var(--accent);
  color: white;
}
.publish-section {
  border-top: 1px solid var(--border);
  padding-top: 20px;
  margin-top: 20px;
}
.publish-section h3 {
  font-size: 16px;
  margin-bottom: 12px;
}
.status-row, .publish-row {
  margin-bottom: 12px;
}
label {
  display: block;
  font-size: 13px;
  margin-bottom: 4px;
}
select, input {
  width: 100%;
  padding: 6px 8px;
  background: var(--bg);
  border: 1px solid var(--border);
  color: var(--text);
  border-radius: 4px;
}
.datetime-wrapper {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: nowrap;
  width: 100%;
}
.datetime-wrapper input {
  flex: 1;
  min-width: 0;
}
.calendar-btn {
  flex-shrink: 0;
  width: 36px;
  padding: 6px 0;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.calendar-btn:hover {
  background: var(--accent);
  color: white;
  border-color: var(--accent);
}
.publish-btn {
  width: 100%;
  margin-top: 12px;
  background: #2c3e50;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
}
.content {
  flex: 1;
}
</style>