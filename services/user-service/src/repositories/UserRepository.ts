import { PrismaClient } from '../generated/client';
import { User } from "../models/User";

const prisma = new PrismaClient();

export class UserRepository {
  async create(user: User) {
    return prisma.user.create({
      data: {
        email: user.email,
        password: user.password,
        role: user.role,
        name: user.name || null
      },
    });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }
  async findById(id: string) { 
    return prisma.user.findUnique({
      where: { id },
    });
  }

  // ✅ Hàm mới: Đếm tổng số user (Dùng cho Dashboard)
  async count() {
    return prisma.user.count();
  }

  // ✅ Hàm mới: Lấy danh sách user (Có phân trang)
  async findAll(skip: number, take: number) {
    return prisma.user.findMany({
      skip,
      take,
      select: { // Chỉ lấy các trường cần thiết, KHÔNG lấy password
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ✅ Hàm mới: Cập nhật trạng thái (Khóa/Mở khóa)
  async updateStatus(id: string, isActive: boolean) {
    return prisma.user.update({
      where: { id },
      data: { isActive },
    });
  }
}
