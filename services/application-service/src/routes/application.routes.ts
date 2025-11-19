// services/application-service/src/routes/application.routes.ts
import { Router } from 'express';
import { ApplicationRepository } from '../repositories/application.repository';
import { ApplicationService } from '../services/application.service';
import { ApplicationController } from '../controllers/application.controller';

const router = Router();

// Khởi tạo (Dependency Injection)
const repository = new ApplicationRepository();
const service = new ApplicationService(repository);
const controller = new ApplicationController(service);

// Gắn routes
router.post('/', controller.createApplication);
router.get('/:id', controller.getApplication);
router.put('/:id/status', controller.updateStatus);
// (Thêm các routes khác nếu cần, ví dụ: GET /)

export default router