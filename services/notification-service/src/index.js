const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const notifyRouter = require('../routes/notify');

const app = express();
const server = http.createServer(app);

// Cho phép CORS
app.use(cors({ origin: '*', methods: ['GET', 'POST'] }));
app.use(express.json());

// Tạo Socket.IO server gắn vào HTTP server
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Lắng nghe kết nối socket
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) {
    const room = `user:${userId}`;
    socket.join(room);
    console.log(`Socket ${socket.id} joined room`, room);
  }

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Gắn io vào req để router dùng được
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Route test nhanh
app.get('/', (req, res) => {
  res.json({ message: 'Notification service is running' });
});

// Route nhận notify
app.use('/api/notify', notifyRouter);

const PORT = process.env.PORT || 8090;
server.listen(PORT, () => {
  console.log(`Notification service listening on port ${PORT}`);
});
