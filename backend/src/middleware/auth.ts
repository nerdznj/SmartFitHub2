
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

export interface AuthRequest extends Request {
  user?: User;
  headers: any;
  body: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      
      const user = await User.findByPk(decoded.id);
      if (!user) {
        return res.status(401).json({ success: false, message: 'کاربر یافت نشد' });
      }

      req.user = user;
      next();
      return;
    } catch (error) {
      console.error(error);
      res.status(401).json({ success: false, message: 'توکن نامعتبر است' });
      return;
    }
  }

  if (!token) {
    res.status(401).json({ success: false, message: 'لطفا وارد شوید' });
  }
};
