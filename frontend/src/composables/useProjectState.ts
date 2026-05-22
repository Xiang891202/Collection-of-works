// composables/useProjectState.ts
import { ref, computed } from 'vue';
import type {
  ShowcaseDTO,
  ProfessionalSummaryDTO,
  ProfessionalDTO,
  CaseStudyPreviewDTO,
  CaseStudyDTO,
} from '../types/dto';
import { currentMode } from './globalState';  // 导入全局单例

export function useProjectState() {
  const showcaseData = ref<ShowcaseDTO | null>(null);
  const professionalSummary = ref<ProfessionalSummaryDTO | null>(null);
  const professionalData = ref<ProfessionalDTO | null>(null);
  const caseStudyPreview = ref<CaseStudyPreviewDTO | null>(null);
  const caseStudyData = ref<CaseStudyDTO | null>(null);
  const showCaseStudy = ref(false);
  const isLoading = ref(false);
  const isCaseStudyLoading = ref(false);
  // 不再定义 currentMode，直接使用全局的

  const currentData = computed(() => {
    if (showCaseStudy.value) return caseStudyData.value ?? caseStudyPreview.value;
    return currentMode.value === 'showcase' ? showcaseData.value : professionalData.value;
  });

  const hasData = computed(() => !!currentData.value);

  return {
    showcaseData,
    professionalSummary,
    professionalData,
    caseStudyPreview,
    caseStudyData,
    showCaseStudy,
    isLoading,
    isCaseStudyLoading,
    currentMode,          // 返回全局 currentMode
    currentData,
    hasData,
  };
}