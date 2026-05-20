<template>
  <article class="professional">
    <h1>{{ data.systemGoal }}</h1>
    
    <!-- 技術棧 -->
    <section v-if="hasTechStack">
      <h2>🏗 技術棧</h2>
      <div class="tech-stack">
        <div><strong>Frontend</strong><p>{{ data.techStack.frontend?.join(', ') }}</p></div>
        <div><strong>Backend</strong><p>{{ data.techStack.backend?.join(', ') }}</p></div>
        <div><strong>Storage</strong><p>{{ data.techStack.storage?.join(', ') }}</p></div>
      </div>
    </section>
    
    <!-- 架構全景圖 -->
    <section v-if="data.architectureDiagram">
      <h2>📐 架構全景圖</h2>
      <div class="single-image-wrapper">
        <img 
          :src="data.architectureDiagram" 
          class="single-image"
          @click="openSingleImage(data.architectureDiagram)"
        />
      </div>
    </section>
    
    <!-- 資料流 -->
    <section v-if="data.dataFlow || data.dataFlowImage">
      <h2>📡 資料流</h2>
      <div class="media-row">
        <div v-if="data.dataFlow" class="text" v-html="formatText(data.dataFlow)"></div>
        <div v-if="data.dataFlowImage" class="image">
          <img 
            :src="data.dataFlowImage" 
            @click="openSingleImage(data.dataFlowImage)"
          />
        </div>
      </div>
    </section>
    
    <!-- 邊界 -->
    <section v-if="data.boundary || data.boundaryImage">
      <h2>🔲 邊界</h2>
      <div class="media-row">
        <div v-if="data.boundary" class="text" v-html="formatText(data.boundary)"></div>
        <div v-if="data.boundaryImage" class="image">
          <img 
            :src="data.boundaryImage" 
            @click="openSingleImage(data.boundaryImage)"
          />
        </div>
      </div>
    </section>

    <!-- 最關鍵的架構挑戰 -->
    <section v-if="data.coreProblems?.length">
      <h2>⚠️ 最關鍵的架構挑戰</h2>
      <div v-for="(cp, i) in data.coreProblems" :key="i" class="problem-card">
        <h3>{{ cp.title }}</h3>
        <p v-html="formatText(cp.description)"></p>
      </div>
    </section>

    <!-- 最關鍵的設計決策 -->
    <section v-if="data.designDecisions?.length">
      <h2>🧩 最關鍵的設計決策</h2>
      <div v-for="(dd, i) in data.designDecisions" :key="i" class="decision-card">
        <h3>{{ dd.problem }}</h3>
        <p><strong>根因：</strong> <span v-html="formatText(dd.rootCause)"></span></p>
        <p><strong>解法：</strong> <span v-html="formatText(dd.solution)"></span></p>
        <p v-if="dd.alternative"><strong>替代方案：</strong> <span v-html="formatText(dd.alternative)"></span></p>
      </div>
    </section>

    <!-- 演進方向 -->
    <section v-if="data.evolutionDirection">
      <h2>🔭 一個演進方向</h2>
      <p v-html="formatText(data.evolutionDirection)"></p>
    </section>

    <!-- 演進方向配圖（使用輪播） -->
    <section v-if="evolutionImages.length" class="carousel-section">
      <h2>🖼 演進方向配圖</h2>
      <ImageCarousel :images="evolutionImages" />
    </section>

    <!-- 引導至工程紀錄 -->
    <section v-if="data.caseStudyGuide">
      <h2>📘 引導至工程紀錄</h2>
      <p v-html="formatText(data.caseStudyGuide)"></p>
    </section>

    <!-- GitHub 按鈕 -->
    <a
      v-if="data.githubUrl && data.githubUrl.trim() !== ''"
      :href="data.githubUrl"
      target="_blank"
      class="action-btn github-btn"
    >
      💻 GitHub
    </a>

    <!-- 查看工程紀錄按鈕 -->
    <button @click="emit('openCaseStudy')" class="case-study-btn">
      📋 查看工程紀錄
    </button>

    <!-- 燈箱元件 -->
    <LightboxModal ref="lightboxRef" :images="tempImages" />
  </article>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { ProfessionalDTO } from '../../../types/dto';
import { formatText } from '../../../utils/textFormatter';
import ImageCarousel from '../../../components/common/ImageCarousel.vue';
import LightboxModal from '../../../components/common/LightboxModal.vue';

const props = defineProps<{ data: ProfessionalDTO }>();

const emit = defineEmits<{
  (e: 'openImage', url: string): void;
  (e: 'openCaseStudy'): void;
}>();

const lightboxRef = ref<InstanceType<typeof LightboxModal> | null>(null);
const tempImages = ref<string[]>([]);

const evolutionImages = computed(() => props.data.images || []);

const hasTechStack = computed(() => {
  const ts = props.data.techStack;
  return ts && (ts.frontend?.length || ts.backend?.length || ts.storage?.length);
});

function openSingleImage(url: string) {
  if (url) {
    tempImages.value = [url];
    lightboxRef.value?.open(0);
  }
}
</script>

<style scoped>
.professional {
  max-width: 100%;
}

.single-image-wrapper {
  width: 100%;
  background: var(--surface);
  border-radius: var(--radius);
  overflow: hidden;
}

.single-image-wrapper,
.media-row .image img {
  aspect-ratio: 16 / 9;
  width: 100%;
  object-fit: cover;
  cursor: pointer;
}

.single-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: pointer;
}

.tech-stack {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.tech-stack div {
  background: var(--surface);
  padding: 16px;
  border-radius: var(--radius);
}

.problem-card, .decision-card {
  background: var(--surface);
  padding: 16px;
  border-radius: var(--radius);
  margin-bottom: 12px;
}

.media-row {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.media-row .text {
  flex: 1;
}

.media-row .image {
  flex: 1;
}

.media-row .image img {
  width: 100%;
  border-radius: var(--radius);
  cursor: pointer;
  object-fit: cover;
}

.action-btn {
  display: inline-block;
  margin-top: 20px;
  padding: 10px 24px;
  background: var(--accent);
  color: #fff;
  border-radius: var(--radius);
  font-weight: bold;
  text-decoration: none;
}

.github-btn {
  background: #333;
  margin-right: 12px;
}

.case-study-btn {
  margin-top: 16px;
  padding: 10px 24px;
  background: var(--accent);
  color: white;
  border: none;
  border-radius: var(--radius);
  cursor: pointer;
}

.carousel-section {
  margin: 32px 0;
}

@media (max-width: 768px) {
  .media-row {
    flex-direction: column;
  }
  
  .single-image-wrapper,
  .media-row .image img {
    aspect-ratio: 4 / 3;
  }
  
  .tech-stack {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}

@media (max-width: 480px) {
  .single-image-wrapper,
  .media-row .image img {
    aspect-ratio: 1 / 1;
  }
}
</style>