// composables/useProjectList.ts
import { ref, computed } from 'vue';
import { fetchProjectList } from '../api/index.api';
import { useBackendRetry } from './useBackendRetry';

export function useProjectList() {
  const projects = ref<any[]>([]);
  const isLoading = ref(false);
  const genericError = ref<string | null>(null);
  const retry = useBackendRetry({ maxRetries: 3, retryDelay: 10 });

  const performFetch = async (): Promise<{ success: boolean; errorType?: 'cold' | 'api' }> => {
    try {
      const res = await fetchProjectList();
      projects.value = res.data.data || [];
      genericError.value = null;
      return { success: true };
    } catch (err: any) {
      const isColdStart =
        err.message?.includes('Network Error') ||
        err.code === 'ECONNABORTED' ||
        err.response?.status === 503;
      if (isColdStart) {
        return { success: false, errorType: 'cold' };
      }
      genericError.value = err.message || '後端與前端接口異常';
      return { success: false, errorType: 'api' };
    }
  };

  const load = async () => {
    if (retry.isRetrying.value) return;
    retry.reset();
    isLoading.value = true;
    genericError.value = null;

    const result = await performFetch();
    isLoading.value = false;

    if (!result.success && result.errorType === 'cold') {
      retry.startRetry(async () => {
        isLoading.value = true;
        const res = await performFetch();
        isLoading.value = false;
        return res;
      });
    } else if (!result.success) {
      // 非冷启动错误，直接显示
      if (!genericError.value) {
        retry.setError('❌ 後端與前端接口異常，請稍後再試');
      }
    }
  };

  const manualRetry = () => {
    retry.stopRetry();
    retry.reset();
    load();
  };

  // 关键：使用 computed 确保错误信息响应式更新
  const error = computed(() => retry.errorMessage.value || genericError.value);

  return {
    projects,
    isLoading,
    isRetrying: retry.isRetrying,
    countdown: retry.countdown,
    retryCount: retry.retryCount,
    maxRetry: retry.maxRetries,
    error,          // 现在是 computed ref
    load,
    manualRetry,
    cleanup: retry.stopRetry,
  };
}