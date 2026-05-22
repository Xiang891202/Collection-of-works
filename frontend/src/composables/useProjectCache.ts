// composables/useProjectCache.ts
export function useProjectCache() {
  const getCacheKey = (slug: string, mode: string) => `project_${slug}_${mode}`;

  const getCached = <T>(slug: string, mode: string): T | null => {
    const key = getCacheKey(slug, mode);
    const cached = localStorage.getItem(key);
    if (cached) {
      try {
        return JSON.parse(cached) as T;
      } catch (e) {
        console.warn('解析缓存失败', e);
      }
    }
    return null;
  };

  const setCache = <T>(slug: string, mode: string, data: T) => {
    const key = getCacheKey(slug, mode);
    localStorage.setItem(key, JSON.stringify(data));
  };

  const clearCache = (slug?: string, mode?: string) => {
    if (slug && mode) {
      localStorage.removeItem(getCacheKey(slug, mode));
    } else if (slug) {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(`project_${slug}_`)) localStorage.removeItem(key);
      });
    } else {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('project_')) localStorage.removeItem(key);
      });
    }
  };

  return { getCached, setCache, clearCache };
}