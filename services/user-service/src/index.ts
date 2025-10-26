import express from 'express';
// Import thư viện mysql2 (bản promise-based)
import mysql from 'mysql2/promise';

// --- Cấu hình Kết nối CSDL ---
// Chúng ta sẽ dùng connection pool để quản lý kết nối hiệu quả
const dbPool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
  port: Number(process.env.MYSQL_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

console.log('[User-Service] Đang cố gắng kết nối tới MySQL...');

// --- Khởi tạo Server ---
const app = express();
const port = process.env.PORT || 8001;

app.use(express.json());

// --- Định nghĩa Routes (API) ---

// API "Hello World"
app.get('/api/users/hello', (req, res) => {
  res.status(200).json({ message: 'Hello from User Service!' });
});

// API kiểm tra kết nối CSDL
app.get('/api/users/db-test', async (req, res) => {
  try {
    // Thử chạy 1 câu query đơn giản
    const [results] = await dbPool.query('SELECT 1 + 1 AS solution');
    res.status(200).json({
      message: 'Kết nối CSDL thành công!',
      data: results
    });
  } catch (error) {
    console.error('[User-Service] Lỗi kết nối CSDL:', error);
    res.status(500).json({ error: 'Không thể kết nối CSDL' });
  }
});

// --- Chạy Server ---
app.listen(port, () => {
  console.log(`[User-Service]: Server đang chạy tại http://localhost:${port}`);
});