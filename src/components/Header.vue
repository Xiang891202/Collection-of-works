<template>
  <header class="header" :class="{ 'professional': mode === 'professional' }">
    <div class="logo">YourLogo</div>
    <nav class="nav">
      <a href="#projects" @click.prevent="scrollTo('projects')">專案作品</a>
      <a href="#practice" @click.prevent="scrollTo('practice')">練習專案</a>
      <a href="#about" @click.prevent="scrollTo('about')">關於我</a>
    </nav>
    <ModeToggle :modelValue="mode" @update:modelValue="value => $emit('update:mode', value)" />
  </header>
</template>

<script setup>
import ModeToggle from './ModeToggle.vue';

defineProps({
  mode: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['update:mode']);

const scrollTo = (sectionId) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};
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
.header.professional {
  background-color: rgba(254, 235, 200, 0.9);
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