<template>
  <div class="link-list">
    <div v-for="(item, idx) in modelValue" :key="idx" class="link-item">
      <input v-model="item.label" placeholder="標籤" class="link-input" />
      <input v-model="item.url" placeholder="網址" class="link-input" />
      <button type="button" @click="remove(idx)" class="remove-btn">刪除</button>
    </div>
    <button type="button" @click="add" class="add-btn">新增連結</button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{ modelValue: { label: string; url: string }[] }>();
const emit = defineEmits(['update:modelValue']);
const modelValue = ref(props.modelValue);
watch(modelValue, (val: { label: string; url: string }[]) => emit('update:modelValue', val), { deep: true });

function add() { modelValue.value.push({ label: '', url: '' }); }
function remove(idx: number) { modelValue.value.splice(idx, 1); }
</script>

<style scoped>
.link-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.link-item {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}
.link-input {
  flex: 1;
  padding: 8px 10px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--text);
}
.remove-btn, .add-btn {
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  border: none;
}
.remove-btn {
  background: #e44;
  color: white;
}
.add-btn {
  background: var(--accent);
  color: white;
}
</style>