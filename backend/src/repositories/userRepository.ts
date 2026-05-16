import { supabaseAdmin } from '../config/supabase';

export class UserRepository {
  async findByEmail(email: string) {
    const { data, error } = await supabaseAdmin
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !data) return null;
    return data;
  }
}