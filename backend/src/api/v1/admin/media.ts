import { Router } from 'express';
import { UploadController } from '../../../controllers/uploadController';
import { authMiddleware, adminGuard } from '../../../middleware/auth';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();
router.use(authMiddleware, adminGuard);

router.post('/:projectId/upload', upload.single('image'), UploadController.upload);
router.delete('/:projectId', UploadController.deleteImage);  // ✅ 新增：根據 URL query 刪除

export default router;