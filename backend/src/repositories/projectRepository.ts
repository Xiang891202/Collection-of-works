import { supabaseAdmin } from '../config/supabase';

export class ProjectRepository {
  // 取得所有 active 專案（訪客列表用）
  async findAllActive() {
    const { data, error } = await supabaseAdmin
        .from('projects')
        .select('id, slug, title, tag, thumbnail_url, one_liner, demo_url, github_url')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
    }

  // 依 slug 取得 active 專案（訪客用，自動排除已刪除）
  async findActiveBySlug(slug: string) {
    const { data, error } = await supabaseAdmin
        .from('projects')
        .select('id, slug, title, tag, thumbnail_url, one_liner, demo_url, github_url, status')
        .eq('slug', slug)
        .eq('status', 'active')
        .single();

    if (error || !data) return null;
    return data;
    }

  // 依 ID 取得專案（管理員用，包含已刪除）
  async findById(id: string) {
    const { data, error } = await supabaseAdmin
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return data;
  }

  // 取得所有專案（管理員用，含已刪除）
  async findAll() {
    const { data, error } = await supabaseAdmin
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];  // ← 確保永遠回傳陣列
  }
}