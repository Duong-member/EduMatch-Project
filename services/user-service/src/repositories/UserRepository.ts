import { PrismaClient } from "@prisma/client";
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
}
