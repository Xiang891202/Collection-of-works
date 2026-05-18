import request from 'supertest';
import app from '../app';

export const createAuthToken = async () => {
  const email = process.env.TEST_ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.TEST_ADMIN_PASSWORD || 'your-password';
  const res = await request(app)
    .post('/api/v1/admin/login')
    .send({ email, password });
  
  if (res.status !== 200) {
    throw new Error(`Login failed: ${res.body.error || 'Invalid credentials'}`);
  }
  const token = res.body.data?.token;
  if (!token) {
    throw new Error('No token returned from login');
  }
  return token;
};

export const createTestProject = async (token: string, overrides: any = {}) => {
  const res = await request(app)
    .post('/api/v1/admin/projects')
    .set('Authorization', `Bearer ${token}`)
    .send({
      slug: `test-${Date.now()}`,
      title: 'Test Project',
      tag: '練習專案',
      one_liner: '測試專案',
      ...overrides,
    });
  if (res.status !== 201) {
    throw new Error(`Failed to create test project: ${res.body.error}`);
  }
  return res.body.data;
};