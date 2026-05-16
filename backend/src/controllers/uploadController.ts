import { Request, Response, NextFunction } from 'express';
import { UploadService } from '../services/uploadService';
import { ResponseBuilder } from '../services/responseBuilder';

const uploadService = new UploadService();

export class UploadController {
  static async upload(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        return res.status(400).json(ResponseBuilder.error('No file uploaded'));
      }
      const url = await uploadService.uploadImage(req.file, req.params.projectId);
      res.json(ResponseBuilder.success({ url }, 'admin'));
    } catch (err) {
      next(err);
    }
  }

  // ✅ 新增：刪除圖片
  static async deleteImage(req: Request, res: Response, next: NextFunction) {
    try {
      const { url } = req.query;
      const { projectId } = req.params;
      if (!url || typeof url !== 'string') {
        return res.status(400).json(ResponseBuilder.error('Missing image URL'));
      }
      await uploadService.deleteImage(projectId, url);
      res.json(ResponseBuilder.success(null, 'admin'));
    } catch (err) {
      next(err);
    }
  }
}