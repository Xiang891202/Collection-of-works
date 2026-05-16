<template>
  <div class="image-manager">
    <div v-if="value.length" class="preview-carousel">
      <button @click="prev" :disabled="value.length <= 1">‹</button>
      <img :src="value[currentIndex]" class="preview-img" />
      <button @click="next" :disabled="value.length <= 1">›</button>
    </div>
    <div class="upload-area">
      <input type="file" multiple accept="image/*" @change="upload" ref="fileInput" style="display:none" />
      <button @click="triggerUpload">上傳圖片</button>
    </div>
    <div class="thumb-list">
      <div v-for="(url, idx) in value" :key="idx" class="thumb-item" :class="{ active: idx === currentIndex }" @click="currentIndex = idx">
        <img :src="url" />
        <button @click.stop="remove(idx)">✕</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { uploadImage } from '../api/index.api';   // 修正：從 src/api 導入

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

function remove(idx: number) {
  value.value.splice(idx, 1);
  if (currentIndex.value >= value.value.length) currentIndex.value = Math.max(0, value.value.length - 1);
}
</script>

<style scoped>
.image-manager { border: 1px solid var(--border); padding: 16px; border-radius: 8px; }
.preview-carousel { display: flex; align-items: center; gap: 8px; margin-bottom: 16px; }
.preview-img { max-height: 200px; object-fit: contain; }
.thumb-list { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 12px; }
.thumb-item { position: relative; width: 80px; cursor: pointer; border: 2px solid transparent; }
.thumb-item.active { border-color: var(--accent); }
.thumb-item img { width: 100%; height: 60px; object-fit: cover; border-radius: 4px; }
.thumb-item button { position: absolute; top: -8px; right: -8px; background: red; border-radius: 50%; width: 20px; height: 20px; font-size: 12px; }
</style>