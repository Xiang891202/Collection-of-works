<template>
  <div class="home" :class="mode">
    <Header v-model:mode="mode" />
    <HeroSection
      :mode="mode"
      @update:mode="mode = $event"
      @view-projects="scrollToProjects"
    />
    <ProjectList :mode="mode" />
    <AboutSection :mode="mode" />
    <Footer />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Header from '@/components/Header.vue';
import HeroSection from '@/components/HeroSection.vue';
import ProjectList from '@/components/ProjectList.vue';
import AboutSection from '@/components/AboutSection.vue';
import Footer from '@/components/Footer.vue';

// 模式狀態：'showcase' 或 'professional'
const mode = ref('showcase');

// 平滑滾動至專案列表區（可由 Hero CTA 觸發）
const scrollToProjects = () => {
  const projectsSection = document.getElementById('projects');
  if (projectsSection) {
    projectsSection.scrollIntoView({ behavior: 'smooth' });
  }
};
</script>

<style>
/* 全域樣式與模式背景色 */
.home {
  min-height: 100vh;
  transition: background-color 0.3s;
}
.home.showcase {
  background-color: #ebf8ff; /* 展示版淡藍色背景 */
}
.home.professional {
  background-color: #feebc8; /* 專業版淡橘色背景 */
}

/* 基本重設 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', sans-serif;
  color: #1a202c;
  line-height: 1.6;
}
</style>