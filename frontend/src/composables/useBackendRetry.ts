// composables/useBackendRetry.ts
import { ref } from 'vue';

export interface RetryOptions {
  maxRetries?: number;
  retryDelay?: number; // 秒
}

export function useBackendRetry(options: RetryOptions = {}) {
  const { maxRetries = 3, retryDelay = 10 } = options;
  const retryDelayMs = retryDelay * 1000;

  const isRetrying = ref(false);
  const countdown = ref(0);
  const retryCount = ref(0);
  const errorMessage = ref<string | null>(null);
  let retryTimeout: ReturnType<typeof setTimeout> | null = null;
  let countdownInterval: ReturnType<typeof setInterval> | null = null;

  const stopCountdown = () => {
    if (countdownInterval) clearInterval(countdownInterval);
    countdownInterval = null;
  };

  const stopRetry = () => {
    if (retryTimeout) clearTimeout(retryTimeout);
    retryTimeout = null;
    stopCountdown();
    isRetrying.value = false;
    countdown.value = 0;
  };

  const reset = () => {
    stopRetry();
    retryCount.value = 0;
    errorMessage.value = null;
  };

  const startRetry = async (retryFn: () => Promise<{ success: boolean; errorType?: 'cold' | 'api' }>) => {
    if (retryCount.value >= maxRetries) return;
    if (isRetrying.value) return;

    isRetrying.value = true;
    let secondsLeft = retryDelay;
    countdown.value = secondsLeft;

    stopCountdown();
    countdownInterval = setInterval(() => {
      if (secondsLeft > 0) {
        secondsLeft--;
        countdown.value = secondsLeft;
      } else {
        stopCountdown();
      }
    }, 1000);

    retryTimeout = setTimeout(async () => {
      stopCountdown();
      retryCount.value++;
      isRetrying.value = false;

      const result = await retryFn();

      if (!result.success && retryCount.value < maxRetries) {
        startRetry(retryFn);
      } else if (!result.success) {
        // 达到最大重试次数，设置错误信息
        if (result.errorType === 'cold') {
          errorMessage.value = '❌ 後端尚未啟動，請稍後再嘗試';
        } else {
          errorMessage.value = '❌ 後端與前端接口異常，請稍後再試';
        }
        isRetrying.value = false;
      } else {
        reset();
      }
    }, retryDelayMs);
  };

  const manualRetry = () => {
    stopRetry();
    retryCount.value = 0;
    errorMessage.value = null;
  };

  const setError = (msg: string) => {
    errorMessage.value = msg;
    isRetrying.value = false;
    stopRetry();
  };

  return {
    isRetrying,
    countdown,
    retryCount,
    maxRetries,
    errorMessage,
    startRetry,
    manualRetry,
    reset,
    setError,
    stopRetry,
  };
}