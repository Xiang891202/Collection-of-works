<template>
  <div class="link-list">
    <div v-for="(item, idx) in modelValue" :key="idx" class="link-item">
      <input v-model="item.label" placeholder="標籤" />
      <input v-model="item.url" placeholder="網址" />
      <button @click="remove(idx)">刪除</button>
    </div>
    <button @click="add">新增連結</button>
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