import axios from 'axios';
import type { ApiResponse, ProjectCardDTO, ShowcaseDTO, ProfessionalDTO, ProfessionalSummaryDTO, CaseStudyDTO, CaseStudyPreviewDTO } from '../types/dto';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (axios.isCancel(err)) return Promise.reject(err);
    console.error('API Error:', err.message);
    return Promise.reject(err);
  }
);

export function fetchProjectList() {
  return api.get<ApiResponse<ProjectCardDTO[]>>('/projects');
}

export function fetchProjectByMode(slug: string, mode: string) {
  return api.get<ApiResponse<any>>(`/projects/${slug}`, { params: { mode } });
}

export function fetchShowcase(slug: string) {
  return api.get<ApiResponse<ShowcaseDTO>>(`/projects/${slug}`, { params: { mode: 'showcase' } });
}

export function fetchProfessionalSummary(slug: string) {
  return api.get<ApiResponse<ProfessionalSummaryDTO>>(`/projects/${slug}`, { params: { mode: 'professional-summary' } });
}

export function fetchProfessional(slug: string) {
  return api.get<ApiResponse<ProfessionalDTO>>(`/projects/${slug}`, { params: { mode: 'professional' } });
}

export function fetchCaseStudyPreview(slug: string) {
  return api.get<ApiResponse<CaseStudyPreviewDTO>>(`/projects/${slug}`, { params: { mode: 'case-study-preview' } });
}

export function fetchCaseStudy(slug: string) {
  return api.get<ApiResponse<CaseStudyDTO>>(`/projects/${slug}`, { params: { mode: 'case-study' } });
}

export default api;