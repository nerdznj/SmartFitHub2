
import { Router } from 'express';
import { check, validationResult } from 'express-validator';
import { register, login } from '../controllers/authController';

const router = Router();

// Validation Middleware
const validate = (req: any, res: any, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

router.post(
  '/register',
  [
    check('fullName', 'نام کامل الزامی است').not().isEmpty().trim().escape(),
    check('phone', 'شماره موبایل معتبر نیست').isMobilePhone('ir-IR'),
    check('password', 'رمز عبور باید حداقل ۶ کاراکتر باشد').isLength({ min: 6 }),
    check('email', 'ایمیل معتبر نیست').optional().isEmail().normalizeEmail()
  ],
  validate,
  register
);

router.post(
  '/login',
  [
    check('identifier', 'شماره موبایل یا ایمیل الزامی است').not().isEmpty(),
    check('password', 'رمز عبور الزامی است').exists()
  ],
  validate,
  login
);

export default router;
