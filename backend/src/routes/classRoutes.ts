
import { Router } from 'express';
import { getClasses, bookClass } from '../controllers/classController';
import { protect } from '../middleware/auth';

const router = Router();

router.get('/', getClasses);
router.post('/book', protect, bookClass);

export default router;
