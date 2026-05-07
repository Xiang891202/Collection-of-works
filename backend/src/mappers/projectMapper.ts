import { ProjectCardDTO } from '../types/dto';

export class ProjectMapper {
  // DB row → 列表卡片 DTO
  static toCardDTO(row: any): ProjectCardDTO {
    return {
      id: row.id,
      slug: row.slug,
      title: row.title,
      tag: row.tag,
      thumbnailUrl: row.thumbnail_url || null,
      oneLiner: row.one_liner || '',
      demoUrl: row.demo_url || null,
      githubUrl: row.github_url || null,
    };
  }
}

