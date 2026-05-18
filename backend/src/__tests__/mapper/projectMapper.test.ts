import { ProjectMapper } from '../../mappers/projectMapper';

describe('ProjectMapper', () => {
  it('應將資料庫列轉換為卡片 DTO', () => {
    const row = {
      id: '123',
      slug: 'test',
      title: 'Test',
      tag: '練習專案',
      thumbnail_url: 'http://img.com/a.jpg',
      one_liner: 'Short desc',
      demo_url: 'http://demo.com',
      github_url: 'http://github.com',
    };
    const dto = ProjectMapper.toCardDTO(row);
    expect(dto).toEqual({
      id: '123',
      slug: 'test',
      title: 'Test',
      tag: '練習專案',
      thumbnailUrl: 'http://img.com/a.jpg',
      oneLiner: 'Short desc',
      demoUrl: 'http://demo.com',
      githubUrl: 'http://github.com',
    });
  });
});