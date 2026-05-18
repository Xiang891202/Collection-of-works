import request from 'supertest';
import app from '../../app';
import { createAuthToken, createTestProject } from '../helpers';

let adminToken: string;

beforeAll(async () => {
  adminToken = await createAuthToken();
});

describe('管理員專案 API', () => {
  test('GET /admin/projects 應回傳專案列表', async () => {
    const res = await request(app)
      .get('/api/v1/admin/projects')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('POST /admin/projects 應建立新專案', async () => {
    const res = await request(app)
      .post('/api/v1/admin/projects')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        slug: 'integration-test',
        title: '整合測試專案',
        tag: '練習專案',
        one_liner: '測試描述',
      });
    expect(res.status).toBe(201);
    expect(res.body.data.slug).toBe('integration-test');
    expect(res.body.data.status).toBe('draft'); // 預設草稿
  });

  test('PUT /admin/projects/:id/showcase 應更新展示版內容', async () => {
    const project = await createTestProject(adminToken);
    const res = await request(app)
      .put(`/api/v1/admin/projects/${project.id}/showcase`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        systemDefinition: '測試系統',
        problem: '測試問題',
        solution: '測試解法',
        impact: '測試影響',
        extendedApplications: ['應用1'],
        images: [],
      });
    expect(res.status).toBe(200);
    expect(res.body.data.systemDefinition).toBe('測試系統');
  });
});