import { ref, type Ref } from 'vue';

export function useSwipe(
  currentIndex: Ref<number>,
  totalLength: Ref<number>,
  onSwipe?: (newIndex: number) => void
) {
  const touchStartX = ref(0);
  const touchStartY = ref(0);
  const touchEndX = ref(0);
  const touchEndY = ref(0);
  const minSwipeDistance = 50; // 最小水平滑動距離（像素）
  const maxVerticalDeviation = 30; // 最大垂直偏移量（超過則視為垂直滾動）

  const onTouchStart = (e: TouchEvent) => {
    touchStartX.value = e.touches[0].clientX;
    touchStartY.value = e.touches[0].clientY;
    touchEndX.value = touchStartX.value;
    touchEndY.value = touchStartY.value;
  };

  const onTouchMove = (e: TouchEvent) => {
    touchEndX.value = e.touches[0].clientX;
    touchEndY.value = e.touches[0].clientY;
    const deltaX = Math.abs(touchEndX.value - touchStartX.value);
    const deltaY = Math.abs(touchEndY.value - touchStartY.value);
    // 如果水平移動明顯大於垂直移動（且超過閾值），阻止默認滾動行為
    if (deltaX > deltaY && deltaX > minSwipeDistance / 2) {
      e.preventDefault();
    }
  };

  const onTouchEnd = () => {
    const deltaX = touchEndX.value - touchStartX.value;
    const deltaY = touchEndY.value - touchStartY.value;
    const len = totalLength.value;
    if (Math.abs(deltaX) < minSwipeDistance || len === 0) {
      // 重置觸控點
      touchStartX.value = 0;
      touchStartY.value = 0;
      touchEndX.value = 0;
      touchEndY.value = 0;
      return;
    }
    // 如果垂直偏移超過容許值，視為垂直滾動，不切換圖片
    if (Math.abs(deltaY) > maxVerticalDeviation && Math.abs(deltaY) > Math.abs(deltaX) * 0.5) {
      return;
    }
    let newIndex = currentIndex.value;
    if (deltaX > 0) {
      // 向右滑 → 上一張
      newIndex = (currentIndex.value - 1 + len) % len;
    } else {
      // 向左滑 → 下一張
      newIndex = (currentIndex.value + 1) % len;
    }
    if (newIndex !== currentIndex.value) {
      currentIndex.value = newIndex;
      if (onSwipe) onSwipe(newIndex);
    }
    // 重置
    touchStartX.value = 0;
    touchStartY.value = 0;
    touchEndX.value = 0;
    touchEndY.value = 0;
  };

  return { onTouchStart, onTouchMove, onTouchEnd };
}