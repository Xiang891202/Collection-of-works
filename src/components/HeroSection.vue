<template>
  <section class="hero" :class="{ 'professional': mode === 'professional' }">
    <h1 class="title">打造現代化網頁作品集</h1>
    <p class="subtitle">結合設計與技術，呈現你的專業實力</p>
    <div class="cta">
      <button class="btn primary" @click="$emit('view-projects')">查看成果</button>
      <button class="btn secondary" @click="toggleMode">切換模式</button>
    </div>
  </section>
</template>

<script setup>
defineProps({
  mode: {
    type: String,
    required: true,
  },
});
const emit = defineEmits(['update:mode', 'view-projects']);

const toggleMode = () => {
  emit('update:mode', mode === 'showcase' ? 'professional' : 'showcase');
};
</script>

<style scoped>
.hero {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 2rem;
  transition: background-color 0.3s;
  background-color: #ebf8ff; /* 展示版淡藍色 */
}
.hero.professional {
  background-color: #feebc8; /* 專業版淡橘色 */
}
.title {
  font-size: 3rem;
  margin-bottom: 1rem;
}
.subtitle {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  color: #4a5568;
}
.cta .btn {
  padding: 0.75rem 2rem;
  margin: 0 0.5rem;
  border: none;
  border-radius: 2rem;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.2s;
}
.cta .btn.primary {
  background-color: #2b6cb0;
  color: white;
}
.cta .btn.secondary {
  background-color: #cbd5e0;
  color: #1a202c;
}
.cta .btn:hover {
  transform: translateY(-2px);
}
</style>