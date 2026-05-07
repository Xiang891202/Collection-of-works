import { ShowcaseDTO } from '../types/dto';

export class ShowcaseMapper {
  static toDTO(raw: any, project?: any): ShowcaseDTO {
    let demoUrl = project?.demo_url || null;

    // 嘗試解析 JSON，失敗則保持原字串
    if (demoUrl && typeof demoUrl === 'string') {
      try {
        demoUrl = JSON.parse(demoUrl);
      } catch {
        // 保持原字串
      }
    }

    return {
      systemDefinition: raw.systemDefinition || '',
      problem: raw.problem || '',
      solution: raw.solution || '',
      impact: raw.impact || '',
      extendedApplications: raw.extendedApplications || [],
      images: raw.images || [],
      demoUrl,
    };
  }
}