// =========================
// 線上體驗 DEMO DTO
// =========================
export interface DemoUrl {
  user?: string;
  admin?: string;
}

// =========================
// 展示版 DTO（Showcase）
// =========================
export interface ShowcaseDTO {
  systemDefinition: string;
  problem: string;
  solution: string;
  impact: string;
  extendedApplications: string[];
  images: string[];
   demoUrl: string | DemoUrl | null;
}

// =========================
// 專業版摘要 DTO（預載用）
// =========================
export interface ProfessionalSummaryDTO {
  systemGoal: string;
  techStack: {
    frontend: string[];
    backend: string[];
    storage: string[];
  };
  architectureOverview: string;
  coreProblemTitles: string[];
}

// =========================
// 專業版完整 DTO
// =========================
export interface ProfessionalDTO {
  systemGoal: string;
  techStack: {
    frontend: string[];
    backend: string[];
    storage: string[];
  };
  architectureDiagram: string | null;
  dataFlow: string;
  keyProcesses: string[];
  coreProblems: {
    title: string;
    description: string;
  }[];
  designDecisions: {
    problem: string;
    rootCause: string;
    solution: string;
    alternative: string;
  }[];
  tradeOffs: {
    decision: string;
    chosen: string;
    sacrificed: string;
    reason: string;
  }[];
  impactAnalysis: {
    scalability: string;
    maintainability: string;
    reliability: string;
    consistency: string;
    performance: string;
  };
  futureEvolution: {
    level: string;
    plan: string;
  }[];
  interviewQuestions: string[];
  githubUrl: string | null;
}

// =========================
// 工程紀錄預覽 DTO（預載用）
// =========================
export interface CaseStudyPreviewDTO {
  iterationGoal: string;
  coreProblemCount: number;
  topDecision: string;
  thumbnailDiagram: string | null;
}

// =========================
// 工程紀錄完整 DTO
// =========================
export interface CaseStudyDTO {
  initialAssumption: {
    architecture: string;
    dataFlow: string;
    limitations: string;
  };
  iterationGoal: string;
  coreProblems: {
    title: string;
    rootCause: string;
    solution: string;
    alternative: string;
  }[];
  constraints: {
    constraint: string;
    reason: string;
  }[];
  engineeringDecisions: {
    problem: string;
    decision: string;
    why: string;
  }[];
  technicalImpact: {
    maintainability: string;
    scalability: string;
    reliability: string;
    performance: string;
    security: string;
  };
  productionThinking: {
    scenario: string;
    strategy: string;
  }[];
  futureEvolution: {
    scale: string;
    approach: string;
  }[];
  interviewQuestions: string[];
  diagrams: {
    type: string;
    url: string;
  }[];
}

// =========================
// 專案列表卡片 DTO
// =========================
export interface ProjectCardDTO {
  id: string;
  slug: string;
  title: string;
  tag: string;
  thumbnailUrl: string | null;
  oneLiner: string;
  demoUrl: string | null;
  githubUrl: string | null;
}

// =========================
// 統一 API 回應
// =========================
export interface ApiResponse<T> {
  success: boolean;
  mode: 'showcase' | 'professional-summary' | 'professional' | 'case-study-preview' | 'case-study';
  data: T | null;
  meta: {
    slug?: string;
    version: string;
    timestamp: string;
  };
  error?: string;
}