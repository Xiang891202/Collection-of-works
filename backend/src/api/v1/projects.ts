import { Router } from 'express';
import { ProjectController } from '../../controllers/projectController';

const router = Router();

// GET /api/v1/projects
router.get('/', ProjectController.getProjectList);

// GET /api/v1/projects/:slug?mode=showcase|professional|professional-summary|case-study|case-study-preview
router.get('/:slug', ProjectController.getProjectByMode);

export default router;