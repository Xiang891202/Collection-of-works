import { ref } from 'vue';
import { fetchProjectList } from '../api/index.api';
import type { ProjectCardDTO } from '../types/dto';

export function useProjectList() {
  const projects = ref<ProjectCardDTO[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  async function load() {
    isLoading.value = true;
    error.value = null;
    try {
      const res = await fetchProjectList();
      projects.value = res.data.data || [];
    } catch (err: any) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  }

  return { projects, isLoading, error, load };
}