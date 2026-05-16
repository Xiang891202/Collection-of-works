<template>
  <div class="dynamic-list">
    <div v-for="(_item, idx) in modelValue" :key="idx" class="list-item">
      <input v-model="modelValue[idx]" class="list-input" />
      <button type="button" @click="remove(idx)" class="remove-btn">刪除</button>
    </div>
    <button type="button" @click="add" class="add-btn">新增項目</button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{ modelValue: string[] }>();
const emit = defineEmits(['update:modelValue']);
const modelValue = ref(props.modelValue);
watch(modelValue, (val: string[]) => emit('update:modelValue', val), { deep: true });

function add() { modelValue.value.push(''); }
function remove(idx: number) { modelValue.value.splice(idx, 1); }
</script>

<style scoped>
.dynamic-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.list-item {
  display: flex;
  gap: 8px;
  align-items: center;
}
.list-input {
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