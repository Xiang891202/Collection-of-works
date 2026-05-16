<template>
  <div>
    <h1>{{ isNew ? '新增專案' : '編輯專案' }}</h1>
    <div class="tabs">
      <button @click="tab = 'meta'">主表</button>
      <button @click="tab = 'showcase'">展示版</button>
      <button @click="tab = 'professional'">專業版</button>
      <button @click="tab = 'casestudy'">工程紀錄</button>
    </div>

    <!-- 主表編輯 -->
    <button @click="router.push('/admin/dashboard')">返回列表</button>
    <div v-if="tab === 'meta'">
      <form @submit.prevent="saveMeta">
        <!-- <input v-model="form.slug" placeholder="Slug" required /> -->
        <input v-model="form.title" placeholder="標題" required />
        <select v-model="form.tag"><option>商業專案</option><option>練習專案</option></select>
        <input v-model="form.thumbnail_url" placeholder="Thumbnail URL" />
        <textarea v-model="form.one_liner" placeholder="一句話描述"></textarea>
        <input v-model="form.demo_url" placeholder="Demo URL (可為 JSON)" />
        <input v-model="form.github_url" placeholder="GitHub URL" />
        <button type="submit">{{ isNew ? '建立' : '更新' }}</button>
      </form>
    </div>

    <!-- 展示版內容編輯 -->
    <div v-if="tab === 'showcase'">
    <label>系統定義</label>
    <textarea v-model="content.showcaseSystemDefinition" rows="2"></textarea>

    <label>解決的問題</label>
    <textarea v-model="content.showcaseProblem" rows="4"></textarea>

    <label>如何解決</label>
    <textarea v-model="content.showcaseSolution" rows="4"></textarea>

    <label>帶來的改變</label>
    <textarea v-model="content.showcaseImpact" rows="4"></textarea>

    <label>延伸應用（JSON 陣列）</label>
    <textarea v-model="content.showcaseExtendedApplications" rows="4"></textarea>

    <!-- <label>圖片（JSON 陣列）</label>
    <textarea v-model="content.showcaseImages" rows="4"></textarea> -->

    <!-- 展示版圖片管理 -->
    <div class="image-manager" v-if="!isNew">
    <h4>圖片管理</h4>

    <!-- 輪播預覽區 -->
    <div v-if="showcaseImageList.length" class="preview-carousel">
        <button @click="prevPreviewImage" class="carousel-btn" :disabled="showcaseImageList.length <= 1">‹</button>
        <img :src="showcaseImageList[currentPreviewIndex]" class="preview-main-img" />
        <button @click="nextPreviewImage" class="carousel-btn" :disabled="showcaseImageList.length <= 1">›</button>
    </div>

    <!-- 上傳按鈕 -->
    <div class="image-upload-row">
        <input
        type="file"
        accept="image/*"
        multiple
        @change="handleShowcaseUpload"
        ref="showcaseFileInputRef"
        style="display: none"
        />
        <button @click="triggerShowcaseUpload" class="small-btn">選擇並上傳圖片</button>
    </div>

    <!-- 縮圖列表（可點選切換輪播圖） -->
    <div v-if="showcaseImageList.length" class="image-preview-list">
        <div
        v-for="(url, idx) in showcaseImageList"
        :key="idx"
        class="image-preview-item"
        :class="{ active: idx === currentPreviewIndex }"
        @click="currentPreviewIndex = Number(idx)"
        >
        <img :src="url" class="preview-thumb" />
        <button @click.stop="removeShowcaseImage(Number(idx))" class="remove-btn">✕</button>
        </div>
    </div>
    <p v-else>尚無圖片</p>
    </div>
    <p v-else class="text-muted">請先建立專案後再上傳圖片</p>

    <button @click="saveContent('showcase')">儲存展示版</button>
    </div>

    <!-- 專業版內容編輯 -->
    <div v-if="tab === 'professional'">
    <label>系統目標</label>
    <textarea v-model="content.professionalSystemGoal" rows="2"></textarea>

    <label>資料流</label>
    <textarea v-model="content.professionalDataFlow" rows="3"></textarea>

    <label>技術棧 - Frontend（逗號分隔）</label>
    <input v-model="content.professionalTechFrontend" />

    <label>技術棧 - Backend（逗號分隔）</label>
    <input v-model="content.professionalTechBackend" />

    <label>技術棧 - Storage（逗號分隔）</label>
    <input v-model="content.professionalTechStorage" />

    <label>核心流程（JSON 陣列）</label>
    <textarea v-model="content.professionalKeyProcesses" rows="3"></textarea>

    <label>核心問題（JSON 陣列）</label>
    <textarea v-model="content.professionalCoreProblems" rows="6"></textarea>

    <label>設計決策（JSON 陣列）</label>
    <textarea v-model="content.professionalDesignDecisions" rows="6"></textarea>

    <label>Trade-off（JSON 陣列）</label>
    <textarea v-model="content.professionalTradeOffs" rows="6"></textarea>

    <h3>影響分析</h3>
    <label>可擴展性</label>
    <textarea v-model="content.professionalImpactScalability" rows="2"></textarea>
    <label>可維護性</label>
    <textarea v-model="content.professionalImpactMaintainability" rows="2"></textarea>
    <label>可靠性</label>
    <textarea v-model="content.professionalImpactReliability" rows="2"></textarea>
    <label>一致性</label>
    <textarea v-model="content.professionalImpactConsistency" rows="2"></textarea>
    <label>效能</label>
    <textarea v-model="content.professionalImpactPerformance" rows="2"></textarea>

    <label>未來演進（JSON 陣列）</label>
    <textarea v-model="content.professionalFutureEvolution" rows="3"></textarea>

    <label>面試問題（JSON 陣列）</label>
    <textarea v-model="content.professionalInterviewQuestions" rows="3"></textarea>

    <label>GitHub URL</label>
    <input v-model="content.professionalGitHubUrl" />

    <label>架構圖 URL</label>
    <input v-model="content.professionalArchitectureDiagram" />

    <button @click="saveContent('professional')">儲存專業版</button>
    </div>

    <!-- 工程紀錄內容編輯 -->
    <div v-if="tab === 'casestudy'">
      <textarea v-model="content.caseStudyText" placeholder="貼入完整 JSON" rows="20" />
      <button @click="saveContent('casestudy')">儲存工程紀錄</button>
    </div>

    <!-- 圖片上傳 -->
    <!-- <div class="upload-section">
      <h3>圖片上傳</h3>
      <input type="file" @change="handleUpload" />
      <p v-if="uploadedUrl">上傳成功：{{ uploadedUrl }}</p>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  fetchAdminProject,
  createProject,
  updateProjectMeta,
  updateShowcaseContent,
  updateProfessionalContent,
  updateCaseStudyContent,
  uploadImage,
} from '../../api/index.api';

