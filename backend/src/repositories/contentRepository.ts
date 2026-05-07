import { supabaseAdmin } from '../config/supabase';

export class ContentRepository {
  // 取得展示版內容（showcase）
  async getShowcaseContent(projectId: string) {
    const { data, error } = await supabaseAdmin
      .from('showcase_content')
      .select('data')
      .eq('project_id', projectId)
      .single();

    if (error || !data) return null;
    return data.data;
  }

  // 取得專業版內容（professional）
  async getProfessionalContent(projectId: string) {
    const { data, error } = await supabaseAdmin
      .from('professional_content')
      .select('data')
      .eq('project_id', projectId)
      .single();

    if (error || !data) return null;
    return data.data;
  }

  // 取得工程紀錄內容（case study，預設 version=1）
  async getCaseStudyContent(projectId: string, version: number = 1) {
    const { data, error } = await supabaseAdmin
      .from('case_study_content')
      .select('data')
      .eq('project_id', projectId)
      .eq('version', version)
      .single();

    if (error || !data) return null;
    return data.data;
  }

  // 依 mode 自動選取對應內容表
  async getContentByMode(projectId: string, mode: string) {
    switch (mode) {
      case 'showcase':
        return this.getShowcaseContent(projectId);
      case 'professional':
      case 'professional-summary':
        return this.getProfessionalContent(projectId);
      case 'case-study':
      case 'case-study-preview':
        return this.getCaseStudyContent(projectId);
      default:
        return null;
    }
  }
}