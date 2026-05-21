<template>
  <div class="case-study-editor">
    <h1>編輯工程紀錄</h1>
    <form @submit.prevent="save" class="case-study-form">
      <!-- 初始假設區塊 -->
      <div class="form-section">
        <h3>📐 初始假設</h3>
        <div class="form-group">
          <label>架構假設</label>
          <textarea v-model="form.initialAssumption.architecture" rows="2" class="form-control"></textarea>
        </div>
        <div class="form-group">
          <label>資料流假設</label>
          <textarea v-model="form.initialAssumption.dataFlow" rows="2" class="form-control"></textarea>
        </div>
        <div class="form-group">
          <label>限制假設</label>
          <textarea v-model="form.initialAssumption.limitations" rows="2" class="form-control"></textarea>
        </div>
      </div>

      <!-- 迭代目標 -->
      <div class="form-group">
        <label>🎯 迭代目標</label>
        <textarea v-model="form.iterationGoal" rows="3" class="form-control"></textarea>
      </div>

      <!-- 核心問題 -->
      <div class="form-group">
        <label>⚠️ 核心問題</label>
        <ObjectListInput
          :key="`coreProblems_${componentKey}`"
          v-model="form.coreProblems"
          :fields="coreProblemFields"
        />
      </div>

      <!-- 限制條件 -->
      <div class="form-group">
        <label>🔒 限制條件</label>
        <ObjectListInput
          :key="`constraints_${componentKey}`"
          v-model="form.constraints"
          :fields="constraintFields"
        />
      </div>

      <!-- 工程決策 -->
      <div class="form-group">
        <label>🔧 工程決策</label>
        <ObjectListInput
          :key="`engineeringDecisions_${componentKey}`"
          v-model="form.engineeringDecisions"
          :fields="engineeringDecisionFields"
        />
      </div>

      <!-- 技術影響 -->
      <div class="form-section">
        <h3>⚙️ 技術影響</h3>
        <div class="form-group">
          <label>可維護性</label>
          <textarea v-model="form.technicalImpact.maintainability" rows="2" class="form-control"></textarea>
        </div>
        <div class="form-group">
          <label>可擴展性</label>
          <textarea v-model="form.technicalImpact.scalability" rows="2" class="form-control"></textarea>
        </div>
        <div class="form-group">
          <label>可靠性</label>
          <textarea v-model="form.technicalImpact.reliability" rows="2" class="form-control"></textarea>
        </div>
        <div class="form-group">
          <label>效能</label>
          <textarea v-model="form.technicalImpact.performance" rows="2" class="form-control"></textarea>
        </div>
        <div class="form-group">
          <label>安全性</label>
          <textarea v-model="form.technicalImpact.security" rows="2" class="form-control"></textarea>
        </div>
      </div>

      <!-- Production 思維 -->
      <div class="form-group">
        <label>🏭 Production 思維</label>
        <ObjectListInput
          :key="`productionThinking_${componentKey}`"
          v-model="form.productionThinking"
          :fields="productionThinkingFields"
        />
      </div>

      <!-- 未來演進 -->
      <div class="form-group">
        <label>🔭 未來演進</label>
        <ObjectListInput
          :key="`futureEvolution_${componentKey}`"
          v-model="form.futureEvolution"
          :fields="futureEvolutionFields"
        />
      </div>

      <!-- 面試問題 -->
      <div class="form-group">
        <label>📌 面試問題</label>
        <DynamicListInput :key="`interviewQuestions_${componentKey}`" v-model="form.interviewQuestions" />
      </div>

      <!-- 架構圖（輪播多圖） -->
      <div class="form-group">
        <label>🖼 架構圖（輪播）</label>
        <ImageManager 
          :key="`diagramImages_${componentKey}`" 
          v-model="diagramImages" 
          v-model:newFiles="managerNewFiles"
          v-model:deletedUrls="managerDeletedUrls"
          :projectId="projectId" 
        />
      </div>


      <!-- 補充記錄區域 -->
      <div class="form-group">
        <label>📝 補充記錄</label>
        <ObjectListInput
          :key="`supplements_${componentKey}`"
          v-model="form.supplements"
          :fields="supplementFields"
        />
        <p class="hint">可記錄開發過程中的典型問題修復，訪客端只顯示「啟用」的項目。</p>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn-primary">儲存工程紀錄</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { fetchAdminProject, uploadImage, deleteImage, updateCaseStudyContent } from '../../../api/index.api';
