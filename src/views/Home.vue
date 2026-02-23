<template>
  <div class="home" :class="mode">
    <HeroSection :mode="mode" @update:mode="toggleMode" @view-projects="scrollToProjects" />
    <ProjectList :mode="mode" />
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { useMode } from '@/composables/useMode'
import HeroSection from '@/components/HeroSection.vue'
import ProjectList from '@/components/ProjectList.vue'
import Footer from '@/components/Footer.vue'

const { mode, toggleMode } = useMode()

// 從 Hero CTA 滾動到專案列表
const scrollToProjects = () => {
  const projectsSection = document.getElementById('projects')
  if (projectsSection) {
    projectsSection.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<style scoped>
.home {
  min-height: 100vh;
  transition: background-color 0.3s;
}
.home.showcase {
  background-color: #ebf8ff;
}
.home.professional {
  background-color: #feebc8;
}
</style>