<template>
  <div class="image-manager">
    <!-- 主預覽區域 -->
    <div v-if="value.length" class="preview-carousel">
      <button type="button" @click="prev" :disabled="value.length <= 1" class="carousel-nav">‹</button>
      <div class="preview-container">
        <img :src="value[currentIndex]" class="preview-img" />
      </div>
      <button type="button" @click="next" :disabled="value.length <= 1" class="carousel-nav">›</button>
    </div>

    <!-- 上傳區域 -->
    <div class="upload-area">
      <input type="file" multiple accept="image/*" @change="upload" ref="fileInput" style="display:none" />
      <button type="button" @click="triggerUpload" class="upload-btn">上傳圖片</button>
    </div>

    <!-- 縮圖列表 -->
    <div class="thumb-list">
      <div v-for="(url, idx) in value" :key="idx" class="thumb-item" :class="{ active: idx === currentIndex }" @click="currentIndex = idx">
        <img :src="url" />
        <button @click.stop="remove(idx)" class="thumb-remove">✕</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { uploadImage, deleteImage } from '../../api/index.api';   // 依實際路徑調整

const props = defineProps<{ modelValue: string[]; projectId: string }>();
const emit = defineEmits(['update:modelValue']);
const value = ref(props.modelValue);
const currentIndex = ref(0);
const fileInput = ref<HTMLInputElement | null>(null);

watch(() => props.modelValue, (newVal) => { value.value = newVal; });
watch(value, (newVal) => { emit('update:modelValue', newVal); }, { deep: true });

function prev() { if (value.value.length) currentIndex.value = (currentIndex.value - 1 + value.value.length) % value.value.length; }
function next() { if (value.value.length) currentIndex.value = (currentIndex.value + 1) % value.value.length; }
function triggerUpload() { fileInput.value?.click(); }

async function upload(e: Event) {
  const files = (e.target as HTMLInputElement).files;
  if (!files || !props.projectId) return;
  for (const file of Array.from(files)) {
    const res = await uploadImage(props.projectId, file);
    value.value.push(res.data.data!.url);
  }
  if (fileInput.value) fileInput.value.value = '';
}

async function remove(idx: number) {
  const urlToDelete = value.value[idx];
  if (urlToDelete && props.projectId) {
    try {
      await deleteImage(props.projectId, urlToDelete);
    } catch (err) {
      console.error('刪除 Storage 圖片失敗', err);
      // 可選擇是否繼續移除前端顯示
    }
  }
  value.value.splice(idx, 1);
  if (currentIndex.value >= value.value.length) currentIndex.value = Math.max(0, value.value.length - 1);
}
</script>

<style scoped>
.image-manager {
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px;
  background: var(--surface);
}

/* 主預覽區域：固定高度 */
.preview-carousel {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 20px;
}
.preview-container {
  flex: 1;
  display: flex;
  justify-content: center;
  background: #0a0a0a;
  border-radius: 8px;
  min-height: 200px;
  max-height: 300px;
}
.preview-img {
  max-width: 100%;
  max-height: 300px;
  object-fit: contain;
  border-radius: 8px;
}
.carousel-nav {
  background: var(--bg);
  border: 1px solid var(--border);
  color: var(--text);
  font-size: 24px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
}
.carousel-nav:hover:not(:disabled) {
  background: var(--accent);
  color: white;
}
.carousel-nav:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

/* 上傳按鈕 */
.upload-area {
  margin-bottom: 20px;
  text-align: center;
}
.upload-btn {
  background: var(--accent);
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
}

/* 縮圖列表：統一尺寸，刪除按鈕正確定位 */
.thumb-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin: 8px 0 0 0;
  padding: 4px 0;  /* 為按鈕留出空間 */
}
.thumb-item {
  position: relative;           /* 關鍵：讓內部絕對定位按鈕相對於此容器 */
  width: 80px;
  height: 80px;
  background: var(--bg);
  border-radius: 8px;
  overflow: visible;
  cursor: pointer;
  border: 2px solid transparent;
  transition: border 0.2s;
}
.thumb-item.active {
  border-color: var(--accent);
}
.thumb-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.thumb-remove {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 22px;
  height: 22px;
  background: #e44;
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 14px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  transition: transform 0.1s;
}
.thumb-remove:hover {
  transform: scale(1.1);
  background: #c33;
}
</style>