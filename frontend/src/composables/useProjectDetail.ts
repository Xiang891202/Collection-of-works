import { ref, computed } from 'vue';
import {
  fetchShowcase,
  fetchProfessionalSummary,
  fetchProfessional,
  fetchCaseStudyPreview,
  fetchCaseStudy,
} from '../api/index.api';
import type {
  ShowcaseDTO,
  ProfessionalSummaryDTO,
  ProfessionalDTO,
  CaseStudyPreviewDTO,
  CaseStudyDTO,
} from '../types/dto';

// 全域 mode
export const currentMode = ref<'showcase' | 'professional'>('showcase');

// 快取
const showcaseData = ref<ShowcaseDTO | null>(null);
const professionalSummary = ref<ProfessionalSummaryDTO | null>(null);
const professionalData = ref<ProfessionalDTO | null>(null);
const caseStudyPreview = ref<CaseStudyPreviewDTO | null>(null);
const caseStudyData = ref<CaseStudyDTO | null>(null);

// 工程紀錄開關
const showCaseStudy = ref(false);

// Loading
const isLoading = ref(false);
const isCaseStudyLoading = ref(false);

// 防抖 + 請求取消
let debounceTimer: ReturnType<typeof setTimeout> | null = null;
let abortController: AbortController | null = null;
const DEBOUNCE_DELAY = 300;

function cancelPending() {
  if (abortController) {
    abortController.abort();
    abortController = null;
  }
}

function debounce(fn: () => void) {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(fn, DEBOUNCE_DELAY);
}

// 當前顯示資料
const currentData = computed<any>(() => {
  if (showCaseStudy.value) {
    return caseStudyData.value ?? caseStudyPreview.value;
  }
  return currentMode.value === 'showcase'
    ? showcaseData.value
    : professionalData.value;
});

// 載入專案
async function loadProject(slug: string) {
  cancelPending();
  showCaseStudy.value = false;

  const cacheKey = `project_${slug}_${currentMode.value}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    try {
      const data = JSON.parse(cached);
      if (currentMode.value === 'showcase') showcaseData.value = data;
      else professionalData.value = data;
    } catch (e) {}
  } else {
    isLoading.value = true;
  }

  try {
    const res = currentMode.value === 'showcase' ? await fetchShowcase(slug) : await fetchProfessional(slug);
    const data = res.data.data;
    if (currentMode.value === 'showcase') showcaseData.value = data as ShowcaseDTO;
    else professionalData.value = data as ProfessionalDTO;
    localStorage.setItem(cacheKey, JSON.stringify(data));
  } catch (err) {
    /* ... */
  } finally {
    isLoading.value = false;
  }
}

// 背景預載
async function preloadProfessionalSummary(slug: string) {
  try {
    const res = await fetchProfessionalSummary(slug);
    professionalSummary.value = res.data.data;
  } catch { /* silent */ }
}

async function preloadCaseStudyPreview(slug: string) {
  try {
    const res = await fetchCaseStudyPreview(slug);
    caseStudyPreview.value = res.data.data;
  } catch { /* silent */ }
}

// 切換模式
export function switchMode(mode: 'showcase' | 'professional', slug: string) {
  cancelPending();
  currentMode.value = mode;
  showCaseStudy.value = false;

  debounce(async () => {
    const cached = mode === 'showcase' ? showcaseData.value : professionalData.value;
    if (cached) return;

    isLoading.value = true;
    try {
      if (mode === 'showcase') {
        const res = await fetchShowcase(slug);
        showcaseData.value = res.data.data;
        preloadProfessionalSummary(slug);
      } else {
        const res = await fetchProfessional(slug);
        professionalData.value = res.data.data;
        preloadCaseStudyPreview(slug);
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') console.error(err);
    } finally {
      isLoading.value = false;
    }
  });
}

// 打開工程紀錄（必須在 useProjectDetail 中被返回）
function openCaseStudy(slug: string) {
  cancelPending();
  showCaseStudy.value = true;

  if (caseStudyData.value) return;

  debounce(async () => {
    isCaseStudyLoading.value = true;
    try {
      const res = await fetchCaseStudy(slug);
      caseStudyData.value = res.data.data;
    } catch (err: any) {
      if (err.name !== 'AbortError') console.error(err);
    } finally {
      isCaseStudyLoading.value = false;
    }
  });
}

function closeCaseStudy() {
  showCaseStudy.value = false;
  currentMode.value = 'professional';
}

function cleanup() {
  cancelPending();
  if (debounceTimer) clearTimeout(debounceTimer);
}

export function parseDemoUrl(demoUrl: string | { user?: string; admin?: string } | null): { user: string | undefined; admin: string | undefined } {
  if (!demoUrl) return { user: undefined, admin: undefined };
  if (typeof demoUrl === 'object') {
    return { user: demoUrl.user || undefined, admin: demoUrl.admin || undefined };
  }
  return { user: demoUrl, admin: undefined };
}

// ✅ 重要：確保所有需要的方法都被返回
export function useProjectDetail() {
  return {
    currentMode,
    showcaseData,
    professionalSummary,
    professionalData,
    caseStudyPreview,
    caseStudyData,
    showCaseStudy,
    isLoading,
    isCaseStudyLoading,
    currentData,
    loadProject,
    openCaseStudy,      // ✅ 必須包含
    closeCaseStudy,     // ✅ 必須包含
    cleanup,
    parseDemoUrl,
  };
}