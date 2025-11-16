// auth.js
require('dotenv').config();
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Không có token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token không hợp lệ' });
  }
};

const isProfessor = (req, res, next) => {
  if (req.user.role !== 'professor') {
    return res.status(403).json({ message: 'Chỉ giáo sư mới được phép' });
  }
  next();
};

module.exports = { auth, isProfessor };