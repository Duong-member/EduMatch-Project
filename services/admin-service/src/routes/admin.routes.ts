import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import { auth, isAdmin } from '../middlewares/auth.middleware';
import { UserManagerController } from '../controllers/user.manager.controller';

const router = Router();
const dashboardController = new DashboardController();
const userManagerController = new UserManagerController();

// Áp dụng cho TOÀN BỘ các route bên dưới
router.use(auth);    // Bắt buộc phải có Token
router.use(isAdmin); // Bắt buộc phải là Admin

router.get('/dashboard', dashboardController.getStats);
router.patch('/users/:id/status', userManagerController.changeUserStatus);
export default router;