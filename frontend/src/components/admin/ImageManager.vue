<template>
  <div class="image-manager">
    <!-- 主預覽區域 -->
    <div v-if="displayUrls.length" class="preview-carousel">
      <button type="button" @click="prev" :disabled="displayUrls.length <= 1" class="carousel-nav">‹</button>
      <div class="preview-container">
        <!-- 使用 bypassCache 強迫不抓舊快取 -->
        <img :src="bypassCache(displayUrls[currentIndex])" class="preview-img" />
      </div>
      <button type="button" @click="next" :disabled="displayUrls.length <= 1" class="carousel-nav">›</button>
    </div>

    <!-- 上傳與儲存區域 -->
    <div class="upload-area">
      <input type="file" multiple accept="image/*" @change="upload" ref="fileInput" style="display:none" />
      <button type="button" @click="triggerUpload" class="upload-btn">上傳圖片</button>
      
      <!-- 新增：點擊才同步到資料庫的儲存按鈕 -->
      <button type="button" @click="submitChanges" :disabled="!isDirty" class="save-btn">
        儲存變更
      </button>
    </div>

    <!-- 縮圖列表 -->
    <div class="thumb-list">
      <div v-for="(url, idx) in displayUrls" :key="idx" class="thumb-item" :class="{ active: idx === currentIndex }" @click="currentIndex = idx">
        <!-- 縮圖同樣加上防快取 -->
        <img :src="bypassCache(url)" />
        <button @click.stop="remove(idx)" class="thumb-remove">✕</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onBeforeUnmount } from 'vue';
import { uploadImage, deleteImage } from '../../api/index.api';   // 依實際路徑調整

const props = defineProps<{ modelValue: string[]; projectId: string }>();
const emit = defineEmits(['update:modelValue']);

// --- 核心狀態宣告（修正找不到名稱的錯誤） ---
const serverUrls = ref<string[]>([...props.modelValue]); // 資料庫原有的圖片網址
const newFiles = ref<{ file: File; localUrl: string }[]>([]); // 前端暫存的新選檔案與 Blob 網址
const deletedUrls = ref<string[]>([]); // 被點擊刪除的舊圖片網址暫存區
const currentIndex = ref(0);
const fileInput = ref<HTMLInputElement | null>(null);

// 判斷前端資料是否有被改動（有改動才能點儲存）
const isDirty = computed(() => newFiles.value.length > 0 || deletedUrls.value.length > 0);

// 即時渲染出來的完整網址列表（排除已刪舊圖，包含新選圖片）
const displayUrls = computed(() => {
  const currentServer = serverUrls.value.filter(url => !deletedUrls.value.includes(url));
  const currentNew = newFiles.value.map(item => item.localUrl);
  return [...currentServer, ...currentNew];
});

// 監聽外部傳入的初始值
watch(() => props.modelValue, (newVal) => {
  serverUrls.value = [...newVal];
  deletedUrls.value = [];
  newFiles.value.forEach(item => URL.revokeObjectURL(item.localUrl));
  newFiles.value = [];
}, { deep: true });

function prev() { if (displayUrls.value.length) currentIndex.value = (currentIndex.value - 1 + displayUrls.value.length) % displayUrls.value.length; }
function next() { if (displayUrls.value.length) currentIndex.value = (currentIndex.value + 1) % displayUrls.value.length; }
function triggerUpload() { fileInput.value?.click(); }

// 1. 上傳：純前端記憶體暫存並預覽，絕對不抓快取，此時不打 API
function upload(e: Event) {
  const files = (e.target as HTMLInputElement).files;
  if (!files) return;

  for (const file of Array.from(files)) {
    const localUrl = URL.createObjectURL(file); // 產生專屬虛擬網址
    newFiles.value.push({ file, localUrl });
  }
  if (fileInput.value) fileInput.value.value = '';
}

// 2. 移除邏輯：點擊叉叉即時移除預覽畫面，不觸發資料庫
function remove(idx: number) {
  const targetUrl = displayUrls.value[idx];
  if (!targetUrl) return;

  const currentServerCount = serverUrls.value.filter(url => !deletedUrls.value.includes(url)).length;

  if (idx < currentServerCount) {
    // 點到的是資料庫舊圖：塞進待刪除暫存區
    const currentServerUrls = serverUrls.value.filter(url => !deletedUrls.value.includes(url));
    const urlInServer = currentServerUrls[idx];
    deletedUrls.value.push(urlInServer);
  } else {
    // 點到的是新上傳圖：從記憶體陣列拔除並釋放
    const newImgIdx = idx - currentServerCount;
    const targetNewImg = newFiles.value[newImgIdx];
    if (targetNewImg) {
      URL.revokeObjectURL(targetNewImg.localUrl);
      newFiles.value.splice(newImgIdx, 1);
    }
  }

  // 調整目前輪播位置
  if (currentIndex.value >= displayUrls.value.length) {
    currentIndex.value = Math.max(0, displayUrls.value.length - 1);
  }
}

// 3. 點擊儲存變更：此時才一次性與資料庫做同步更新
async function submitChanges() {
  if (!props.projectId) return;

  try {
    // A. 處理刪除：把所有丟進暫存區的網址傳給後端 API 移除
    for (const url of deletedUrls.value) {
      await deleteImage(props.projectId, url);
    }

    // B. 處理新增：把所有暫存的新檔案打 API 傳給後端
    const uploadedUrls: string[] = [];
    for (const item of newFiles.value) {
      const res = await uploadImage(props.projectId, item.file);
      uploadedUrls.push(res.data.data!.url);
    }

    // C. 計算變更後的最終新網址陣列
    const finalUrls = [
      ...serverUrls.value.filter(url => !deletedUrls.value.includes(url)),
      ...uploadedUrls
    ];

    // D. 同步通知父組件更新 v-model
    emit('update:modelValue', finalUrls);

    // E. 重新初始化暫存狀態
    deletedUrls.value = [];
    newFiles.value.forEach(item => URL.revokeObjectURL(item.localUrl));
    newFiles.value = [];
    serverUrls.value = finalUrls;

    alert('資料庫已同步儲存！');
  } catch (err) {
    console.error('儲存失敗', err);
    alert('同步資料庫時發生錯誤');
  }
}

// 4. 防快取函式
function bypassCache(url: string) {
  if (!url) return '';
  if (url.startsWith('blob:')) return url;
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}t=${new Date().getMinutes()}`;
}

// 組件卸載時清理 Blob 避免記憶體洩漏
onBeforeUnmount(() => {
  newFiles.value.forEach(item => URL.revokeObjectURL(item.localUrl));
});
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

/* 上傳區域 */
.upload-area {
  margin-bottom: 20px;
  text-align: center;
  display: flex;
  justify-content: center;
  gap: 10px;
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

/* 儲存變更按鈕樣式 */
.save-btn {
  background: #28a745;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
}
.save-btn:disabled {
  background: #555;
  color: #888;
  cursor: not-allowed;
}

/* 縮圖列表：統一尺寸，刪除按鈕正確定位 */
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
