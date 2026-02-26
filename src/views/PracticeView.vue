<template>
    <section class="hero" :class="{ 'professional': mode === 'professional' }">
        <div>
            <Practice :mode="mode" />
        </div>
    </section>
    <Footer />
</template>

<script setup lang="ts">
import { useMode } from '@/composables/useMode'
import Practice from '@/components/Practice.vue'
import Footer from '@/components/Footer.vue'

const { mode } = useMode()
// // 將 defineProps 回傳值賦予變數 props，以便在 script 中存取
// const props = defineProps<{
//   mode: 'showcase' | 'professional'
// }>()

// const emit = defineEmits<{
//   (e: 'update:mode', value: 'showcase' | 'professional'): void
//   (e: 'view-projects'): void
// }>()

// const toggleMode = () => {
//   // 使用 props.mode 來取得目前的 mode 值
//   emit('update:mode', props.mode === 'showcase' ? 'professional' : 'showcase')
// }
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
  background-color: #ebf8ff;
}
.hero.professional {
  background-color: #feebc8;
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
