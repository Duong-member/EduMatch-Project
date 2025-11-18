import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/UserRepository";
import { User } from "../models/User";

export class UserService {
  constructor(private userRepo: UserRepository) {}

  async register(user: User) {
    const existed = await this.userRepo.findByEmail(user.email);
    if (existed) throw new Error("Email đã tồn tại");

    const hashed = await bcrypt.hash(user.password, 10);

    const createdUser = await this.userRepo.create({
      ...user,
      password: hashed,
    });

    return {
      message: "Đăng ký thành công",
      user: createdUser,
    };
  }

  async login(email: string, password: string) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new Error("Sai email hoặc mật khẩu");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Sai email hoặc mật khẩu");

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "DEFAULT_SECRET",
      { expiresIn: "1d" }
    );

    return {
      message: "Đăng nhập thành công",
      user,
      token,
    };
  }
  async getUserById(id: string) {
    const user = await this.userRepo.findById(id);
    if (!user) throw new Error("Người dùng không tồn tại");
    // Ẩn mật khẩu trước khi trả về
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
