<template>
  <div>
    <!-- 后端冷启动重试中 -->
    <div v-if="isRetrying" class="cold-start-message">
      <p>🚀 後端啟動中…</p>
      <p>{{ countdown }} 秒後自動重新載入</p>
      <p class="retry-hint">已嘗試 {{ retryCount }} / {{ maxRetry }}</p>
      <button @click="() => forceReload(route.params.slug as string)" class="retry-btn">立即重試</button>
    </div>
    
    <!-- 专案不存在或其他错误 -->
    <div v-else-if="detailError" class="error">
      <p>{{ detailError }}</p>
      <button @click="() => router.push('/projects')" class="retry-btn">返回專案列表</button>
    </div>

    <!-- 一般載入中 -->
    <div v-else-if="isLoading" class="loading">載入中...</div>

    <!-- 正常内容 -->
    <ShowcaseDetail
      v-else-if="currentMode === 'showcase' && showcaseData"
      :data="showcaseData"
      @open-lightbox="openImageViewer"
    />
    
    <ProfessionalDetail
      v-else-if="currentMode === 'professional' && !showCaseStudy && professionalData"
      :data="professionalData"
      @open-image="openSingleImage"
      @open-case-study="openCaseStudy(route.params.slug as string)"
    />
    
    <CaseStudyDetail
      v-else-if="showCaseStudy && caseStudyData"
      :data="caseStudyData"
      @close="closeCaseStudy"
      @open-diagrams="openImageViewer"
    />
    
    <ImageViewer
      v-if="viewerVisible"
      :key="viewerKey"
      :images="viewerImages"
      :start-index="viewerStartIndex"
      :zoom-enabled="viewerZoomEnabled"
      :loop="viewerLoop"
      @close="viewerVisible = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProjectDetail } from '../composables/useProjectDetail';
import ShowcaseDetail from './admin/components/ShowcaseDetail.vue';
import ProfessionalDetail from './admin/components/ProfessionalDetail.vue';
import CaseStudyDetail from './admin/components/CaseStudyDetail.vue';
import ImageViewer from '../components/common/ImageViewer.vue';

const route = useRoute();
const router = useRouter();
const {
  currentMode,
  showcaseData,
  professionalData,
  caseStudyData,
  showCaseStudy,
  isLoading,
  isRetrying,        // 新增
  countdown,         // 新增
  retryCount,        // 新增
  maxRetry,          // 新增
  detailError,       // 新增
  loadProject,
  openCaseStudy,
  closeCaseStudy,
  forceReload,
  cleanup,
} = useProjectDetail();

const viewerVisible = ref(false);
const viewerImages = ref<{ src: string }[]>([]);
const viewerStartIndex = ref(0);
const viewerZoomEnabled = ref(true);
const viewerLoop = ref(true);
const viewerKey = ref(0);

function openImageViewer(images: string[], index: number, zoomEnabled = true, loop = true) {
  viewerImages.value = images.map(src => ({ src }));
  viewerStartIndex.value = index;
  viewerZoomEnabled.value = zoomEnabled;
  viewerLoop.value = loop;
  viewerKey.value++;
  viewerVisible.value = true;
}

function openSingleImage(url: string) {
  openImageViewer([url], 0, true, false);
}

// function openCaseStudyFromProfessional() {
//   const slug = route.params.slug as string;
//   if (slug) {
//     openCaseStudy(slug);
//   }
// }

onMounted(() => {
  const slug = route.params.slug as string;
  if (slug) {
    loadProject(slug);
  }
});

onUnmounted(() => {
  cleanup();
});
</script>

<style scoped>
.loading {
  text-align: center;
  padding: 60px;
  font-size: 1.2rem;
  color: var(--text-muted);
}

.cold-start-message {
  text-align: center;
  padding: 60px 20px;
  background: var(--surface);
  border-radius: var(--radius);
  max-width: 400px;
  margin: 40px auto;
}
.retry-hint {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-top: 8px;
}
.retry-btn {
  margin-top: 16px;
  background: var(--accent);
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 20px;
  cursor: pointer;
}
.error {
  text-align: center;
  padding: 60px 20px;
  color: #f66;
}
</style>