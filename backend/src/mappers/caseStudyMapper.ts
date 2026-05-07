import { CaseStudyDTO, CaseStudyPreviewDTO } from '../types/dto';

export class CaseStudyMapper {
  // 完整工程紀錄 DTO
  static toDTO(raw: any): CaseStudyDTO {
    return {
      initialAssumption: raw.initialAssumption || {
        architecture: '',
        dataFlow: '',
        limitations: '',
      },
      iterationGoal: raw.iterationGoal || '',
      coreProblems: raw.coreProblems || [],
      constraints: raw.constraints || [],
      engineeringDecisions: raw.engineeringDecisions || [],
      technicalImpact: raw.technicalImpact || {
        maintainability: '',
        scalability: '',
        reliability: '',
        performance: '',
        security: '',
      },
      productionThinking: raw.productionThinking || [],
      futureEvolution: raw.futureEvolution || [],
      interviewQuestions: raw.interviewQuestions || [],
      diagrams: raw.diagrams || [],
    };
  }

  // 輕量預覽 DTO（預載用）
  static toPreviewDTO(raw: any): CaseStudyPreviewDTO {
    const problems = raw.coreProblems || [];
    return {
      iterationGoal: raw.iterationGoal || '',
      coreProblemCount: problems.length,
      topDecision: problems[0]?.title || '',
      thumbnailDiagram: raw.diagrams?.[0]?.url || null,
    };
  }
}