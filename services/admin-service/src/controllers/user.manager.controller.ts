import { Request, Response } from 'express';
import axios from 'axios';
import { prisma } from '../db/prisma';
import { AuthRequest } from '../middlewares/auth.middleware'; // Import interface AuthRequest để lấy thông tin Admin

export class UserManagerController {

  // API: Thay đổi trạng thái User (Khóa/Mở)
  changeUserStatus = async (req: AuthRequest, res: Response) => {
    const { id } = req.params; // ID của user bị khóa
    const { isActive, reason } = req.body; // Trạng thái mới và lý do

    // Validate đầu vào
    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ message: 'isActive phải là true hoặc false' });
    }

    const adminId = req.user?.id || 'unknown_admin'; // Lấy ID của Admin đang đăng nhập

    try {
      // 1. Gọi sang User Service để cập nhật DB
      const USER_URL = process.env.USER_SERVICE_URL || 'http://user-service:8001';
      
      // Gọi API: PUT /api/users/:id/status
      await axios.put(`${USER_URL}/api/users/${id}/status`, { isActive });

      // 2. Ghi Nhật ký (Audit Log) - QUAN TRỌNG
      // Đây là bằng chứng cho thấy Admin này đã thực hiện hành động
      await prisma.adminLog.create({
        data: {
          adminId: adminId,
          action: isActive ? 'UNBAN_USER' : 'BAN_USER', // Hành động
          targetId: id,                                 // Đối tượng bị tác động
          details: JSON.stringify({ reason: reason || 'Không có lý do' }) // Chi tiết
        }
      });

      res.json({ 
        success: true, 
        message: `Đã ${isActive ? 'mở khóa' : 'khóa'} tài khoản thành công` 
      });

    } catch (error: any) {
      console.error('[UserManager] Lỗi:', error.message);
      res.status(500).json({ 
        message: 'Lỗi khi cập nhật trạng thái user', 
        error: error.response?.data?.error || error.message 
      });
    }
  };
}