const route = useRoute();
const router = useRouter();
const isNew = route.params.id === undefined;          // 修正處
const projectId = route.params.id as string;

const tab = ref('meta');
const form = ref({
  slug: '',
  title: '',
  tag: '練習專案',
  thumbnail_url: '',
  one_liner: '',
  demo_url: '',
  github_url: '',
});

const content = ref({
  showcaseSystemDefinition: '',
  showcaseProblem: '',
  showcaseSolution: '',
  showcaseImpact: '',
  showcaseExtendedApplications: '[]',
  showcaseImages: '[]',

  professionalSystemGoal: '',
  professionalDataFlow: '',
  professionalTechFrontend: '',
  professionalTechBackend: '',
  professionalTechStorage: '',
  professionalKeyProcesses: '[]',
  professionalCoreProblems: '[]',
  professionalDesignDecisions: '[]',
  professionalTradeOffs: '[]',
  professionalImpactScalability: '',
  professionalImpactMaintainability: '',
  professionalImpactReliability: '',
  professionalImpactConsistency: '',
  professionalImpactPerformance: '',
  professionalFutureEvolution: '[]',
  professionalInterviewQuestions: '[]',
  professionalGitHubUrl: '',
  professionalArchitectureDiagram: '',

  caseStudyText: '',
});

// const uploadedUrl = ref('');

