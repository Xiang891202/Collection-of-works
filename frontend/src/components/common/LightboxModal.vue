<template>
  <Teleport to="body">
    <Transition name="lightbox-fade">
      <div v-if="visible" class="lightbox-overlay" @click.self="close">
        <button class="lightbox-close" @click="close">✕</button>

        <div class="lightbox-main">
          <img
            :src="currentImageSrc"
            :alt="currentImageAlt"
            class="lightbox-image"
            :class="{ 'is-zoomed': isZoomed }"
            @click="toggleZoom"
          />
        </div>

        <button 
          v-if="imageUrls.length > 1" 
          class="lightbox-nav prev" 
          @click="prev"
        >
          ‹
        </button>
        <button 
          v-if="imageUrls.length > 1" 
          class="lightbox-nav next" 
          @click="next"
        >
          ›
        </button>

        <div v-if="imageUrls.length > 1" class="lightbox-counter">
          {{ currentIndex + 1 }} / {{ imageUrls.length }}
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue';

const props = defineProps<{
  images: string[];
  initialIndex?: number;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const visible = ref(false);
const currentIndex = ref(0);
const isZoomed = ref(false);

const imageUrls = computed(() => props.images || []);

const currentImageSrc = computed(() => {
  return imageUrls.value[currentIndex.value] || '';
});

const currentImageAlt = computed(() => {
  return `圖片 ${currentIndex.value + 1}`;
});

function open(index = 0) {
  if (imageUrls.value.length === 0) return;
  currentIndex.value = Math.min(Math.max(0, index), imageUrls.value.length - 1);
  visible.value = true;
  isZoomed.value = false;
  document.body.style.overflow = 'hidden';
}

function close() {
  visible.value = false;
  isZoomed.value = false;
  document.body.style.overflow = '';
  emit('close');
}

function next() {
  if (currentIndex.value < imageUrls.value.length - 1) {
    currentIndex.value++;
    isZoomed.value = false;
  }
}

function prev() {
  if (currentIndex.value > 0) {
    currentIndex.value--;
    isZoomed.value = false;
  }
}

function toggleZoom() {
  isZoomed.value = !isZoomed.value;
}

function handleKeydown(e: KeyboardEvent) {
  if (!visible.value) return;
  
  switch (e.key) {
    case 'Escape':
      close();
      break;
    case 'ArrowLeft':
      prev();
      break;
    case 'ArrowRight':
      next();
      break;
  }
}

watch(visible, (newVal) => {
  if (newVal) {
    window.addEventListener('keydown', handleKeydown);
  } else {
    window.removeEventListener('keydown', handleKeydown);
  }
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
  document.body.style.overflow = '';
});

defineExpose({ open, close });
</script>

<style scoped>
.lightbox-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lightbox-close {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 44px;
  height: 44px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 50%;
  color: white;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.lightbox-close:hover {
  background: rgba(255, 255, 255, 0.2);
}

.lightbox-main {
  width: 90vw;
  height: 85vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.lightbox-image {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
  cursor: zoom-in;
  transition: transform 0.2s ease;
}

/* 放大狀態 - 使用 CSS transform 縮放 */
.lightbox-image.is-zoomed {
  transform: scale(2);
  cursor: zoom-out;
}

.lightbox-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 50%;
  color: white;
  font-size: 32px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.lightbox-nav:hover {
  background: rgba(255, 255, 255, 0.2);
}

.lightbox-nav.prev {
  left: 20px;
  background: rgba(0, 0, 0, 0.8);
}

.lightbox-nav.next {
  right: 20px;
  background: rgba(0, 0, 0, 0.8);
}

.lightbox-counter {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 6px 12px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 20px;
  color: white;
  font-size: 14px;
  font-family: monospace;
}

.lightbox-fade-enter-active,
.lightbox-fade-leave-active {
  transition: opacity 0.2s ease;
}

.lightbox-fade-enter-from,
.lightbox-fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .lightbox-main {
    width: 95vw;
    height: 80vh;
  }
  
  .lightbox-nav {
    width: 40px;
    height: 40px;
    font-size: 24px;
  }
  
  .lightbox-nav.prev {
    left: 10px;
  }
  
  .lightbox-nav.next {
    right: 10px;
  }
  
  .lightbox-close {
    top: 12px;
    right: 12px;
    width: 40px;
    height: 40px;
    font-size: 20px;
  }
}
</style>