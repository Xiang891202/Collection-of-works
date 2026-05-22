// composables/useProjectDetail.ts
import { useProjectState } from './useProjectState';
import { useProjectCache } from './useProjectCache';
import { useProjectRequest } from './useProjectRequest';
import { useProjectDebounce } from './useProjectDebounce';
import { useBackendRetry } from './useBackendRetry';
import type { ShowcaseDTO, ProfessionalDTO } from '../types/dto';
import { currentMode } from './globalState';

export { currentMode };

export function useProjectDetail() {
  const state = useProjectState();
  const cache = useProjectCache();
  const request = useProjectRequest();
  const debouncer = useProjectDebounce(300);
  const retry = useBackendRetry({ maxRetries: 3, retryDelay: 10 });

  // 404 状态（专案不存在）
  let projectNotFound = false;
  let notFoundMessage = '';

  // 核心请求函数，返回 { success, errorType }
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
      // 处理 404 专案不存在
      if (err.response?.status === 404) {
        projectNotFound = true;
        notFoundMessage = '資料遺失… 該專案可能已被管理員下架或不存在。';
        return { success: false, errorType: 'api' };
      }
      // 判断是否为冷启动（网络错误、连接拒绝、503）
      const isColdStart =
        err.message?.includes('Network Error') ||
        err.code === 'ECONNABORTED' ||
        err.response?.status === 503;
      if (isColdStart) {
        return { success: false, errorType: 'cold' };
      }
      // 其他错误（如 500、格式错误等）
      return { success: false, errorType: 'api' };
    }
  };

  const loadProject = async (slug: string, forceRefresh = false) => {
    if (state.isLoading.value || retry.isRetrying.value) return;

    state.isLoading.value = true;
    state.showCaseStudy.value = false;
    projectNotFound = false;

    const mode = state.currentMode.value;

    // 缓存读取
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

    // 第一次请求
    const firstResult = await performFetch(slug, mode);
    state.isLoading.value = false;

    if (firstResult.success) {
      // 成功，无事发生
      return;
    }

    // 如果是冷启动错误，开始重试
    if (firstResult.errorType === 'cold') {
      retry.startRetry(async () => {
        state.isLoading.value = true;
        const result = await performFetch(slug, mode);
        state.isLoading.value = false;
        return result;
      });
    } else {
      // 非冷启动错误（包括 404、接口异常），直接显示错误，不重试
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
    debouncer.debounce(() => loadProject(slug));
  };

  const forceReload = (slug: string) => {
    retry.reset();
    loadProject(slug, true);
  };

  // 提供给模板的错误信息（优先显示重试过程的错误，再显示 404）
  const detailError = () => {
    if (projectNotFound) return notFoundMessage;
    if (retry.errorMessage.value) return retry.errorMessage.value;
    return null;
  };

  return {
    // 状态
    ...state,
    // 方法
    loadProject,
    openCaseStudy,
    closeCaseStudy,
    switchMode,
    forceReload,
    // 重试相关
    isRetrying: retry.isRetrying,
    countdown: retry.countdown,
    retryCount: retry.retryCount,
    maxRetry: retry.maxRetries,
    detailError,
    manualRetry: () => forceReload((window as any).__currentSlug || ''),
    // 清理
    cleanup: () => {
      request.cancelPending();
      debouncer.cancel();
      retry.stopRetry();
    },
  };
}