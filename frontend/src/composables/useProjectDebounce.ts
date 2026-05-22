// composables/useProjectDebounce.ts
import { ref } from 'vue';

export function useProjectDebounce(delay = 300) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  const isPending = ref(false);

  const debounce = (fn: () => void) => {
    if (timer) clearTimeout(timer);
    isPending.value = true;
    timer = setTimeout(() => {
      fn();
      timer = null;
      isPending.value = false;
    }, delay);
  };

  const cancel = () => {
    if (timer) clearTimeout(timer);
    timer = null;
    isPending.value = false;
  };

  return { debounce, cancel, isPending };
}