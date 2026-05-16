<template>
  <div class="object-list">
    <div v-for="(item, idx) in modelValue" :key="idx" class="object-item">
      <div v-for="field in fields" :key="field.key" class="field">
        <label>{{ field.label }}</label>
        <textarea v-if="field.type === 'textarea'" v-model="item[field.key]" rows="2"></textarea>
        <input v-else v-model="item[field.key]" />
      </div>
      <button @click="remove(idx)">刪除</button>
    </div>
    <button @click="add">新增項目</button>
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