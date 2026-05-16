import { Router } from 'express';
import { ProjectController } from '../../controllers/projectController';
import { AdminController } from '../../controllers/adminController';

const router = Router();

// GET /api/v1/projects
router.get('/', ProjectController.getProjectList);

// GET /api/v1/projects/:slug?mode=showcase|professional|professional-summary|case-study|case-study-preview
router.get('/:slug', ProjectController.getProjectByMode);

// 加入這一行 (放在 restore 之後)
router.patch('/:id/publish', AdminController.publishProject);

export default router;