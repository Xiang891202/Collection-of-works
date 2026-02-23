<template>
  <div class="about-view" :class="mode">
    <!-- 可選的頁面專屬標題 -->
    <h1 class="page-title">關於我</h1>
    <AboutSection :mode="mode" />
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { useMode } from '@/composables/useMode'
import AboutSection from '@/components/AboutSection.vue'
import Footer from '@/components/Footer.vue'

const { mode } = useMode()
</script>

<style scoped>
.about-view {
  min-height: 100vh;
  padding-top: 80px; /* 避免 header 遮擋內容 */
  transition: background-color 0.3s;
}
.about-view.showcase {
  background-color: #ebf8ff;
}
.about-view.professional {
  background-color: #feebc8;
}
.page-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 2rem;
}
</style>