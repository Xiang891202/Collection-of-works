import { ProjectRepository } from '../repositories/projectRepository';
import { ContentRepository } from '../repositories/contentRepository';
import { ShowcaseMapper } from '../mappers/showcaseMapper';
import { ProfessionalMapper } from '../mappers/professionalMapper';
import { CaseStudyMapper } from '../mappers/caseStudyMapper';
import { ProjectMapper } from '../mappers/projectMapper';
import { AppError } from '../utils/appError';
import { ShowcaseDTO, ProfessionalDTO, ProfessionalSummaryDTO, CaseStudyDTO, CaseStudyPreviewDTO, ProjectCardDTO } from '../types/dto';

export class ProjectService {
  private projectRepo = new ProjectRepository();
  private contentRepo = new ContentRepository();

  async getProjectList(): Promise<ProjectCardDTO[]> {
    const projects = await this.projectRepo.findAllActive();
    return projects.map(ProjectMapper.toCardDTO);
  }

  async getByMode(slug: string, mode: string) {
    const project = await this.projectRepo.findActiveBySlug(slug);
    if (!project) throw new AppError('Project not found', 404);

    const raw = await this.contentRepo.getContentByMode(project.id, mode);
    if (!raw) throw new AppError('Content not found for this mode', 404);

    return this.mapToDTO(mode, raw, project);
    }

    private mapToDTO(mode: string, raw: any, project: any) {
        switch (mode) {
            case 'showcase': return ShowcaseMapper.toDTO(raw, project);
            case 'professional-summary': return ProfessionalMapper.toSummaryDTO(raw);
            case 'professional': return ProfessionalMapper.toDTO(raw, project);
            case 'case-study-preview': return CaseStudyMapper.toPreviewDTO(raw);
            case 'case-study': return CaseStudyMapper.toDTO(raw);
            default: throw new AppError('Invalid mode', 400);
        }
    }
}