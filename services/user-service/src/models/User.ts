export interface User {
  user_id?: number;        // optional vì khi insert chưa có
  email: string;
  password: string;
  role: 'student' | 'professor' | 'admin';
}
