<template>
  <Header />          <!-- 新增這行，讓導覽列固定顯示 -->
  <router-view />
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue'   // 導入 Header
// 可在此引入全域樣式
</script>

<style>
/* 原有的全域樣式保持不變 */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  font-family: 'Inter', sans-serif;
  color: #1a202c;
  line-height: 1.6;
}
</style>