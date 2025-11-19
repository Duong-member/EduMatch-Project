// services/opportunity-service/src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Mở rộng kiểu Request của Express để chứa thông tin 'user'
export interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

export const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'Không có token, yêu cầu xác thực' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'DEFAULT_SECRET';
    const decoded = jwt.verify(token, secret) as { id: string; role: string };
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token không hợp lệ' });
  }
};

export const isProfessor = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'professor') {
    return res.status(403).json({ message: 'Chỉ giáo sư mới được phép thực hiện' });
  }
  next();
};