import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const dbPool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
  port: Number(process.env.MYSQL_PORT) || 3306,
});

export default dbPool;
