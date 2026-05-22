<template>
  <div>
    <h1>專案列表</h1>
    
    <!-- 后端冷启动重试中 -->
    <div v-if="isRetrying" class="cold-start-message">
      <p>🚀 後端啟動中…</p>
      <p>{{ countdown }} 秒後自動重新載入</p>
      <p class="retry-hint">已嘗試 {{ retryCount }} / {{ maxRetry }}</p>
      <button @click="manualRetry" class="retry-btn">立即重試</button>
    </div>
    
    <!-- 一般載入中 -->
    <div v-else-if="isLoading" class="loading">
      載入中...
    </div>
    
    <!-- 错误信息 -->
    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
      <button @click="manualRetry" class="retry-btn">重新載入</button>
    </div>
    
    <!-- 正常列表 -->
    <div v-else class="grid">
      <router-link
        v-for="p in projects"
        :key="p.id"
        :to="`/projects/${p.slug}`"
        class="card"
      >
        <div class="card-thumb">
          <img v-if="p.thumbnailUrl" :src="p.thumbnailUrl" alt="縮圖" />
          <span v-else>📁</span>
        </div>
        <span class="tag">{{ p.tag }}</span>
        <h3>{{ p.title }}</h3>
        <p>{{ p.oneLiner }}</p>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useProjectList } from '../composables/useProjectList';

const { projects, isLoading, isRetrying, countdown, retryCount, maxRetry, error, load, manualRetry, cleanup } = useProjectList();

onMounted(() => {
  load();
});

onUnmounted(() => {
  cleanup();
});
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 20px;
  transition: border-color 0.2s;
}
.card:hover {
  border-color: var(--accent);
}
.card-thumb {
  width: 100%;
  height: 160px;
  background: var(--bg);
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin-bottom: 12px;
}
.card-thumb img {
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: var(--radius);
}
.card-thumb span {
  font-size: 48px;
}
.tag {
  display: inline-block;
  background: var(--tag-bg);
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 12px;
  color: var(--text-muted);
}
h3 {
  color: var(--text);
  margin: 8px 0 6px;
}
p {
  font-size: 13px;
  margin: 0;
}
.loading {
  text-align: center;
  padding: 60px;
}

.cold-start-message {
  text-align: center;
  padding: 60px 20px;
  background: var(--surface);
  border-radius: var(--radius);
  max-width: 400px;
  margin: 40px auto;
}
.retry-hint {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-top: 8px;
}
.retry-btn {
  margin-top: 16px;
  background: var(--accent);
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 20px;
  cursor: pointer;
}
.error {
  text-align: center;
  padding: 60px 20px;
  color: #f66;
}
</style>