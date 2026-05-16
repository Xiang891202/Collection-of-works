import { ProjectRepository } from '../repositories/projectRepository';
import { ContentRepository } from '../repositories/contentRepository';
import { AdminMapper } from '../mappers/adminMapper';
import { ShowcaseMapper } from '../mappers/showcaseMapper';
import { ProfessionalMapper } from '../mappers/professionalMapper';
import { CaseStudyMapper } from '../mappers/caseStudyMapper';
import { AppError } from '../utils/appError';
import { AdminProjectListItemDTO, AdminProjectDetailDTO, ShowcaseDTO, ProfessionalDTO, CaseStudyDTO } from '../types/dto';

export class AdminService {
  private projectRepo = new ProjectRepository();
  private contentRepo = new ContentRepository();

  async getProjectList(status?: string): Promise<AdminProjectListItemDTO[]> {
    let projects;
    if (status === 'deleted') {
      projects = await this.projectRepo.findAllDeleted();
    } else if (status === 'draft') {
      projects = await this.projectRepo.findAllByStatus('draft');
    } else if (status === 'active') {
      projects = await this.projectRepo.findAllByStatus('active');
    } else {
      projects = await this.projectRepo.findAll();
    }
    return projects.map(AdminMapper.toListItemDTO);
  }

  async getProjectDetail(id: string): Promise<AdminProjectDetailDTO> {
    const project = await this.projectRepo.findById(id);
    if (!project) throw new AppError('Project not found', 404);

    const showcaseRaw = await this.contentRepo.getShowcaseContent(id);
    const professionalRaw = await this.contentRepo.getProfessionalContent(id);
    const caseStudyRaw = await this.contentRepo.getCaseStudyContent(id);

    return AdminMapper.toDetailDTO(
      project,
      showcaseRaw,
      professionalRaw,
      caseStudyRaw
    );
  }

  async createProject(input: any): Promise<AdminProjectDetailDTO> {
    const newProject = await this.projectRepo.create(input);
    const id = newProject.id;

    // 處理內容建立
    if (input.showcase) await this.contentRepo.upsertShowcase(id, input.showcase);
    if (input.professional) await this.contentRepo.upsertProfessional(id, input.professional);
    if (input.caseStudy) await this.contentRepo.upsertCaseStudy(id, input.caseStudy);

    return this.getProjectDetail(id);
  }

  async updateProjectMeta(id: string, input: any) {
    const exists = await this.projectRepo.findById(id);
    if (!exists) throw new AppError('Project not found', 404);
    await this.projectRepo.updateMeta(id, input);
    const project = await this.projectRepo.findById(id);
    return AdminMapper.toListItemDTO(project);
  }

  async updateShowcase(id: string, data: any): Promise<ShowcaseDTO> {
    await this.contentRepo.upsertShowcase(id, data);
    const raw = await this.contentRepo.getShowcaseContent(id);
    const project = await this.projectRepo.findById(id);
    return ShowcaseMapper.toDTO(raw, project);
  }

  async updateProfessional(id: string, data: any): Promise<ProfessionalDTO> {
    await this.contentRepo.upsertProfessional(id, data);
    const raw = await this.contentRepo.getProfessionalContent(id);
    const project = await this.projectRepo.findById(id);
    return ProfessionalMapper.toDTO(raw, project);
  }

  async updateCaseStudy(id: string, data: any): Promise<CaseStudyDTO> {
    await this.contentRepo.upsertCaseStudy(id, data);
    const raw = await this.contentRepo.getCaseStudyContent(id);
    return CaseStudyMapper.toDTO(raw);
  }


  // 在 AdminService 類別中
  async publish(id: string, status: 'draft' | 'active', published_at: string | null) {
    const project = await this.projectRepo.findById(id);
    if (!project) throw new AppError('Project not found', 404);
    if (project.status === 'deleted') {
      throw new AppError('Cannot change status of deleted project', 400);
    }
    await this.projectRepo.updateStatusAndPublishedAt(id, status, published_at);
    const updated = await this.projectRepo.findById(id);
    return { id: updated.id, status: updated.status, published_at: updated.published_at };
  }

  // 其他方法（如 softDelete, restore）確保沒有對 void 返回值做條件判斷
  async softDelete(id: string) {
    const exists = await this.projectRepo.findById(id);
    if (!exists) throw new AppError('Project not found', 404);
    await this.projectRepo.softDelete(id);   // ✅ 直接 await，不做 if 判斷
  }

  async restore(id: string) {
    const exists = await this.projectRepo.findById(id);
    if (!exists) throw new AppError('Project not found', 404);
    if (exists.status !== 'deleted') throw new AppError('Project is not deleted', 400);
    await this.projectRepo.updateStatusAndPublishedAt(id, 'draft', null);
  }

  
}