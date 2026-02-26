<template>
  <header class="header" >
    <div class="logo">YourLogo</div>
    <nav class="nav">
      <router-link to="/#projects">專案作品</router-link>
      <router-link to="/practice">練習專案</router-link>
      <router-link to="/about">關於我</router-link>
    </nav>
    <ModeToggle :modelValue="mode" @update:modelValue="toggleMode" />
  </header>
</template>

<script setup lang="ts">
import ModeToggle from './ModeToggle.vue'
import { useMode } from '@/composables/useMode'

const { mode, toggleMode } = useMode()
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  transition: background-color 0.3s;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
}
.nav a {
  margin: 0 1rem;
  text-decoration: none;
  color: inherit;
  font-weight: 500;
}
.nav a:hover {
  text-decoration: underline;
}
</style>