import DynamicListInput from '../../../components/admin/DynamicListInput.vue';
import ObjectListInput from '../../../components/admin/ObjectListInput.vue';
import ImageManager from '../../../components/admin/ImageManager.vue';

// 補充記錄型別
interface Supplement {
  enabled: boolean;
  title: string;
  problem: string;
  rootCause: string;
  solution: string;
  prevention: string;
}

// 表單完整型別
interface CaseStudyForm {
  initialAssumption: {
    architecture: string;
    dataFlow: string;
    limitations: string;
  };
  iterationGoal: string;
  coreProblems: Array<{
    title: string;
    rootCause: string;
    solution: string;
    alternative: string;
  }>;
  constraints: Array<{
    constraint: string;
    reason: string;
  }>;
  engineeringDecisions: Array<{
    problem: string;
    decision: string;
    why: string;
  }>;
  technicalImpact: {
    maintainability: string;
    scalability: string;
    reliability: string;
    performance: string;
    security: string;
  };
  productionThinking: Array<{
    scenario: string;
    strategy: string;
  }>;
  futureEvolution: Array<{
    scale: string;
    approach: string;
  }>;
  interviewQuestions: string[];
  supplements: Supplement[];
}

const props = defineProps<{ projectId: string; disabled?: boolean }>();

const componentKey = ref(0);
const diagramImages = ref<string[]>([]);
const managerNewFiles = ref<{ file: File; localUrl: string }[]>([]);
const managerDeletedUrls = ref<string[]>([]);

const form = ref<CaseStudyForm>({
  initialAssumption: { architecture: '', dataFlow: '', limitations: '' },
  iterationGoal: '',
  coreProblems: [],
  constraints: [],
  engineeringDecisions: [],
  technicalImpact: { maintainability: '', scalability: '', reliability: '', performance: '', security: '' },
  productionThinking: [],
  futureEvolution: [],
  interviewQuestions: [],
  supplements: [],
});

// ObjectListInput 欄位定義
const coreProblemFields = [
  { key: 'title', label: '問題標題', type: 'text' },
  { key: 'rootCause', label: '根因', type: 'textarea' },
  { key: 'solution', label: '解法', type: 'textarea' },
  { key: 'alternative', label: '替代方案', type: 'textarea' },
];
const constraintFields = [
  { key: 'constraint', label: '限制', type: 'text' },
  { key: 'reason', label: '原因', type: 'textarea' },
];
const engineeringDecisionFields = [
  { key: 'problem', label: '問題', type: 'text' },
  { key: 'decision', label: '決策', type: 'textarea' },
  { key: 'why', label: '為何', type: 'textarea' },
];
const productionThinkingFields = [
  { key: 'scenario', label: '場景', type: 'text' },
  { key: 'strategy', label: '策略', type: 'textarea' },
];
const futureEvolutionFields = [
  { key: 'scale', label: '規模', type: 'text' },
  { key: 'approach', label: '方法', type: 'textarea' },
];
const supplementFields = [
  { key: 'enabled', label: '啟用', type: 'checkbox' },
  { key: 'title', label: '標題', type: 'text' },
  { key: 'problem', label: '問題描述', type: 'textarea' },
  { key: 'rootCause', label: '根本原因', type: 'textarea' },
  { key: 'solution', label: '解決方式', type: 'textarea' },
  { key: 'prevention', label: '未來預防措施', type: 'textarea' },
];

