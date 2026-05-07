export interface DemoUrl {
  user?: string;
  admin?: string;
}

export interface ShowcaseDTO {
  systemDefinition: string;
  problem: string;
  solution: string;
  impact: string;
  extendedApplications: string[];
  images: string[];
  demoUrl: string | DemoUrl | null;
}

export interface ProfessionalSummaryDTO {
  systemGoal: string;
  techStack: { frontend: string[]; backend: string[]; storage: string[] };
  architectureOverview: string;
  coreProblemTitles: string[];
}

export interface ProfessionalDTO {
  systemGoal: string;
  techStack: { frontend: string[]; backend: string[]; storage: string[] };
  architectureDiagram: string | null;
  dataFlow: string;
  keyProcesses: string[];
  coreProblems: { title: string; description: string }[];
  designDecisions: { problem: string; rootCause: string; solution: string; alternative: string }[];
  tradeOffs: { decision: string; chosen: string; sacrificed: string; reason: string }[];
  impactAnalysis: { scalability: string; maintainability: string; reliability: string; consistency: string; performance: string };
  futureEvolution: { level: string; plan: string }[];
  interviewQuestions: string[];
  githubUrl: string | null;
}

export interface CaseStudyPreviewDTO {
  iterationGoal: string;
  coreProblemCount: number;
  topDecision: string;
  thumbnailDiagram: string | null;
}

export interface CaseStudyDTO {
  initialAssumption: { architecture: string; dataFlow: string; limitations: string };
  iterationGoal: string;
  coreProblems: { title: string; rootCause: string; solution: string; alternative: string }[];
  constraints: { constraint: string; reason: string }[];
  engineeringDecisions: { problem: string; decision: string; why: string }[];
  technicalImpact: { maintainability: string; scalability: string; reliability: string; performance: string; security: string };
  productionThinking: { scenario: string; strategy: string }[];
  futureEvolution: { scale: string; approach: string }[];
  interviewQuestions: string[];
  diagrams: { type: string; url: string }[];
}

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

export interface ApiResponse<T> {
  success: boolean;
  mode: string;
  data: T | null;
  meta: { slug?: string; version: string; timestamp: string };
  error?: string;
}