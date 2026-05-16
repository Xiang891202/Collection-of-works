import { supabaseAdmin } from '../config/supabase';
import { AppError } from '../utils/appError';
import path from 'path';

export class UploadService {
  async uploadImage(file: Express.Multer.File, projectId: string): Promise<string> {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    const safeName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
    const fileName = `${projectId}/${safeName}`;

    const { error } = await supabaseAdmin.storage
      .from('project-images')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) throw new AppError(`Upload failed: ${error.message}`, 500);

    const { data: urlData } = supabaseAdmin.storage
      .from('project-images')
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  }

  // ✅ 新增：刪除圖片
  async deleteImage(projectId: string, imageUrl: string): Promise<void> {
    // 從 URL 中提取檔案路徑（例如：project-images/123/xxx.jpg）
    const urlObj = new URL(imageUrl);
    const pathParts = urlObj.pathname.split('/');
    // 格式：/storage/v1/object/public/project-images/projectId/filename.jpg
    const projectImagesIndex = pathParts.findIndex(part => part === 'project-images');
    if (projectImagesIndex === -1) throw new AppError('Invalid image URL', 400);
    
    const filePath = pathParts.slice(projectImagesIndex + 1).join('/');
    if (!filePath.startsWith(`${projectId}/`)) {
      throw new AppError('Image does not belong to this project', 403);
    }

    const { error } = await supabaseAdmin.storage
      .from('project-images')
      .remove([filePath]);

    if (error) throw new AppError(`Delete failed: ${error.message}`, 500);
  }
}