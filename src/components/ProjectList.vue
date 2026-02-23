<template>
  <div>
    <!-- 專案作品區 (official) -->
    <section id="projects" class="project-section">
      <h2 class="section-title">專案作品</h2>
      <div class="card-grid">
        <ProjectCard
          v-for="project in officialProjects"
          :key="project.id"
          :project="project"
          :mode="mode"
        />
      </div>
    </section>

    <!-- 練習專案區 (practice) -->
    <section id="practice" class="project-section">
      <h2 class="section-title">練習專案</h2>
      <div class="card-grid">
        <ProjectCard
          v-for="project in practiceProjects"
          :key="project.id"
          :project="project"
          :mode="mode"
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ProjectCard from './ProjectCard.vue'
import { projects } from '@/data/projects'

const props = defineProps<{
  mode: 'showcase' | 'professional'
}>()

const officialProjects = computed(() =>
  projects.filter(p => p.type === 'official')
)
const practiceProjects = computed(() =>
  projects.filter(p => p.type === 'practice')
)
</script>

<style scoped>
.project-section {
  padding: 4rem 2rem;
}
.section-title {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 2rem;
}
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}
</style>