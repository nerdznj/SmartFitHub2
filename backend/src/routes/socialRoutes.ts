
import { Router } from 'express';
import { getFeed, createPost } from '../controllers/socialController';
import { protect } from '../middleware/auth';

const router = Router();

router.get('/feed', protect, getFeed);
router.post('/posts', protect, createPost);

export default router;
