// composables/useProjectDetail.ts
import { computed } from 'vue';
import { useProjectState } from './useProjectState';
import { useProjectCache } from './useProjectCache';
import { useProjectRequest } from './useProjectRequest';
import { useProjectDebounce } from './useProjectDebounce';
import { useBackendRetry } from './useBackendRetry';
import type { ShowcaseDTO, ProfessionalDTO } from '../types/dto';
import { currentMode } from './globalState';

export { currentMode };

const debouncer = useProjectDebounce(300);

export function useProjectDetail() {
  const state = useProjectState();
  const cache = useProjectCache();
  const request = useProjectRequest();
  const retry = useBackendRetry({ maxRetries: 3, retryDelay: 10 });

  let projectNotFound = false;
  let notFoundMessage = '';

  // 🔥 修正一：顯式傳入 mode，不依賴外部全域狀態，避免非同步時間差
  const performFetch = async (
    slug: string,
    mode: 'showcase' | 'professional'
  ): Promise<{ success: boolean; errorType?: 'cold' | 'api' }> => {
    const fetchFn = mode === 'showcase' ? request.fetchShowcaseData : request.fetchProfessionalData;
    try {
      const data = await fetchFn(slug);
      
      if (mode === 'showcase') {
        state.showcaseData.value = data as ShowcaseDTO;
      } else {
        state.professionalData.value = data as ProfessionalDTO;
      }
      
      cache.setCache(slug, mode, data);
      projectNotFound = false;
      return { success: true };
    } catch (err: any) {
      console.error('⚠️ [performFetch 捕捉到錯誤，進行安全降級處理]:', err.message);
      
      if (err.response?.status === 404) {
        projectNotFound = true;
        notFoundMessage = '資料遺失… 該專案可能已被管理員下架或不存在。';
        return { success: false, errorType: 'api' };
      }
      
      const isColdStart =
        err.message?.includes('Network Error') ||
        err.code === 'ECONNABORTED' ||
        err.response?.status === 503;
        
      if (isColdStart) {
        return { success: false, errorType: 'cold' };
      }
      
      return { success: false, errorType: 'api' };
    }
  };

  // 🔥 修正二：允許傳入明確的 targetMode，解決 watch 重整時的死鎖問題
  const loadProject = async (slug: string, forceRefresh = false, targetMode?: 'showcase' | 'professional') => {
    if (state.isLoading.value || retry.isRetrying.value) return;

    state.isLoading.value = true;
    state.showCaseStudy.value = false;
    projectNotFound = false;

    // 如果有傳入 targetMode 就用它，否則才看全域狀態
    const mode = targetMode || state.currentMode.value as 'showcase' | 'professional';

    // 快取讀取
    if (!forceRefresh) {
      const cached = cache.getCached(slug, mode);
      if (cached) {
        if (mode === 'showcase') {
          state.showcaseData.value = cached as ShowcaseDTO;
        } else {
          state.professionalData.value = cached as ProfessionalDTO;
        }
        state.isLoading.value = false;
        return;
      }
    }

    // 第一次請求
    const firstResult = await performFetch(slug, mode);
    state.isLoading.value = false;

    if (firstResult.success) {
      return;
    }

    // 重試邏輯
    if (firstResult.errorType === 'cold') {
      retry.startRetry(async () => {
        state.isLoading.value = true;
        const result = await performFetch(slug, mode);
        state.isLoading.value = false;
        return result;
      });
    } else {
      if (projectNotFound) {
        retry.setError(notFoundMessage);
      } else {
        retry.setError('❌ 後端與前端接口異常，請稍後再試');
      }
    }
  };

  const openCaseStudy = async (slug: string) => {
    state.showCaseStudy.value = true;
    if (state.caseStudyData.value) return;
    state.isCaseStudyLoading.value = true;
    try {
      const data = await request.fetchCaseStudyData(slug);
      state.caseStudyData.value = data;
    } catch (err) {
      console.error(err);
    } finally {
      state.isCaseStudyLoading.value = false;
    }
  };

  const closeCaseStudy = () => {
    state.showCaseStudy.value = false;
    state.currentMode.value = 'professional';
  };

  const switchMode = (mode: 'showcase' | 'professional', slug: string) => {
    state.currentMode.value = mode;
    state.showCaseStudy.value = false;

    debouncer.debounce(() => {
      // 傳入明確的 mode，防止快取誤判
      loadProject(slug, false, mode); 
    });
  };

  const forceReload = (slug: string) => {
    retry.reset();
    loadProject(slug, true);
  };

  const detailError = computed(() => {
    if (projectNotFound) return notFoundMessage;
    if (retry.errorMessage.value) return retry.errorMessage.value;
    return null;
  });

  return {
    ...state,
    loadProject,
    openCaseStudy,
    closeCaseStudy,
    switchMode,
    forceReload,
    isRetrying: retry.isRetrying,
    countdown: retry.countdown,
    retryCount: retry.retryCount,
    maxRetry: retry.maxRetries,
    detailError,
    manualRetry: () => forceReload((window as any).__currentSlug || ''),
    cleanup: () => {
      request.cancelPending();
      debouncer.cancel();
      retry.stopRetry();
    },
  };
}
