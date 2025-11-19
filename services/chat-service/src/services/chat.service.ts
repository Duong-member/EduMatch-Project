import { PrismaClient } from "@prisma/client";

export interface CreateMessageDTO {
  senderId: number | string;
  receiverId?: number | string | null;
  roomId?: string | null;
  content: string;
}

class ChatService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createMessage(data: CreateMessageDTO) {
    if (!data.senderId || !data.content) {
      throw new Error("senderId and content are required");
    }

    const payload = {
      senderId: Number(data.senderId),
      receiverId:
        data.receiverId !== undefined && data.receiverId !== null
          ? Number(data.receiverId)
          : null,
      roomId: data.roomId ?? null,
      content: data.content,
    };

    // ❗ ÉP KIỂU ĐỂ BỎ LỖI TYPESCRIPT
    return await this.prisma.message.create({
      data: payload as any,
    });
  }

  async getHistory(roomId: string) {
    if (!roomId) return [];
    return this.prisma.message.findMany({
      where: { roomId },
      orderBy: { createdAt: "asc" },
    });
  }

  async getByUser(userId: number | string) {
    const id = Number(userId);

    return this.prisma.message.findMany({
    where: {
        OR: [
        { senderId: Number(id) },
        { receiverId: Number(id) },
        ] as any,
    },
    orderBy: { createdAt: "asc" },
    } as any);
  }

  async saveMessage(data: CreateMessageDTO) {
    return this.createMessage(data);
  }
}

export default new ChatService();
