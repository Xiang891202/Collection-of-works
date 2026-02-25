<template>
  <button
    class="mode-toggle"
    :class="{ 'professional': modelValue === 'professional' }"
    @click="$emit('update:modelValue', modelValue === 'showcase' ? 'professional' : 'showcase')"
  >
    {{ modelValue === 'showcase' ? '展示版' : '專業版' }}
  </button>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: 'showcase' | 'professional'
}>()

defineEmits<{
  (e: 'update:modelValue', value: 'showcase' | 'professional'): void
}>()
</script>

<style scoped>
.mode-toggle {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 2rem;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s, color 0.3s;
  background-color: var(--bg-button, #e2e8f0);
  color: var(--text-button, #1a202c);
}
.mode-toggle.professional {
  background-color: var(--bg-button-prof, #fbd38d);
  color: var(--text-button-prof, #7b341e);
}
</style>