<template>
  <div class="image-manager">
    <!-- 主預覽區域 -->
    <div v-if="displayUrls.length" class="preview-carousel">
      <button type="button" @click="prev" :disabled="displayUrls.length <= 1" class="carousel-nav">‹</button>
      <div class="preview-container">
        <img :src="bypassCache(displayUrls[currentIndex])" class="preview-img" />
      </div>
      <button type="button" @click="next" :disabled="displayUrls.length <= 1" class="carousel-nav">›</button>
    </div>

    <!-- 上傳區域 (拿掉了原本的儲存變更按鈕) -->
    <div class="upload-area">
      <input type="file" multiple accept="image/*" @change="upload" ref="fileInput" style="display:none" />
      <button type="button" @click="triggerUpload" class="upload-btn">上傳圖片</button>
    </div>

    <!-- 縮圖列表 -->
    <div class="thumb-list">
      <div v-for="(url, idx) in displayUrls" :key="idx" class="thumb-item" :class="{ active: idx === currentIndex }" @click="currentIndex = idx">
        <img :src="bypassCache(url)" />
        <button type="button" @click.stop="remove(idx)" class="thumb-remove">✕</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onBeforeUnmount } from 'vue';

// 接收外部資料與父組件傳過來的雙向綁定物件、暫存陣列引用
const props = defineProps<{ 
  modelValue: string[]; 
  projectId: string;
  // 💡 透過 props 接收父組件的暫存參照，讓父組件能拿到實體檔案與要刪除的網址
  newFiles: { file: File; localUrl: string }[];
  deletedUrls: string[];
}>();

const emit = defineEmits(['update:modelValue', 'update:newFiles', 'update:deletedUrls']);

// 內部狀態管理
const serverUrls = ref<string[]>([...props.modelValue]);
const currentIndex = ref(0);
const fileInput = ref<HTMLInputElement | null>(null);

// 即時渲染出來的完整網址列表（排除已刪舊圖，包含新選圖片）
const displayUrls = computed(() => {
  const currentServer = serverUrls.value.filter(url => !props.deletedUrls.includes(url));
  const currentNew = props.newFiles.map(item => item.localUrl);
  return [...currentServer, ...currentNew];
});

// 監聽外部傳入的初始值（如重整資料時）
watch(() => props.modelValue, (newVal) => {
  serverUrls.value = [...newVal];
}, { deep: true });

function prev() { if (displayUrls.value.length) currentIndex.value = (currentIndex.value - 1 + displayUrls.value.length) % displayUrls.value.length; }
function next() { if (displayUrls.value.length) currentIndex.value = (currentIndex.value + 1) % displayUrls.value.length; }
function triggerUpload() { fileInput.value?.click(); }

// 1. 上傳：純前端記憶體暫存並預覽，通知父組件
function upload(e: Event) {
  const files = (e.target as HTMLInputElement).files;
  if (!files) return;

  const currentNewFiles = [...props.newFiles];
  for (const file of Array.from(files)) {
    const localUrl = URL.createObjectURL(file);
    currentNewFiles.push({ file, localUrl });
  }
  emit('update:newFiles', currentNewFiles);
  if (fileInput.value) fileInput.value.value = '';
}

// 2. 移除邏輯：點擊叉叉即時移除預覽畫面，通知父組件更新暫存區
function remove(idx: number) {
  const targetUrl = displayUrls.value[idx];
  if (!targetUrl) return;

  const currentServerCount = serverUrls.value.filter(url => !props.deletedUrls.includes(url)).length;

  if (idx < currentServerCount) {
    // 點到舊圖：塞進待刪除暫存區，通知父組件
    const currentServerUrls = serverUrls.value.filter(url => !props.deletedUrls.includes(url));
    const urlInServer = currentServerUrls[idx];
    emit('update:deletedUrls', [...props.deletedUrls, urlInServer]);
  } else {
    // 點到新圖：從父組件的新增暫存陣列拔除並釋放
    const newImgIdx = idx - currentServerCount;
    const currentNewFiles = [...props.newFiles];
    const targetNewImg = currentNewFiles[newImgIdx];
    if (targetNewImg) {
      URL.revokeObjectURL(targetNewImg.localUrl);
      currentNewFiles.splice(newImgIdx, 1);
      emit('update:newFiles', currentNewFiles);
    }
  }

  // 調整目前輪播位置
  if (currentIndex.value >= displayUrls.value.length) {
    currentIndex.value = Math.max(0, displayUrls.value.length - 1);
  }
}

// 3. 防快取函式
function bypassCache(url: string) {
  if (!url) return '';
  if (url.startsWith('blob:')) return url;
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}t=${new Date().getMinutes()}`;
}

// 組件卸載時清理 Blob
onBeforeUnmount(() => {
  props.newFiles.forEach(item => URL.revokeObjectURL(item.localUrl));
});
</script>

<style scoped>
/* 保留你原本的所有樣式 ... 拿掉綠色 .save-btn 樣式即可 */
.image-manager {
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px;
  background: var(--surface);
}
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
.thumb-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin: 8px 0 0 0;
  padding: 4px 0;
}
.thumb-item {
  position: relative;
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