onMounted(async () => {
  if (!isNew) {
    const res = await fetchAdminProject(projectId);
    const p = res.data.data!;
    // 修正處：補齊 form 賦值
    form.value = {
      slug: p.slug,
      title: p.title,
      tag: p.tag,
      thumbnail_url: p.thumbnail_url || '',
      one_liner: p.one_liner,
      demo_url: typeof p.showcase?.demoUrl === 'string' ? p.showcase.demoUrl : JSON.stringify(p.showcase?.demoUrl || ''),
      github_url: p.professional?.githubUrl || '',
    };

    // 展示版
    if (p.showcase) {
      const s = p.showcase;
      content.value.showcaseSystemDefinition = s.systemDefinition || '';
      content.value.showcaseProblem = s.problem || '';
      content.value.showcaseSolution = s.solution || '';
      content.value.showcaseImpact = s.impact || '';
      content.value.showcaseExtendedApplications = JSON.stringify(s.extendedApplications || [], null, 2);
      content.value.showcaseImages = JSON.stringify(s.images || [], null, 2);
    }

    // 專業版
    if (p.professional) {
      const pr = p.professional;
      content.value.professionalSystemGoal = pr.systemGoal || '';
      content.value.professionalDataFlow = pr.dataFlow || '';
      content.value.professionalTechFrontend = pr.techStack?.frontend?.join(', ') || '';
      content.value.professionalTechBackend = pr.techStack?.backend?.join(', ') || '';
      content.value.professionalTechStorage = pr.techStack?.storage?.join(', ') || '';
      content.value.professionalKeyProcesses = JSON.stringify(pr.keyProcesses || [], null, 2);
      content.value.professionalCoreProblems = JSON.stringify(pr.coreProblems || [], null, 2);
      content.value.professionalDesignDecisions = JSON.stringify(pr.designDecisions || [], null, 2);
      content.value.professionalTradeOffs = JSON.stringify(pr.tradeOffs || [], null, 2);
      content.value.professionalImpactScalability = pr.impactAnalysis?.scalability || '';
      content.value.professionalImpactMaintainability = pr.impactAnalysis?.maintainability || '';
      content.value.professionalImpactReliability = pr.impactAnalysis?.reliability || '';
      content.value.professionalImpactConsistency = pr.impactAnalysis?.consistency || '';
      content.value.professionalImpactPerformance = pr.impactAnalysis?.performance || '';
      content.value.professionalFutureEvolution = JSON.stringify(pr.futureEvolution || [], null, 2);
      content.value.professionalInterviewQuestions = JSON.stringify(pr.interviewQuestions || [], null, 2);
      content.value.professionalGitHubUrl = pr.githubUrl || '';
      content.value.professionalArchitectureDiagram = pr.architectureDiagram || '';
    }
  }
});

async function saveMeta() {
  if (isNew) {
    const res = await createProject(form.value);
    router.push(`/admin/projects/${res.data.data!.id}/edit`);
  } else {
    await updateProjectMeta(projectId, form.value);
    alert('更新成功');
  }
}

async function saveContent(type: string) {
  try {
    let json: any;
    if (type === 'showcase') {
      json = {
        systemDefinition: content.value.showcaseSystemDefinition,
        problem: content.value.showcaseProblem,
        solution: content.value.showcaseSolution,
        impact: content.value.showcaseImpact,
        extendedApplications: JSON.parse(content.value.showcaseExtendedApplications || '[]'),
        images: JSON.parse(content.value.showcaseImages || '[]'),
      };
      await updateShowcaseContent(projectId, json);
    } else if (type === 'professional') {
      json = {
        systemGoal: content.value.professionalSystemGoal,
        dataFlow: content.value.professionalDataFlow,
        techStack: {
          frontend: content.value.professionalTechFrontend.split(',').map((s) => s.trim()).filter(Boolean),
          backend: content.value.professionalTechBackend.split(',').map((s) => s.trim()).filter(Boolean),
          storage: content.value.professionalTechStorage.split(',').map((s) => s.trim()).filter(Boolean),
        },
        keyProcesses: JSON.parse(content.value.professionalKeyProcesses || '[]'),
        coreProblems: JSON.parse(content.value.professionalCoreProblems || '[]'),
        designDecisions: JSON.parse(content.value.professionalDesignDecisions || '[]'),
        tradeOffs: JSON.parse(content.value.professionalTradeOffs || '[]'),
        impactAnalysis: {
          scalability: content.value.professionalImpactScalability,
          maintainability: content.value.professionalImpactMaintainability,
          reliability: content.value.professionalImpactReliability,
          consistency: content.value.professionalImpactConsistency,
          performance: content.value.professionalImpactPerformance,
        },
        futureEvolution: JSON.parse(content.value.professionalFutureEvolution || '[]'),
        interviewQuestions: JSON.parse(content.value.professionalInterviewQuestions || '[]'),
        githubUrl: content.value.professionalGitHubUrl,
        architectureDiagram: content.value.professionalArchitectureDiagram || null,
      };
      await updateProfessionalContent(projectId, json);
    } else if (type === 'casestudy') {
      json = JSON.parse((content.value as any).caseStudyText || '{}');
      await updateCaseStudyContent(projectId, json);
    }
    alert('內容儲存成功');
  } catch (e) {
    alert('JSON 格式錯誤');
  }
}

