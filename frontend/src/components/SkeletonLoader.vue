<template>
  <div class="skeleton">
    <div class="skeleton-title"></div>
    <div class="skeleton-line"></div>
    <div class="skeleton-line"></div>
    <div class="skeleton-line short"></div>
  </div>
</template>

<style scoped>
.skeleton { padding: 20px; }
.skeleton-title { width: 60%; height: 32px; background: #2a2a2a; margin-bottom: 24px; border-radius: 8px; animation: pulse 1.5s infinite; }
.skeleton-line { height: 16px; background: #2a2a2a; margin-bottom: 12px; border-radius: 4px; animation: pulse 1.5s infinite; }
.skeleton-line.short { width: 40%; }
@keyframes pulse { 0% { opacity: 0.6; } 50% { opacity: 1; } 100% { opacity: 0.6; } }
</style>