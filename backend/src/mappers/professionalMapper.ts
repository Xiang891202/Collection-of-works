import { ProfessionalDTO, ProfessionalSummaryDTO } from '../types/dto';

export class ProfessionalMapper {
  static toDTO(raw: any, project?: any): ProfessionalDTO {
    return {
      systemGoal: raw.systemGoal || '',
      techStack: raw.techStack || { frontend: [], backend: [], storage: [] },
      architectureDiagram: raw.architectureDiagram || null,
      dataFlow: raw.dataFlow || '',
      keyProcesses: raw.keyProcesses || [],
      coreProblems: raw.coreProblems || [],
      designDecisions: raw.designDecisions || [],
      tradeOffs: raw.tradeOffs || [],
      impactAnalysis: raw.impactAnalysis || { scalability: '', maintainability: '', reliability: '', consistency: '', performance: '' },
      futureEvolution: raw.futureEvolution || [],
      interviewQuestions: raw.interviewQuestions || [],
      githubUrl: project?.github_url || null,
      images: raw.images || [],   // ✅ 新增這一行
      // ✅ 新增以下欄位
      boundary: raw.boundary || '',
      evolutionDirection: raw.evolutionDirection || '',
      caseStudyGuide: raw.caseStudyGuide || '',
      dataFlowImage: raw.dataFlowImage || '',
      boundaryImage: raw.boundaryImage || '',
    };
  }

  static toSummaryDTO(raw: any): ProfessionalSummaryDTO {
    return {
      systemGoal: raw.systemGoal || '',
      techStack: raw.techStack || { frontend: [], backend: [], storage: [] },
      architectureOverview: raw.architectureOverview || raw.dataFlow?.substring(0, 100) || '',
      coreProblemTitles: (raw.coreProblems || []).map((p: any) => p.title || ''),
    };
  }
}