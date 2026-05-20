<template>
  <article class="showcase">
    <h1>{{ data.systemDefinition }}</h1>
    
    <section v-if="data.problem">
      <h2>⚠️ 解決的問題</h2>
      <p v-html="formatText(data.problem)"></p>
    </section>
    
    <section v-if="data.solution">
      <h2>🧩 如何解決</h2>
      <p v-html="formatText(data.solution)"></p>
    </section>
    
    <section v-if="data.impact">
      <h2>🏗 帶來的改變</h2>
      <p v-html="formatText(data.impact)"></p>
    </section>
    
    <section v-if="data.extendedApplications?.length">
      <h2>🔭 延伸應用</h2>
      <ul>
        <li v-for="(app, idx) in data.extendedApplications" :key="idx" v-html="formatText(app)"></li>
      </ul>
    </section>
    
    <!-- 使用統一的輪播元件 -->
    <section v-if="images.length" class="carousel-section">
      <h2>🖼 系統畫面</h2>
      <ImageCarousel :images="images" />
    </section>
    
    <!-- 體驗連結 -->
    <div class="demo-links" v-if="demoUrlList.length">
      <div class="demo-links-title">🔗 線上體驗</div>
      <div class="demo-buttons">
        <a 
          v-for="(link, idx) in demoUrlList" 
          :key="idx" 
          :href="link.url" 
          target="_blank" 
          rel="noopener noreferrer"
          class="demo-btn"
        >
          <span class="demo-icon">🚀</span>
          <span class="demo-label">{{ link.label || '前往體驗' }}</span>
        </a>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ShowcaseDTO } from '../../../types/dto';
import { formatText } from '../../../utils/textFormatter';
import ImageCarousel from '../../../components/common/ImageCarousel.vue';

const props = defineProps<{ data: ShowcaseDTO }>();

const images = computed(() => props.data.images || []);

const demoUrlList = computed(() => {
  if (Array.isArray(props.data.demoUrl)) return props.data.demoUrl;
  if (props.data.demoUrl && typeof props.data.demoUrl === 'object') {
    const obj = props.data.demoUrl as any;
    const arr = [];
    if (obj.user) arr.push({ label: '使用者入口', url: obj.user });
    if (obj.admin) arr.push({ label: '管理員入口', url: obj.admin });
    return arr;
  }
  return [];
});
</script>

<style scoped>
.showcase {
  max-width: 100%;
}

.carousel-section {
  margin: 32px 0;
}

.carousel-section h2 {
  margin-bottom: 16px;
}

.demo-links {
  margin-top: 32px;
  padding: 20px;
  background: var(--surface);
  border-radius: var(--radius);
  border: 1px solid var(--border);
}

.demo-links-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 16px;
  color: var(--text-muted);
}

.demo-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.demo-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: var(--accent);
  color: white;
  border-radius: 40px;
  font-size: 0.9rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
}

.demo-btn:hover {
  transform: translateY(-2px);
  opacity: 0.9;
}

@media (max-width: 768px) {
  .demo-buttons {
    flex-direction: column;
  }
  
  .demo-btn {
    justify-content: center;
  }
}
</style>