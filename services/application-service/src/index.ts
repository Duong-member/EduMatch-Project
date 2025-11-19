// ======================================================
// 🧩 IMPORT CÁC THƯ VIỆN CẦN THIẾT
// ======================================================
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { prisma } from './db/prisma'; // ✅ THÊM: (Tùy chọn) Import prisma nếu bạn muốn kiểm tra kết nối
import applicationRoutes from './routes/application.routes';

// ======================================================
// ⚙️ KHỞI TẠO ỨNG DỤNG EXPRESS
// ======================================================
const app = express();
const port = process.env.PORT || 4002;

// Middleware cho phép CORS & parse JSON 
app.use(cors());
app.use(express.json());

// Middleware log các request để dễ debug
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ======================================================
// 🛣️ ĐĂNG KÝ CÁC ROUTE CHÍNH
// ======================================================
app.use('/api/application', applicationRoutes);

// Route kiểm tra hoạt động cơ bản
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({ message: '✅ Application Service đang hoạt động!' });
});

// ======================================================
// 🧯 MIDDLEWARE XỬ LÝ LỖI TOÀN CỤC
// ======================================================
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[Application-Service] Lỗi:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// ======================================================
// 🚀 KHỞI CHẠY SERVER
// ======================================================
app.listen(port, async () => {
  console.log(`[Application-Service]: Server đang chạy tại http://localhost:${port}`);

  try {
    // Kiểm tra kết nối MySQL
    await prisma.$connect();
    console.log('[Application-Service] ✅ Đã kết nối MySQL (Prisma) thành công:');
  } catch (error) {
    console.error('[Application-Service] ❌ Lỗi kết nối MySQL (Prisma):', error);
  }
});
export { prisma };