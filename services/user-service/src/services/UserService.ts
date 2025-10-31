import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/UserRepository";
import { User } from "../models/User";

export class UserService {
  constructor(private userRepo: UserRepository) {}

  async register(user: User) {
    const existed = await this.userRepo.findByEmail(user.email);
    if (existed) throw new Error('Email đã tồn tại');

    // Hash password
    const hashed = await bcrypt.hash(user.password, 10);
    user.password = hashed;

    return this.userRepo.create(user);
  }

  async login(email: string, password: string) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new Error("Sai email hoặc mật khẩu");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Sai email hoặc mật khẩu");

    // Tạo JWT Token
    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      process.env.JWT_SECRET || "DEFAULT_SECRET",
      { expiresIn: "1d" }
    );

    return { user, token };
  }
}
