import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


class ChatRepository {
async createMessage(data: any) {
return prisma.message.create({ data: {
senderId: data.senderId,
receiverId: data.receiverId || null,
roomId: data.roomId,
content: data.content
}});
}


async getMessages(roomId: string) {
return prisma.message.findMany({ where: { roomId }, orderBy: { createdAt: 'asc' } });
}
}


export default new ChatRepository();