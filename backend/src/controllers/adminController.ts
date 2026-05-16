import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import { AdminService } from '../services/adminService';
import { ResponseBuilder } from '../services/responseBuilder';

const authService = new AuthService();
const adminService = new AdminService();

export class AdminController {
  // 登入
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const dto = await authService.login(email, password);
      res.json(ResponseBuilder.success(dto, 'admin'));
    } catch (err) {
      next(err);
    }
  }

  // 取得所有專案
  static async getProjects(req: Request, res: Response, next: NextFunction) {
    try {
      const status = req.query.status as string;
      const data = await adminService.getProjectList(status);
      res.json(ResponseBuilder.success(data, 'admin'));
    } catch (err) {
      next(err);
    }
  }

  // 取得單一專案
  static async getProject(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await adminService.getProjectDetail(req.params.id);
      res.json(ResponseBuilder.success(data, 'admin'));
    } catch (err) {
      next(err);
    }
  }

  // 新增專案
  static async createProject(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await adminService.createProject(req.body);
      res.status(201).json(ResponseBuilder.success(data, 'admin'));
    } catch (err) {
      next(err);
    }
  }

  // 更新專案主表
  static async updateProject(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await adminService.updateProjectMeta(req.params.id, req.body);
      res.json(ResponseBuilder.success(data, 'admin'));
    } catch (err) {
      next(err);
    }
  }

  // 更新 showcase
  static async updateShowcase(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await adminService.updateShowcase(req.params.id, req.body);
      res.json(ResponseBuilder.success(data, 'showcase'));
    } catch (err) {
      next(err);
    }
  }

  // 更新 professional
  static async updateProfessional(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await adminService.updateProfessional(req.params.id, req.body);
      res.json(ResponseBuilder.success(data, 'professional'));
    } catch (err) {
      next(err);
    }
  }

  // 更新 case study
  static async updateCaseStudy(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await adminService.updateCaseStudy(req.params.id, req.body);
      res.json(ResponseBuilder.success(data, 'case-study'));
    } catch (err) {
      next(err);
    }
  }

  // 軟刪除
  static async deleteProject(req: Request, res: Response, next: NextFunction) {
    try {
      await adminService.softDelete(req.params.id);
      res.json(ResponseBuilder.success(null, 'admin'));
    } catch (err) {
      next(err);
    }
  }

  // 復原
  static async restoreProject(req: Request, res: Response, next: NextFunction) {
    try {
      await adminService.restore(req.params.id);
      res.json(ResponseBuilder.success(null, 'admin'));
    } catch (err) {
      next(err);
    }
  }

  static async publishProject(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, published_at } = req.body;
      const result = await adminService.publish(req.params.id, status, published_at);
      res.json(ResponseBuilder.success(result, 'admin'));
    } catch (err) {
      next(err);
    }
  }
}