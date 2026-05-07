import express from 'express';
import cors from 'cors';
import { config } from './config/index';
import { supabaseAdmin } from './config/supabase';
import projectRoutes from './api/v1/projects';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(cors());
app.use(express.json());

// CDN 快取標頭
app.use('/api', (req, res, next) => {
  res.set({
    'Cache-Control': `public, max-age=${config.cache.maxAge}, stale-while-revalidate=${config.cache.staleWhileRevalidate}`,
    'X-API-Version': config.appVersion,
  });
  next();
});

// 健康檢查
app.get('/api/health', async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('projects')
      .select('id')
      .limit(1);

    if (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }

    res.json({
      success: true,
      message: 'Server running, Supabase connected',
      version: config.appVersion,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message || 'Unknown error',
    });
  }
});

// 訪客 API
app.use('/api/v1/projects', projectRoutes);

// 全域錯誤處理
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`);
  console.log(`Version: ${config.appVersion}`);
});

export default app;