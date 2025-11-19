import { Request, Response } from 'express';
import axios from 'axios';

export class DashboardController {
  
  // GET /stats
  getStats = async (req: Request, res: Response) => {
    try {
      console.log('[Dashboard] Đang tổng hợp dữ liệu từ các microservices...');

      // Lấy URL từ biến môi trường (sẽ cấu hình trong docker-compose)
      const USER_URL = process.env.USER_SERVICE_URL || 'http://user-service:8001';
      const OPP_URL = process.env.OPP_SERVICE_URL || 'http://opportunity-service:3000';
      const APP_URL = process.env.APP_SERVICE_URL || 'http://application-service:4002';

      // Gọi song song 3 API để tiết kiệm thời gian
      const [usersRes, oppsRes, appsRes] = await Promise.all([
        axios.get(`${USER_URL}/api/users/count`),
        axios.get(`${OPP_URL}/api/opportunities/count`),
        axios.get(`${APP_URL}/api/application/count`)
      ]);

      // Trả về kết quả tổng hợp cho Frontend
      res.json({
        success: true,
        data: {
          totalUsers: usersRes.data.count,
          totalOpportunities: oppsRes.data.count,
          totalApplications: appsRes.data.count,
          updatedAt: new Date()
        }
      });

    } catch (error: any) {
      console.error('[Dashboard] Lỗi tổng hợp:', error.message);
      // Nếu 1 service chết, ta vẫn trả về lỗi nhưng không làm sập admin
      res.status(500).json({ 
        message: 'Không thể lấy dữ liệu thống kê', 
        error: error.message 
      });
    }
  };
}