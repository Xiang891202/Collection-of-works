<template>
  <div class="project-card">
    <img :src="project.images" :alt="project.title" class="card-image" />
    <div class="card-content">
      <h3>{{ project.title }}</h3>
      <transition name="fade" mode="out-in">
        <p :key="mode" class="description">
          {{ mode === 'showcase' ? project.showcaseText : project.professionalText }}
        </p>
      </transition>
    </div>
  </div>
</template>

<script setup>
defineProps({
  project: {
    type: Object,
    required: true,
  },
  mode: {
    type: String,
    required: true,
  },
});
</script>

<style scoped>
.project-card {
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}
.project-card:hover {
  transform: translateY(-8px);
}
.card-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}
.card-content {
  padding: 1.5rem;
}
.card-content h3 {
  margin-bottom: 0.5rem;
}
.description {
  line-height: 1.6;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>