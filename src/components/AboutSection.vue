<template>
  <section id="about" class="about" :class="{ 'professional': mode === 'professional' }">
    <div class="container">
      <h2 class="section-title">關於我</h2>
      <div class="info-grid">
        <div class="info-item">
          <h3>技能</h3>
          <ul>
            <li>Vue 3 / React</li>
            <li>Node.js / Express</li>
            <li>UI/UX 設計</li>
          </ul>
        </div>
        <div class="info-item">
          <h3>證照</h3>
          <ul>
            <li>iPAS 前端工程師</li>
            <li>TOEIC 金色證書</li>
          </ul>
        </div>
        <div class="info-item">
          <h3>經歷</h3>
          <ul>
            <li>軟體工程師 @ 某某公司 (2021-至今)</li>
            <li>前端實習生 @ 新創團隊 (2020-2021)</li>
          </ul>
        </div>
        <div class="info-item">
          <h3>聯絡方式</h3>
          <ul>
            <li>Email: example@email.com</li>
            <li>GitHub: github.com/example</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  mode: {
    type: String,
    required: true,
  },
});
</script>

<style scoped>
.about {
  padding: 4rem 2rem;
  background-color: #f7fafc; /* 中性底色，可隨模式微調 */
  transition: background-color 0.3s;
}
.about.professional {
  background-color: #fffaf0;
}
.container {
  max-width: 1200px;
  margin: 0 auto;
}
.section-title {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 3rem;
}
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
}
.info-item h3 {
  margin-bottom: 1rem;
  border-bottom: 2px solid #cbd5e0;
  padding-bottom: 0.5rem;
}
.info-item ul {
  list-style: none;
  padding: 0;
}
.info-item li {
  margin-bottom: 0.5rem;
}
</style>