// 展示版圖片操作
const showcaseImageList = computed({
  get: () => {
    try {
      return JSON.parse(content.value.showcaseImages || '[]');
    } catch {
      return [];
    }
  },
  set: (val) => {
    content.value.showcaseImages = JSON.stringify(val);
  },
});

// 輪播預覽索引
const currentPreviewIndex = ref(0);

function nextPreviewImage() {
  if (showcaseImageList.value.length > 0) {
    currentPreviewIndex.value = (currentPreviewIndex.value + 1) % showcaseImageList.value.length;
  }
}

function prevPreviewImage() {
  if (showcaseImageList.value.length > 0) {
    currentPreviewIndex.value =
      (currentPreviewIndex.value - 1 + showcaseImageList.value.length) % showcaseImageList.value.length;
  }
}

function addShowcaseImage(url: string) {
  const list = [...showcaseImageList.value];
  list.push(url);
  showcaseImageList.value = list;
}

function removeShowcaseImage(index: number) {
  const list = [...showcaseImageList.value];
  list.splice(index, 1);
  showcaseImageList.value = list;
  // 調整預覽索引
  if (currentPreviewIndex.value >= list.length) {
    currentPreviewIndex.value = Math.max(0, list.length - 1);
  }
}

// 修改圖片上傳邏輯
const showcaseFileInputRef = ref<HTMLInputElement | null>(null);

function triggerShowcaseUpload() {
  if (showcaseFileInputRef.value) {
    showcaseFileInputRef.value.click();
  }
}

async function handleShowcaseUpload(e: Event) {
  const input = e.target as HTMLInputElement;
  const files = input.files;
  if (!files || files.length === 0 || !projectId) return;

  for (const file of Array.from(files)) {
    try {
      const res = await uploadImage(projectId, file);
      const url = res.data.data!.url;
      addShowcaseImage(url);
    } catch (err) {
      alert(`圖片 ${file.name} 上傳失敗`);
    }
  }
  // 清空 input，允許重複選同一批檔案
  if (showcaseFileInputRef.value) {
    showcaseFileInputRef.value.value = '';
  }
}

// async function handleUpload(e: Event) {
//   const file = (e.target as HTMLInputElement).files?.[0];
//   if (!file || !projectId) return;
//   const res = await uploadImage(projectId, file);
//   uploadedUrl.value = res.data.data!.url;
// }
</script>

<style scoped>
form input, form select, form textarea { display: block; width: 100%; margin-bottom: 10px; padding: 8px; }
.tabs { display: flex; gap: 8px; margin-bottom: 20px; }
.upload-section { margin-top: 40px; }

form label { display: block; margin-top: 12px; font-weight: bold; }
form textarea { min-height: 80px; }
input, textarea { color: #fff; background: var(--bg); border: 1px solid var(--border); padding: 6px 8px; border-radius: 4px; }

/* 讓標籤與輸入框各自獨佔一行 */
label {
  display: block;
  margin-top: 16px;
  margin-bottom: 4px;
  font-weight: bold;
  color: var(--text);
}

input,
textarea,
select {
  display: block;
  width: 100%;
  padding: 8px 10px;
  color: #fff;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

textarea {
  min-height: 80px;
  resize: vertical;
}

button {
  margin-top: 16px;
}

.image-manager {
  margin-top: 24px;
  padding: 16px;
  background: var(--surface);
  border-radius: var(--radius);
}
.image-upload-row {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 12px;
}
.image-preview-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.image-preview-item {
  position: relative;
  width: 120px;
}
.preview-thumb {
  width: 100%;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid var(--border);
}
.remove-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #f44;
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  font-size: 14px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
}
.small-btn {
  padding: 4px 12px;
  font-size: 12px;
}

/* 輪播預覽 */
.preview-carousel {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 16px;
}
.preview-main-img {
  max-width: 100%;
  max-height: 300px;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  object-fit: contain;
}
.carousel-btn {
  background: var(--surface);
  color: #fff;
  font-size: 28px;
  border: none;
  cursor: pointer;
  padding: 0 10px;
  line-height: 1;
}
.carousel-btn:disabled {
  opacity: 0.3;
  cursor: default;
}

/* 縮圖選中狀態 */
.image-preview-item.active {
  outline: 2px solid var(--accent);
}
</style>