
import { Router } from 'express';
import { createAiPlan, getMyPlan } from '../controllers/trainingController';
import { protect } from '../middleware/auth';

const router = Router();

router.post('/generate', protect, createAiPlan);
router.get('/current', protect, getMyPlan);

export default router;
