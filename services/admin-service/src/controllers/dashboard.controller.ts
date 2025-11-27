import { Request, Response } from 'express';
import axios from 'axios';

export class DashboardController {
  
  // GET /dashboard
  getStats = async (req: Request, res: Response) => {
    // 1. Lấy URL từ biến môi trường
    const USER_URL = process.env.USER_SERVICE_URL || 'http://user-service:8001';
    const OPP_URL = process.env.OPP_SERVICE_URL || 'http://opportunity-service:3000';
    const APP_URL = process.env.APP_SERVICE_URL || 'http://application-service:4002';

    try {
      // 2. Gọi song song 3 API lấy dữ liệu thật
      const [userRes, oppRes, appRes] = await Promise.all([
        axios.get(`${USER_URL}/api/users/stats`), // Gọi route /stats mới tạo
        axios.get(`${OPP_URL}/api/opportunities/count`),
        axios.get(`${APP_URL}/api/application/count`)
      ]);

      const userStats = userRes.data; // { total: 100, breakdown: { student: 70, professor: 20... } }

      // 3. Trả về JSON gọn gàng
      res.json({
        success: true,
        data: {
          totalUsers: userStats.total,
          totalOpportunities: oppRes.data.count,
          totalApplications: appRes.data.count,
          // Dữ liệu phân bố cho biểu đồ
          userDistribution: {
            student: userStats.breakdown['student'] || 0,
            professor: userStats.breakdown['professor'] || 0,
            admin: userStats.breakdown['admin'] || 0
          }
        }
      });

    } catch (error: any) {
      console.error('[Dashboard Error]', error.message);
      res.status(500).json({ message: 'Lỗi lấy dữ liệu thống kê', error: error.message });
    }
  };
}
