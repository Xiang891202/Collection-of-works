import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

// 模擬整個 supabase 模組，避免真實連線
jest.mock('../config/supabase', () => ({
  supabaseAdmin: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: null, error: null }),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    lte: jest.fn().mockReturnThis(),
    upsert: jest.fn().mockResolvedValue({ error: null }),
    // 根據 Repository 中實際使用的方法，可能需要補充其他鏈式方法
  },
  supabaseAnon: jest.fn(),
}));