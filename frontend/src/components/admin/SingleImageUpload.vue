<template>
  <div class="single-image-upload">
    <div v-if="imageUrl" class="preview">
      <img :src="imageUrl" alt="縮圖預覽" />
      <button type="button" @click="removeImage" class="remove-btn">✕</button>
    </div>
    <div v-else class="upload-area" @click="triggerUpload">
      <input
        type="file"
        accept="image/*"
        ref="fileInput"
        @change="handleUpload"
        style="display: none"
      />
      <div class="upload-placeholder">
        <span>點擊上傳圖片</span>
      </div>
    </div>
    <p v-if="uploading" class="uploading">上傳中...</p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { uploadImage, deleteImage } from '../../api/index.api';

const props = defineProps<{
  projectId: string;
  modelValue: string; // 圖片 URL
}>();

const emit = defineEmits(['update:modelValue']);

const imageUrl = ref(props.modelValue);
const fileInput = ref<HTMLInputElement | null>(null);
const uploading = ref(false);

watch(() => props.modelValue, (newVal) => {
  imageUrl.value = newVal;
});

async function triggerUpload() {
  fileInput.value?.click();
}

async function handleUpload(e: Event) {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file || !props.projectId) return;

  // 如果已有舊圖片，先刪除 Storage 中的檔案
  if (imageUrl.value) {
    try {
      await deleteImage(props.projectId, imageUrl.value);
    } catch (err) {
      console.error('刪除舊圖片失敗', err);
    }
  }

  uploading.value = true;
  try {
    const res = await uploadImage(props.projectId, file);
    const url = res.data.data!.url;
    imageUrl.value = url;
    emit('update:modelValue', url);
  } catch (err) {
    alert('上傳失敗');
  } finally {
    uploading.value = false;
    if (fileInput.value) fileInput.value.value = '';
  }
}

function removeImage() {
  if (imageUrl.value && props.projectId) {
    deleteImage(props.projectId, imageUrl.value).catch(console.error);
  }
  imageUrl.value = '';
  emit('update:modelValue', '');
}
</script>

<style scoped>
.single-image-upload {
  width: 100%;
  max-width: 300px;
}
.preview {
  position: relative;
  display: inline-block;
}
.preview img {
  width: 100%;
  border-radius: var(--radius);
  border: 1px solid var(--border);
}
.remove-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #f44;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.upload-area {
  border: 2px dashed var(--border);
  border-radius: var(--radius);
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.2s;
}
.upload-area:hover {
  border-color: var(--accent);
}
.upload-placeholder span {
  color: var(--text-muted);
  font-size: 14px;
}
.uploading {
  margin-top: 8px;
  font-size: 12px;
  color: var(--text-muted);
}
</style>