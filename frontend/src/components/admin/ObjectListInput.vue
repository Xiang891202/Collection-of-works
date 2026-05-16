<template>
  <div class="object-list">
    <div v-for="(item, idx) in modelValue" :key="idx" class="object-item">
      <div v-for="field in fields" :key="field.key" class="field">
        <label>{{ field.label }}</label>
        <textarea v-if="field.type === 'textarea'" v-model="item[field.key]" rows="2" class="field-input"></textarea>
        <input v-else v-model="item[field.key]" class="field-input" />
      </div>
      <button type="button" @click="remove(idx)" class="remove-btn">刪除</button>
    </div>
    <button type="button" @click="add" class="add-btn">新增項目</button>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  modelValue: any[];
  fields: { key: string; label: string; type?: string }[];
}>();
const emit = defineEmits(['update:modelValue']);
const modelValue = ref(props.modelValue);
watch(modelValue, (val: any[]) => emit('update:modelValue', val), { deep: true });

function add() {
  const newItem: any = {};
  props.fields.forEach(f => { newItem[f.key] = ''; });
  modelValue.value.push(newItem);
}
function remove(idx: number) { modelValue.value.splice(idx, 1); }
</script>

<style scoped>
.object-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.object-item {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 16px;
  position: relative;
}
.field {
  margin-bottom: 12px;
}
.field label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 4px;
  color: var(--text-muted);
}
.field-input {
  width: 100%;
  padding: 8px 10px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--text);
}
.remove-btn {
  margin-top: 8px;
  background: #e44;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
}
.add-btn {
  background: var(--accent);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  align-self: flex-start;
}
</style>