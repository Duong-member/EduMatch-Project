// services/opportunity-service/src/routes/opportunity.routes.ts
import { Router } from 'express';
import { OpportunityRepository } from '../repositories/opportunity.repository';
import { OpportunityService } from '../services/opportunity.service';
import { OpportunityController } from '../controllers/opportunity.controller';
import { auth, isProfessor } from '../middlewares/auth.middleware';

const router = Router();

// Khởi tạo (Dependency Injection)
const repository = new OpportunityRepository();
const service = new OpportunityService(repository);
const controller = new OpportunityController(service);

// Định tuyến các API
// (Ánh xạ từ file opportunities.js cũ)
router.post('/', auth, isProfessor, controller.create);
router.get('/', controller.search);
router.get('/my', auth, isProfessor, controller.getMyOpportunities);
router.get('/:id', controller.getById);
router.put('/:id', auth, isProfessor, controller.update);
router.delete('/:id', auth, isProfessor, controller.delete);

export default router;