<template>
  <div class="carousel" v-if="images.length">
    <button @click="prev" class="carousel-btn">‹</button>
    <img :src="images[currentIndex]" class="carousel-img" />
    <button @click="next" class="carousel-btn">›</button>
    <div class="dots">
      <span v-for="(_, i) in images" :key="i" :class="{ active: i === currentIndex }" @click="currentIndex = i"></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{ images: string[] }>();
const currentIndex = ref(0);

function next() { currentIndex.value = (currentIndex.value + 1) % props.images.length; }
function prev() { currentIndex.value = (currentIndex.value - 1 + props.images.length) % props.images.length; }
</script>