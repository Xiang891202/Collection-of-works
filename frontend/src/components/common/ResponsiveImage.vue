<template>
  <div class="responsive-image" :style="{ aspectRatio: computedAspectRatio }">
    <img
      :src="src"
      :alt="alt"
      @load="onLoad"
      @click="$emit('click', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{
  src: string;
  alt?: string;
  aspectRatio?: string;  // 例如 "16/9", "4/3", "1/1"
}>();

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void;
  (e: 'load'): void;
}>();

const naturalWidth = ref(0);
const naturalHeight = ref(0);
const isLoaded = ref(false);

// 這個計算屬性現在會被模板使用了
const computedAspectRatio = computed(() => {
  if (props.aspectRatio) return props.aspectRatio;
  if (naturalWidth.value && naturalHeight.value) {
    return `${naturalWidth.value / naturalHeight.value}`;
  }
  return '16/9'; // 預設比例
});

function onLoad(e: Event) {
  const img = e.target as HTMLImageElement;
  naturalWidth.value = img.naturalWidth;
  naturalHeight.value = img.naturalHeight;
  isLoaded.value = true;
  emit('load');
}
</script>

<style scoped>
.responsive-image {
  width: 100%;
  position: relative;
  background: var(--surface);
  overflow: hidden;
  border-radius: var(--radius);
}

/* 不同裝置使用不同比例 */
@media (min-width: 1024px) {
  .responsive-image {
    aspect-ratio: 16 / 9;
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .responsive-image {
    aspect-ratio: 4 / 3;
  }
}

@media (max-width: 767px) {
  .responsive-image {
    aspect-ratio: 1 / 1;
  }
}

.responsive-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;  /* 改用 cover 填滿 */
  display: block;
  cursor: pointer;
  transition: transform 0.2s;
}

.responsive-image.fill img {
  object-fit: cover;
}
</style>