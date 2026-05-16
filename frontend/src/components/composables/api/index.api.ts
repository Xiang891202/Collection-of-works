import axios from 'axios';
import type {
  ApiResponse,
  ProjectCardDTO,
  ShowcaseDTO,
  ProfessionalDTO,
  ProfessionalSummaryDTO,
  CaseStudyDTO,
  CaseStudyPreviewDTO,
  AuthDTO,
  AdminProjectListItemDTO,
  AdminProjectDetailDTO,
} from '../types/dto';

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

// =========================
// 管理員 API
// =========================

// 請求攔截器：自動帶 token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 登入
export function adminLogin(email: string, password: string) {
  return api.post<ApiResponse<AuthDTO>>('/admin/login', { email, password });
}

// 取得所有專案（可帶 ?status=all/deleted/active）
export function fetchAdminProjects(status?: string) {
  return api.get<ApiResponse<AdminProjectListItemDTO[]>>('/admin/projects', {
    params: { status },
  });
}

// 取得單一專案完整資料
export function fetchAdminProject(id: string) {
  return api.get<ApiResponse<AdminProjectDetailDTO>>(`/admin/projects/${id}`);
}

// 新增專案
export function createProject(data: any) {
  return api.post<ApiResponse<AdminProjectDetailDTO>>('/admin/projects', data);
}

// 更新專案主表
export function updateProjectMeta(id: string, data: any) {
  return api.put<ApiResponse<any>>(`/admin/projects/${id}`, data);
}

// 更新展示版內容
export function updateShowcaseContent(id: string, data: any) {
  return api.put<ApiResponse<ShowcaseDTO>>(`/admin/projects/${id}/showcase`, data);
}

// 更新專業版內容
export function updateProfessionalContent(id: string, data: any) {
  return api.put<ApiResponse<ProfessionalDTO>>(`/admin/projects/${id}/professional`, data);
}

// 更新工程紀錄內容
export function updateCaseStudyContent(id: string, data: any) {
  return api.put<ApiResponse<CaseStudyDTO>>(`/admin/projects/${id}/case-study`, data);
}

// 軟刪除
export function softDeleteProject(id: string) {
  return api.delete<ApiResponse<null>>(`/admin/projects/${id}`);
}

// 復原
export function restoreProject(id: string) {
  return api.patch<ApiResponse<null>>(`/admin/projects/${id}/restore`);
}

// 上傳圖片
export function uploadImage(projectId: string, file: File) {
  const formData = new FormData();
  formData.append('image', file);
  return api.post<ApiResponse<{ url: string }>>(`/admin/media/${projectId}/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

export function publishProject(id: string, data: { status: string; published_at: string | null }) {
  return api.patch(`/admin/projects/${id}/publish`, data);
}

export default api;