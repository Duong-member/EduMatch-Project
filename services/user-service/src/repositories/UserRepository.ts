import { Pool } from 'mysql2/promise';
import { User } from '../models/User';

export class UserRepository {
  private db: Pool;

  constructor(dbPool: Pool) {
    this.db = dbPool;
  }

  async create(user: User) {
    const sql = `INSERT INTO useraccount (email, password, role) VALUES (?, ?, ?)`;
    const [result] = await this.db.execute(sql, [user.email, user.password, user.role]);
    return result;
  }

  async findByEmail(email: string) {
    const sql = `SELECT * FROM useraccount WHERE email = ?`;
    const [rows]: any = await this.db.execute(sql, [email]);
    return rows[0];
  }
}
