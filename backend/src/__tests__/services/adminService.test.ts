import { AdminService } from '../../services/adminService';
import { ProjectRepository } from '../../repositories/projectRepository';
import { ContentRepository } from '../../repositories/contentRepository';

jest.mock('../../repositories/projectRepository');
jest.mock('../../repositories/contentRepository');

describe('AdminService', () => {
  let adminService: AdminService;
  let mockProjectRepo: jest.Mocked<ProjectRepository>;
  let mockContentRepo: jest.Mocked<ContentRepository>;

  beforeEach(() => {
    mockProjectRepo = new ProjectRepository() as any;
    mockContentRepo = new ContentRepository() as any;
    adminService = new AdminService();
    (adminService as any).projectRepo = mockProjectRepo;
    (adminService as any).contentRepo = mockContentRepo;
  });

  describe('publish', () => {
    it('應成功將專案從草稿改為已發布', async () => {
      const mockProject = { id: '1', status: 'draft', published_at: null };
      // 第一次 findById 返回草稿專案
      mockProjectRepo.findById.mockResolvedValueOnce(mockProject);
      mockProjectRepo.updateStatusAndPublishedAt.mockResolvedValue(undefined);
      // 第二次 findById（更新後）返回已發布專案
      mockProjectRepo.findById.mockResolvedValueOnce({ ...mockProject, status: 'active', published_at: '2025-01-01T00:00:00Z' });

      const result = await adminService.publish('1', 'active', '2025-01-01T00:00:00Z');
      expect(result.status).toBe('active');
      expect(mockProjectRepo.updateStatusAndPublishedAt).toHaveBeenCalledWith('1', 'active', '2025-01-01T00:00:00Z');
    });

    it('若專案已刪除，應拋出錯誤', async () => {
      mockProjectRepo.findById.mockResolvedValue({ id: '1', status: 'deleted' });
      await expect(adminService.publish('1', 'active', null)).rejects.toThrow('Cannot change status of deleted project');
    });
  });
});