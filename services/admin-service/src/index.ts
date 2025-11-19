import express from 'express';
import cors from 'cors';
import adminRoutes from './routes/admin.routes';
import { prisma } from './db/prisma';

const app = express();
const port = process.env.PORT || 8006;

app.use(cors());
app.use(express.json());

app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Admin Service is running' });
});

app.listen(port, async () => {
  console.log(`[Admin-Service] Running at http://localhost:${port}`);
  try {
    await prisma.$connect();
    console.log('[Admin-Service] Connected to Admin DB');
  } catch (err) {
    console.error('[Admin-Service] DB Connection Error:', err);
  }
});