import { Request, Response, NextFunction } from 'express';
import { ProjectService } from '../services/projectService';
import { ResponseBuilder } from '../services/responseBuilder';

const projectService = new ProjectService();

export class ProjectController {
  // GET /api/v1/projects
  static async getProjectList(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await projectService.getProjectList();
      res.json(ResponseBuilder.success(data, 'showcase'));
    } catch (err) {
      next(err);
    }
  }

  // GET /api/v1/projects/:slug?mode=showcase|professional|...
  static async getProjectByMode(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      const mode = (req.query.mode as string) || 'showcase';
      const data = await projectService.getByMode(slug, mode);
      res.json(ResponseBuilder.success(data, mode, slug));
    } catch (err) {
      next(err);
    }
  }
}