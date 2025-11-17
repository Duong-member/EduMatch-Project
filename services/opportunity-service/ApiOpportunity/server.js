// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const opportunityRoutes = require('./opportunities.js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Login giả lập (test)
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'prof@gmail.com' && password === '123') {
    const token = jwt.sign({ id: 1, role: 'professor' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.json({ token });
  }
  if (email === 'student@gmail.com' && password === '123') {
    const token = jwt.sign({ id: 2, role: 'student' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.json({ token });
  }
  res.status(401).json({ message: 'Sai thông tin' });
});

// Routes
app.use('/api/opportunities', opportunityRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'EduMatch API - Chạy thành công!' });
});

app.listen(PORT, () => {
  console.log(`Server chạy tại http://localhost:${PORT}`);
});