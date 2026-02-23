import { ref } from 'vue'

export type Mode = 'showcase' | 'professional'

const mode = ref<Mode>('showcase')

export function useMode() {
  const toggleMode = () => {
    mode.value = mode.value === 'showcase' ? 'professional' : 'showcase'
  }

  return {
    mode,
    toggleMode,
  }
}