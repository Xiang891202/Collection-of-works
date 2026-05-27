<template>
  <div class="project-detail-container">
    <!-- 后端冷启动重试中 (維持最高優先，因為這算全頁錯誤) -->
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

    <!-- 正常内容 (注意：這裡改用 v-else 配合裡面的 v-if) -->
    <div v-else class="content-wrapper">
      
      <!-- 🔥 一般載入中：改成獨立遮罩，不破壞下方組件的生命週期 -->
      <div v-if="isLoading" class="loading-overlay">載入中...</div>

      <!-- 2. 傳遞自訂事件給子組件 -->
      <ShowcaseDetail
        v-if="currentMode === 'showcase' && showcaseData"
        :data="showcaseData"
        @open-lightbox="openImageViewer"
        @switch-mode="switchMode" 
      />

      <ProfessionalDetail
        v-else-if="currentMode === 'professional' && !showCaseStudy && professionalData"
        :data="professionalData"
        @open-image="openSingleImage"
        @open-case-study="openCaseStudy(route.params.slug as string)"
        @switch-mode="switchMode" 
      />

      
      <CaseStudyDetail
        v-else-if="showCaseStudy && caseStudyData"
        :data="caseStudyData"
        @close="closeCaseStudy"
        @open-diagrams="openImageViewer"
      />
    </div>
    
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
import { ref, watch, onUnmounted } from 'vue'; // 🔥 導入 watch，移除已不需要的 onMounted
import { useRoute, useRouter } from 'vue-router';
import { useProjectDetail } from '../composables/useProjectDetail';
import ShowcaseDetail from '../views/project-detail/ShowcaseDetail.vue';
import ProfessionalDetail from '../views/project-detail/ProfessionalDetail.vue';
import CaseStudyDetail from '../views/project-detail/CaseStudyDetail.vue';
import ImageViewer from '../components/common/ImageViewer.vue';
import { currentMode } from '../composables/globalState';

const route = useRoute();
const router = useRouter();
const {
  showcaseData,
  professionalData,
  caseStudyData,
  showCaseStudy,
  isLoading,
  isRetrying,        
  countdown,         
  retryCount,        
  maxRetry,          
  detailError,       
  loadProject,
  openCaseStudy,
  closeCaseStudy,
  forceReload,
  cleanup,
} = useProjectDetail();

// 🔥 核心修正：實作真正的 URL 控制流
// 只要接管了 URL 變化，就不需要呼叫 switchMode 函數了
const switchMode = (mode: 'showcase' | 'professional') => {
  router.push({
    query: { ...route.query, mode: mode } // 點擊按鈕時，唯一做的事情就是改變網址的 query
  });
};

// 🔥 核心關鍵：利用 watch 達成單一事實來源 (Source of Truth)
watch(
  () => [route.params.slug, route.query.mode],
  ([newSlug, newMode]) => {
    if (!newSlug) return;

    const targetMode = newMode === 'professional' ? 'professional' : 'showcase';
    currentMode.value = targetMode;

    // 🔥 關鍵修正：將明確的模式傳入 loadProject，徹底斬斷因快取或插件干擾導致的空白
    loadProject(newSlug as string, false, targetMode);
  },
  { immediate: true }
);


// --- 燈箱與圖片檢視邏輯保持不變 ---
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

onUnmounted(() => {
  cleanup();
});
</script>


<style scoped>
/* 容器加上相對定位 */
.project-detail-container {
  position: relative;
  min-height: 400px;
}

.content-wrapper {
  position: relative;
}

/* 🔥 新增：絕對定位的載入遮罩 */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.7); /* 半透明白底，可依據深色模式調整 */
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
  color: var(--text-muted);
  z-index: 10; /* 確保蓋在內容上方 */
}

/* 原有的樣式保留 */
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