// opportunities.js
const express = require('express');
const router = express.Router();
const db = require('./db');
const { auth, isProfessor } = require('./auth');

// === POST: Tạo cơ hội ===
router.post('/', auth, isProfessor, async (req, res) => {
  const { title, description, deadline, category } = req.body;
  const professor_id = req.user.id;

  if (!title || !deadline) {
    return res.status(400).json({ message: 'Thiếu title hoặc deadline' });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO opportunities (title, description, deadline, category, professor_id)
       VALUES (?, ?, ?, ?, ?)`,
      [title, description || null, deadline, category || null, professor_id]
    );
    res.status(201).json({ opportunity_id: result.insertId, message: 'Tạo thành công' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server khi tạo cơ hội.' });
  }
});

// === GET: Lấy danh sách (tìm kiếm, lọc) ===
router.get('/', async (req, res) => {
  const { category, deadline, search, page = 1, limit = 10 } = req.query;
  let query = 'SELECT * FROM opportunities WHERE 1=1';
  let params = [];

  if (category) { query += ' AND category = ?'; params.push(category); }
  if (deadline) { query += ' AND deadline <= ?'; params.push(deadline); }
  if (search) { query += ' AND title LIKE ?'; params.push(`%${search}%`); }

  const offset = (page - 1) * limit;
  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit), offset);

  try {
    const [results] = await db.query(query, params);
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server khi tìm kiếm cơ hội.' });
  }
});

// === GET: Lấy cơ hội của tôi ===
router.get('/my', auth, isProfessor, async (req, res) => {
  try {
    const [results] = await db.query(
      'SELECT * FROM opportunities WHERE professor_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// === GET: Xem chi tiết ===
router.get('/:id', async (req, res) => {
  try {
    const [results] = await db.query(
      'SELECT * FROM opportunities WHERE opportunity_id = ?',
      [req.params.id]
    );
    if (results.length === 0) return res.status(404).json({ message: 'Không tìm thấy' });
    res.json(results[0]);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// === PUT: Sửa ===
router.put('/:id', auth, isProfessor, async (req, res) => {
  const { id } = req.params;
  const { title, description, deadline, category } = req.body;

  try {
    const [check] = await db.query(
      'SELECT * FROM opportunities WHERE opportunity_id = ? AND professor_id = ?',
      [id, req.user.id]
    );
    if (check.length === 0) return res.status(404).json({ message: 'Không có quyền' });

    await db.query(
      `UPDATE opportunities SET title = ?, description = ?, deadline = ?, category = ?, updated_at = NOW()
       WHERE opportunity_id = ?`,
      [title || check[0].title, description ?? check[0].description, deadline || check[0].deadline, category ?? check[0].category, id]
    );
    res.json({ message: 'Cập nhật thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// === DELETE: Xóa ===
router.delete('/:id', auth, isProfessor, async (req, res) => {
  const { id } = req.params;
  try {
    const [check] = await db.query(
      'SELECT * FROM opportunities WHERE opportunity_id = ? AND professor_id = ?',
      [id, req.user.id]
    );
    if (check.length === 0) return res.status(404).json({ message: 'Không có quyền' });

    await db.query('DELETE FROM opportunities WHERE opportunity_id = ?', [id]);
    res.json({ message: 'Xóa thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
});

module.exports = router;