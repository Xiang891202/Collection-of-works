import { AdminProjectListItemDTO, AdminProjectDetailDTO } from '../types/dto';
import { ShowcaseMapper } from './showcaseMapper';
import { ProfessionalMapper } from './professionalMapper';
import { CaseStudyMapper } from './caseStudyMapper';

export class AdminMapper {
  static toListItemDTO(row: any): AdminProjectListItemDTO {
    return {
      id: row.id,
      slug: row.slug,
      title: row.title,
      tag: row.tag,
      status: row.status,
      thumbnail_url: row.thumbnail_url || null,
      one_liner: row.one_liner,
      updated_at: row.updated_at,
    };
  }

  static toDetailDTO(
    project: any,
    showcaseRaw: any,
    professionalRaw: any,
    caseStudyRaw: any
  ): AdminProjectDetailDTO {
    return {
      id: project.id,
      slug: project.slug,
      title: project.title,
      tag: project.tag,
      thumbnail_url: project.thumbnail_url || null,
      one_liner: project.one_liner,
      status: project.status,
      published_at: project.published_at || null,   // ✅ 新增
      showcase: showcaseRaw ? ShowcaseMapper.toDTO(showcaseRaw, project) : null,
      professional: professionalRaw ? ProfessionalMapper.toDTO(professionalRaw, project) : null,
      caseStudy: caseStudyRaw ? CaseStudyMapper.toDTO(caseStudyRaw) : null,
    };
  }
}