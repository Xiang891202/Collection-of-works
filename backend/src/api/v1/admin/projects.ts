import { Router } from 'express';
import { AdminController } from '../../../controllers/adminController';
import { authMiddleware, adminGuard } from '../../../middleware/auth';

const router = Router();
router.use(authMiddleware, adminGuard);

router.get('/', AdminController.getProjects);
router.get('/:id', AdminController.getProject);
router.post('/', AdminController.createProject);
router.put('/:id', AdminController.updateProject);
router.put('/:id/showcase', AdminController.updateShowcase);
router.put('/:id/professional', AdminController.updateProfessional);
router.put('/:id/case-study', AdminController.updateCaseStudy);
router.delete('/:id', AdminController.deleteProject);
router.patch('/:id/restore', AdminController.restoreProject);
router.patch('/:id/publish', AdminController.publishProject);

export default router;