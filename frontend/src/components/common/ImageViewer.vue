<template>
  <div style="display: none;"></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import PhotoSwipe from 'photoswipe';
import 'photoswipe/style.css';

export interface PhotoItem {
  src: string;
  width?: number;
  height?: number;
  alt?: string;
}

const props = defineProps<{
  images: PhotoItem[];
  startIndex?: number;
  zoomEnabled?: boolean;
  loop?: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

let pswp: PhotoSwipe | null = null;

onMounted(async () => {
  if (!props.images.length) return;

  const items = props.images.map(img => ({
    src: img.src,
    w: img.width || 0,
    h: img.height || 0,
    alt: img.alt || '',
  }));

  // PhotoSwipe v5 正確初始化方式
  const options = {
    dataSource: items,
    index: props.startIndex || 0,
    zoom: props.zoomEnabled ?? true,
    closeOnVerticalDrag: true,
    loop: props.loop ?? (items.length > 1),
    showHideAnimationType: 'fade' as const,
  };

  pswp = new PhotoSwipe(options);
  pswp.init();

  pswp.on('close', () => {
    emit('close');
    pswp = null;
  });
});

onUnmounted(() => {
  if (pswp) {
    pswp.close();
    pswp = null;
  }
});
</script>