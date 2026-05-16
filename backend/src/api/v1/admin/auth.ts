import { Router } from 'express';
import { AdminController } from '../../../controllers/adminController';

const router = Router();
router.post('/login', AdminController.login);
export default router;