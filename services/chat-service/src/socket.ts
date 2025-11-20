// src/socket.ts
import { Server } from "socket.io";
import chatService from "./services/chat.service";
import { publishMessage } from "./rabbit/publisher";

export default function createSocket(server: any) {
  const io = new Server(server, { cors: { origin: "*" } });

  io.on("connection", (socket) => {
    console.log("socket connected", socket.id);

    socket.on("joinRoom", (roomId: string) => {
      socket.join(roomId);
    });

    socket.on("sendMessage", async (payload: any) => {
      // payload = { senderId, receiverId, roomId, content }

      try {
        const saved = await chatService.saveMessage(payload);

        // Gửi message ra room
        if (payload.roomId) {
          io.to(payload.roomId).emit("receiveMessage", saved);
        }

        // Publish cho RabbitMQ (nếu bạn dùng)
        try {
          await publishMessage("chat_messages", saved);
        } catch (err) {
          console.log("RabbitMQ publish error:", err);
        }

      } catch (err) {
        console.error("Socket sendMessage error:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("socket disconnected");
    });
  });

  return io;
}
