import { createClient } from '@supabase/supabase-js';
import { config } from './index';

export const supabaseAdmin = createClient(
  config.supabase.url,
  config.supabase.serviceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    },
    db: {
      schema: 'public'
    },
    global: {
      headers: {
        'X-Client-Info': 'collection-of-works-backend'
      }
    }
  }
);

export const supabaseAnon = createClient(
  config.supabase.url,
  config.supabase.anonKey
);