export interface User {
  id?: string;       // Prisma id = string uuid, không phải number
  email: string;
  password: string;
  role: 'student' | 'professor' | 'admin';
  name?: string;
  createdAt?: Date;
}
