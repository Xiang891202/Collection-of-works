// composables/globalState.ts
import { ref } from 'vue';

export const currentMode = ref<'showcase' | 'professional'>('showcase');