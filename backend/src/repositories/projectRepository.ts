import { supabaseAdmin } from '../config/supabase';

export class ProjectRepository {
  // 共用公開過濾條件：status = 'active' 且 published_at <= NOW()
  private applyPublicFilter<T>(query: any): any {
    return query
      .eq('status', 'active')
      .lte('published_at', new Date().toISOString());
  }

  // 訪客列表：過濾後排序
  async findAllActive(): Promise<any[]> {
    let query = supabaseAdmin
      .from('projects')
      .select('id, slug, title, tag, thumbnail_url, one_liner, demo_url, github_url')
      .order('created_at', { ascending: false });
    query = this.applyPublicFilter(query);
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  // 訪客依 slug 查詢（單一專案）
  async findActiveBySlug(slug: string): Promise<any | null> {
    let query = supabaseAdmin
      .from('projects')
      .select('id, slug, title, tag, thumbnail_url, one_liner, demo_url, github_url, status')
      .eq('slug', slug)
      .single();
    query = this.applyPublicFilter(query);
    const { data, error } = await query;
    if (error || !data) return null;
    return data;
  }

  // 管理員：依 ID 查詢（不套用公開過濾）
  async findById(id: string): Promise<any | null> {
    const { data, error } = await supabaseAdmin
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();
    if (error || !data) return null;
    return data;
  }

  // 管理員：取得所有專案（不分狀態）
  async findAll(): Promise<any[]> {
    const { data, error } = await supabaseAdmin
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  // 管理員：取得所有已刪除專案
  async findAllDeleted(): Promise<any[]> {
    const { data, error } = await supabaseAdmin
      .from('projects')
      .select('*')
      .eq('status', 'deleted')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  // 管理員：依狀態篩選
  async findAllByStatus(status: string): Promise<any[]> {
    let query = supabaseAdmin.from('projects').select('*');
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  // 建立專案（預設 status = 'draft', published_at = null）
  async create(input: any): Promise<any> {
    const { data, error } = await supabaseAdmin
      .from('projects')
      .insert({
        slug: input.slug,
        title: input.title,
        tag: input.tag,
        thumbnail_url: input.thumbnail_url || null,
        one_liner: input.one_liner || '',
        demo_url: input.demo_url || null,
        github_url: input.github_url || null,
        status: 'draft',
        published_at: null,
      })
      .select('*')
      .single();
    if (error) throw error;
    return data;
  }

  // 更新主表資料（不包含狀態與發布時間）
  async updateMeta(id: string, input: any): Promise<void> {
    const updates: any = {};
    if (input.title !== undefined) updates.title = input.title;
    if (input.slug !== undefined) updates.slug = input.slug;
    if (input.tag !== undefined) updates.tag = input.tag;
    if (input.thumbnail_url !== undefined) updates.thumbnail_url = input.thumbnail_url;
    if (input.one_liner !== undefined) updates.one_liner = input.one_liner;
    if (input.demo_url !== undefined) updates.demo_url = input.demo_url;
    if (input.github_url !== undefined) updates.github_url = input.github_url;
    // 只要有更新，就刷新 updated_at
    updates.updated_at = new Date().toISOString();
    const { error } = await supabaseAdmin
      .from('projects')
      .update(updates)
      .eq('id', id);
    if (error) throw error;
  }

  // 軟刪除
  async softDelete(id: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from('projects')
      .update({ 
        status: 'deleted',
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
    if (error) throw error;
  }

  // 更新狀態與發布時間
  async updateStatusAndPublishedAt(id: string, status: string, publishedAt: string | null): Promise<void> {
    const { error } = await supabaseAdmin
      .from('projects')
      .update({ 
        status, 
        published_at: publishedAt,
        updated_at: new Date().toISOString()   // ✅ 關鍵修改
      })
      .eq('id', id);
    if (error) throw error;
  }
}