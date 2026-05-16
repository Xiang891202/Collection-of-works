<template>
  <div class="dynamic-list">
    <div v-for="(_item, idx) in modelValue" :key="idx" class="list-item">
      <input v-model="modelValue[idx]" @input="update" />
      <button @click="remove(idx)">刪除</button>
    </div>
    <button @click="add">新增項目</button>
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
function update() { emit('update:modelValue', modelValue.value); }
</script>