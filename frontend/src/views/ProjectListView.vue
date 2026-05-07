<template>
  <div>
    <h1>專案列表</h1>
    <div v-if="isLoading" class="loading">載入中...</div>
    <div v-else-if="error">錯誤: {{ error }}</div>
    <div v-else class="grid">
      <router-link
        v-for="p in projects"
        :key="p.id"
        :to="`/projects/${p.slug}`"
        class="card"
      >
        <div class="card-thumb">{{ p.thumbnailUrl ? '🖼' : '📁' }}</div>
        <span class="tag">{{ p.tag }}</span>
        <h3>{{ p.title }}</h3>
        <p>{{ p.oneLiner }}</p>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useProjectList } from '../composables/useProjectList';

const { projects, isLoading, error, load } = useProjectList();
onMounted(() => load());
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
.card:hover { border-color: var(--accent); }
.card-thumb {
  font-size: 48px;
  text-align: center;
  padding: 20px;
  background: var(--bg);
  border-radius: var(--radius);
  margin-bottom: 12px;
}
.tag {
  display: inline-block;
  background: var(--tag-bg);
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 12px;
  color: var(--text-muted);
}
h3 { color: var(--text); margin: 8px 0 6px; }
p { font-size: 13px; margin: 0; }
.loading { text-align: center; padding: 60px; }
</style>