import { Router, Request, Response } from 'express';
import { dbPool } from '../db';

const router = Router();

// 🟢 1. API nộp đơn (POST)
router.post('/', async (req: Request, res: Response) => {
  const { student_id, opportunity_id } = req.body;

  if (!student_id || !opportunity_id) {
    return res.status(400).json({ error: 'Thiếu thông tin cần thiết' });
  }

  try {
    const [result] = await dbPool.query(
      'INSERT INTO applications (student_id, opportunity_id, status) VALUES (?, ?, ?)',
      [student_id, opportunity_id, 'pending']
    );

    res.status(201).json({ message: 'Nộp đơn thành công', result });
  } catch (error) {
    console.error('[Application-Service] Lỗi khi nộp đơn:', error);
    res.status(500).json({ error: 'Không thể nộp đơn' });
  }
});

// 🟡 2. Lấy danh sách đơn (GET)
router.get('/', async (_req: Request, res: Response) => {
  try {
    const [rows] = await dbPool.query('SELECT * FROM applications ORDER BY created_at DESC');
    res.status(200).json(rows);
  } catch (error) {
    console.error('[Application-Service] Lỗi khi lấy danh sách:', error);
    res.status(500).json({ error: 'Không thể lấy dữ liệu' });
  }
});

// 🟠 3. Lấy chi tiết 1 đơn (GET /:id)
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const [rows]: any = await dbPool.query('SELECT * FROM applications WHERE application_id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Không tìm thấy hồ sơ' });
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('[Application-Service] Lỗi khi xem chi tiết:', error);
    res.status(500).json({ error: 'Không thể xem chi tiết hồ sơ' });
  }
});

// 🔵 4. Cập nhật trạng thái hồ sơ (PUT /:id/status)
router.put('/:id/status', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['pending', 'approved', 'rejected', 'interview'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Trạng thái không hợp lệ' });
  }

  try {
    await dbPool.query('UPDATE applications SET status = ? WHERE application_id = ?', [status, id]);
    res.status(200).json({ message: 'Cập nhật trạng thái thành công' });
  } catch (error) {
    console.error('[Application-Service] Lỗi khi cập nhật trạng thái:', error);
    res.status(500).json({ error: 'Không thể cập nhật trạng thái' });
  }
});

export default router;
