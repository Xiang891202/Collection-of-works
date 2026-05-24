<template>
  <div id="app">
    <nav class="navbar">
      <div class="nav-left">
        <router-link to="/" class="logo">Collection of Works</router-link>
        <router-link to="/projects">專案列表</router-link>
        <router-link to="/about">關於我</router-link>
        <!-- <router-link to="/admin/login">後台</router-link> -->
      </div>
      <button @click="toggleMode" class="mode-btn">
        {{ currentMode === 'showcase' ? '📋 展示版' : '⚙️ 專業版' }}
      </button>
    </nav>
    <main class="container">
      <router-view :key="viewKey" />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { currentMode } from './composables/globalState';  // ✅ 正確來源
import { useProjectDetail } from './composables/useProjectDetail';

const route = useRoute();
const router = useRouter();
const viewKey = ref(0);
const { loadProject } = useProjectDetail();

function toggleMode() {
  const newMode = currentMode.value === 'showcase' ? 'professional' : 'showcase';
  currentMode.value = newMode;
  const slug = route.params.slug as string;
  if (slug) {
    router.push({
      path: `/projects/${slug}`,
      query: { mode: newMode }
    });
    loadProject(slug);
  }
  window.scrollTo(0, 0);
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 24px;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 10;
}
.nav-left {
  display: flex;
  gap: 24px;
  align-items: center;
}
.logo {
  font-weight: bold;
  font-size: 16px;
  color: var(--text) !important;
}
.nav-left a {
  color: var(--text-muted);
  font-size: 14px;
}
.nav-left a.router-link-active {
  color: var(--text);
}
.mode-btn {
  font-size: 13px;
}
main {
  padding: 32px 0;
}
</style>