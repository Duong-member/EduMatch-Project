// services/opportunity-service/src/index.ts
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import opportunityRoutes from './routes/opportunity.routes';
import { prisma } from './db/prisma';

dotenv.config(); // Tải biến .env

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Logger middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Đăng ký routes chính
app.use('/api/opportunities', opportunityRoutes);

// Route cơ bản (thay thế cho /api/login giả lập)
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({ message: '✅ Opportunity Service đang hoạt động!' });
});

// Middleware xử lý lỗi
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[Opportunity-Service] Lỗi:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(port, async () => {
  console.log(`[Opportunity-Service]: Server đang chạy tại http://localhost:${port}`);
  try {
    await prisma.$connect();
    console.log('[Opportunity-Service] ✅ Đã kết nối MySQL (Prisma) thành công.');
  } catch (error) {
    console.error('[Opportunity-Service] ❌ Lỗi kết nối MySQL (Prisma):', error);
  }
});