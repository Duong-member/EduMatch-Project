import { Router, Request, Response } from "express";
import chatService from "../services/chat.service";   // dùng instance

const router = Router();

// Gửi tin nhắn
router.post("/send", async (req: Request, res: Response) => {
  try {
    const message = await chatService.createMessage(req.body);
    return res.json({ success: true, data: message });
  } catch (error: any) {
    console.error("Send Error:", error);
    return res.status(500).json({ success: false, error: error.message || "Server error" });
  }
});


// Lấy lịch sử tin nhắn theo room
router.get("/history/:roomId", async (req: Request, res: Response) => {
  try {
    const roomId = req.params.roomId;
    const msgs = await chatService.getHistory(roomId);
    return res.json({ success: true, data: msgs });
  } catch (error: any) {
    console.error("History Error:", error);
    return res.status(500).json({ success: false, error: error.message || "Server error" });
  }
});


export default router;
