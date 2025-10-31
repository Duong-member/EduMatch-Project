import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import dbPool from './dbPool';
import userRoutes from "./routes/userRoutes";

dotenv.config({ path: __dirname + '/../.env' });

const app = express();
const port = process.env.PORT || 8001;

app.use(express.json());

// Gắn route ở đây (sau khi app được khai báo)
app.use("/api/users", userRoutes);

// --- API hello ---
app.get('/api/users/hello', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Hello from User Service!' });
});

// --- API test DB ---
app.get('/api/users/db-test', async (req: Request, res: Response) => {
  try {
    const [results] = await dbPool.query('SELECT 1 + 1 AS solution');
    res.status(200).json({
      message: 'Kết nối CSDL thành công!',
      data: results
    });
  } catch (error: any) {
    console.error('❌ [DB ERROR]:', error);
    res.status(500).json({
      error: 'Không thể kết nối CSDL',
      details: error.message
    });
  }
});

// --- Start Server ---
app.listen(port, () => {
  console.log(`[User-Service]: Server đang chạy tại http://localhost:${port}`);
});