async function loadData() {
  const res = await fetchAdminProject(props.projectId);
  const cs = res.data.data?.caseStudy;
  if (cs) {
    if (cs.diagrams && Array.isArray(cs.diagrams)) {
      diagramImages.value = cs.diagrams.map((d: any) => d.url);
    }
    form.value = {
      initialAssumption: cs.initialAssumption || { architecture: '', dataFlow: '', limitations: '' },
      iterationGoal: cs.iterationGoal || '',
      coreProblems: cs.coreProblems || [],
      constraints: cs.constraints || [],
      engineeringDecisions: cs.engineeringDecisions || [],
      technicalImpact: cs.technicalImpact || { maintainability: '', scalability: '', reliability: '', performance: '', security: '' },
      productionThinking: cs.productionThinking || [],
      futureEvolution: cs.futureEvolution || [],
      interviewQuestions: cs.interviewQuestions || [],
      supplements: cs.supplements || [],
    };
    componentKey.value++;
  }
}

async function save() {
  if (!props.projectId) return;

  try {
    // 顯示 Loading 或提示（非必要，視需求加）
    console.log('開始同步圖片與表單資料庫...');

    // ─── A. 先處理圖片刪除 API ───
    for (const url of managerDeletedUrls.value) {
      await deleteImage(props.projectId, url);
    }

    // ─── B. 再處理新圖片上傳 API ───
    const uploadedUrls: string[] = [];
    for (const item of managerNewFiles.value) {
      const res = await uploadImage(props.projectId, item.file);
      uploadedUrls.push(res.data.data!.url);
    }

    // ─── C. 計算出該儲存到後端 caseStudy.diagrams 的最終網址陣列 ───
    const finalDiagramUrls = [
      ...diagramImages.value.filter(url => !managerDeletedUrls.value.includes(url)),
      ...uploadedUrls
    ];

    // ─── D. 包裝最終要送給 updateCaseStudyContent 的資料物件 ───
    // 注意：因爲此處沒有你完整的 save 舊代碼，請依據你後端接收的格式調整
    const submitPayload = {
      ...form.value,
      // 依你的後端資料結構，將最終網址陣列對應塞回 caseStudy 內
      diagrams: finalDiagramUrls.map(url => ({ url })) 
    };

    // ─── E. 觸發父組件原本的儲存 API ───
    await updateCaseStudyContent(props.projectId, submitPayload);

    // ─── F. 儲存成功，重置所有暫存狀態 ───
    diagramImages.value = finalDiagramUrls;
    managerDeletedUrls.value = [];
    managerNewFiles.value.forEach(item => URL.revokeObjectURL(item.localUrl));
    managerNewFiles.value = [];

    // 刷新組件 key 重新載入最新狀態
    componentKey.value++; 
    
    alert('工程紀錄與圖片已全部儲存成功！');
  } catch (err) {
    console.error('儲存完整工程紀錄失敗', err);
    alert('儲存失敗，請檢查網路或防呆。');
  }
}

onMounted(loadData);
</script>

<style scoped>
/* 保持原有樣式不變 */
.case-study-editor { max-width: 1000px; margin: 0 auto; }
.case-study-form { margin-top: 24px; display: flex; flex-direction: column; gap: 28px; }
.form-section { border-top: 1px solid var(--border); padding-top: 16px; margin-top: 8px; }
.form-section h3 { margin-bottom: 16px; font-size: 1.1rem; }
.form-group { display: flex; flex-direction: column; gap: 8px; }
.form-group label { font-weight: 600; font-size: 0.9rem; color: var(--text); }
.form-control { padding: 10px 12px; background: var(--bg); border: 1px solid var(--border); border-radius: var(--radius); color: var(--text); font-size: 0.9rem; font-family: inherit; resize: vertical; }
.form-control:focus { outline: none; border-color: var(--accent); }
.form-actions { text-align: right; margin-top: 16px; }
.btn-primary { background: var(--accent); color: white; border: none; padding: 10px 24px; border-radius: var(--radius); font-size: 1rem; cursor: pointer; transition: opacity 0.2s; }
.btn-primary:hover { opacity: 0.85; }
</style>