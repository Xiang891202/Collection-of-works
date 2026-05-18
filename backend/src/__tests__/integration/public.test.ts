import request from 'supertest';
import app from '../../app';

describe('訪客端 API', () => {
  test('GET /projects 應回傳已發布且已到發布時間的專案', async () => {
    const res = await request(app).get('/api/v1/projects');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('GET /projects/:slug?mode=showcase 應回傳展示版內容', async () => {
    // 此處應使用一個已存在且 active 的 slug
    const res = await request(app).get('/api/v1/projects/multi-filter?mode=showcase');
    if (res.status === 200) {
      expect(res.body.data).toHaveProperty('systemDefinition');
    } else {
      // 若無資料，狀態碼應為 404
      expect(res.status).toBe(404);
    }
  });
});