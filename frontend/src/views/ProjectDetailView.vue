<template>
  <div>
    <div v-if="isLoading" class="loading">載入中...</div>

    <ShowcaseDetail
      v-else-if="currentMode === 'showcase' && showcaseData"
      :data="showcaseData"
      @open-lightbox="openImageViewer"
    />

    <ProfessionalDetail
      v-else-if="currentMode === 'professional' && !showCaseStudy && professionalData"
      :data="professionalData"
      @open-image="openSingleImage"
      @open-case-study="openCaseStudyFromProfessional"
    />

    <CaseStudyDetail
      v-else-if="showCaseStudy && caseStudyData"
      :data="caseStudyData"
      @close="closeCaseStudy"
      @open-diagrams="openImageViewer"
    />

    <!-- 圖片檢視器 -->
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
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useProjectDetail } from '../composables/useProjectDetail';
import ShowcaseDetail from './admin/components/ShowcaseDetail.vue';
import ProfessionalDetail from './admin/components/ProfessionalDetail.vue';
import CaseStudyDetail from './admin/components/CaseStudyDetail.vue';
import ImageViewer from '../components/common/ImageViewer.vue';

const route = useRoute();
const {
  currentMode,
  showcaseData,
  professionalData,
  caseStudyData,
  showCaseStudy,
  isLoading,
  loadProject,
  openCaseStudy,
  closeCaseStudy,
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

function openCaseStudyFromProfessional() {
  const slug = route.params.slug as string;
  if (slug) {
    openCaseStudy(slug);
  }
}

onMounted(() => {
  const slug = route.params.slug as string;
  if (slug) {
    loadProject(slug);
  }
});
</script>

<style scoped>
.loading {
  text-align: center;
  padding: 60px;
  font-size: 1.2rem;
  color: var(--text-muted);
}
</style>