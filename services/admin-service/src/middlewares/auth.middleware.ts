// services/admin-service/src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Mở rộng kiểu Request để TypeScript nhận biết biến 'user'
export interface AuthRequest extends Request {
  user?: { 
    id: string; 
    role: string; 
    email: string 
  };
}

// 1. Middleware xác thực Token (Đăng nhập chưa?)
export const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Không có token, quyền truy cập bị từ chối' });
  }

  try {
    // Lấy JWT_SECRET từ biến môi trường (phải khớp với user-service)
    const secret = process.env.JWT_SECRET || 'supersecret123456';
    
    // Giải mã token
    const decoded = jwt.verify(token, secret) as { id: string; role: string; email: string };
    
    // Gán thông tin user vào request để các hàm sau dùng
    req.user = decoded;
    
    next(); // Cho phép đi tiếp
  } catch (err) {
    res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
  }
};

// 2. Middleware kiểm tra quyền Admin (Có phải sếp không?)
export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  // Kiểm tra xem role trong token có phải là 'admin' không
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Truy cập bị chặn. Chỉ dành cho Admin.' });
  }
  next();
};