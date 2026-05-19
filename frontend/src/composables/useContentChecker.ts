
export function useContentChecker() {
  const hasContent = (value: any): boolean => {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'object') {
      // 特殊处理技术栈对象
      if (value.frontend !== undefined || value.backend !== undefined || value.storage !== undefined) {
        return (
          (Array.isArray(value.frontend) && value.frontend.length > 0) ||
          (Array.isArray(value.backend) && value.backend.length > 0) ||
          (Array.isArray(value.storage) && value.storage.length > 0)
        );
      }
      // 一般对象：检查是否有任何属性有内容
      return Object.values(value).some(v => hasContent(v));
    }
    // 数字、布尔等视为有内容
    return true;
  };

  const hasTechStack = (techStack: any): boolean => {
    if (!techStack || typeof techStack !== 'object') return false;
    return (
      (Array.isArray(techStack.frontend) && techStack.frontend.length > 0) ||
      (Array.isArray(techStack.backend) && techStack.backend.length > 0) ||
      (Array.isArray(techStack.storage) && techStack.storage.length > 0)
    );
  };

  const hasEnabledSupplements = (supplements: any[] | undefined): boolean => {
    return Array.isArray(supplements) && supplements.some(s => s.enabled === true && hasContent(s.title));
  };

  return { hasContent, hasTechStack, hasEnabledSupplements };
}