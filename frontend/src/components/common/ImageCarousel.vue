<template>
  <div v-if="images.length" class="image-carousel">
    <div class="carousel-container">
      <div class="carousel-main">
        <img
          :src="currentImageSrc"
          :alt="currentImageAlt"
          class="carousel-image"
          @click="openLightbox"
        />
        
        <button 
          v-if="images.length > 1" 
          class="carousel-nav prev" 
          @click="prev"
        >
          ‹
        </button>
        <button 
          v-if="images.length > 1" 
          class="carousel-nav next" 
          @click="next"
        >
          ›
        </button>
      </div>
      
      <div v-if="images.length > 1" class="carousel-dots">
        <span
          v-for="(_, idx) in images"
          :key="idx"
          class="dot"
          :class="{ active: idx === currentIndex }"
          @click="goTo(idx)"
        ></span>
      </div>
    </div>
    
    <LightboxModal 
      ref="lightboxRef" 
      :images="imageUrls" 
      @close="onLightboxClose"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import LightboxModal from './LightboxModal.vue';

interface ImageItem {
  src: string;
  alt?: string;
}

const props = defineProps<{
  images: (string | ImageItem)[];
}>();

const currentIndex = ref(0);
const lightboxRef = ref<InstanceType<typeof LightboxModal> | null>(null);

const normalizedImages = computed(() => {
  return props.images.map(img => 
    typeof img === 'string' ? { src: img, alt: '' } : img
  );
});

const imageUrls = computed(() => {
  return normalizedImages.value.map(img => img.src);
});

const currentImageSrc = computed(() => {
  return normalizedImages.value[currentIndex.value]?.src || '';
});

const currentImageAlt = computed(() => {
  return normalizedImages.value[currentIndex.value]?.alt || '';
});

function next() {
  if (currentIndex.value < normalizedImages.value.length - 1) {
    currentIndex.value++;
  } else {
    currentIndex.value = 0;
  }
}

function prev() {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  } else {
    currentIndex.value = normalizedImages.value.length - 1;
  }
}

function goTo(index: number) {
  currentIndex.value = index;
}

function openLightbox() {
  if (lightboxRef.value) {
    lightboxRef.value.open(currentIndex.value);
  }
}

function onLightboxClose() {
  // 可以選擇是否同步索引
}
</script>

<style scoped>
.image-carousel {
  width: 100%;
}

.carousel-container {
  position: relative;
  width: 100%;
}

.carousel-main {
  position: relative;
  width: 100%;
  background: var(--surface);
  border-radius: var(--radius);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}

/* 🔧 關鍵修復：使用 min-height 而不是固定 aspect-ratio */
.carousel-image {
  width: 100%;
  height: auto;
  max-height: 400px;
  object-fit: contain;   /* 保持完整比例 */
  cursor: pointer;
  transition: transform 0.2s;
}

/* 🔧 圖片使用 contain，保持完整比例，不裁剪不變形 */
.carousel-image {
  width: 100%;
  height: auto;
  max-height: 400px;
  object-fit: contain;  /* 改為 contain，保持圖片原始比例 */
  cursor: pointer;
  display: block;
  transition: transform 0.2s;
}

.carousel-image:hover {
  transform: scale(1.01);
}

/* 導航按鈕 */
.carousel-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  border-radius: 50%;
  color: white;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  z-index: 10;
}

.carousel-nav:hover {
  background: rgba(0, 0, 0, 0.8);
}

.carousel-nav.prev {
  left: 12px;
}

.carousel-nav.next {
  right: 12px;
}

/* 指示點 */
.carousel-dots {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 16px;
}

.dot {
  width: 8px;
  height: 8px;
  background: var(--text-muted);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
}

.dot.active {
  background: var(--accent);
  width: 24px;
  border-radius: 4px;
}

/* 手機 */
@media (max-width: 768px) {
  .carousel-image {
    max-height: 300px;
  }
  
  .carousel-nav {
    width: 32px;
    height: 32px;
    font-size: 18px;
  }
}

@media (max-width: 480px) {
  .carousel-image {
    max-height: 250px;
  }
}
</style>