import { Request, Response } from "express";
import { UserService } from "../services/UserService";

export class UserController {
  constructor(private userService: UserService) {}

  register = async (req: Request, res: Response) => {
    try {
      const result = await this.userService.register(req.body);
      res.status(201).json({ message: "Đăng ký thành công", result });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };

  login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const data = await this.userService.login(email, password);

    return res.json({
      message: "Đăng nhập thành công",
      user: data.user,
      token: data.token
    });

  } catch (err: any) {
    return res.status(401).json({ error: err.message });
  }
};
getById = async (req: Request, res: Response) => {
    try {
      const user = await this.userService.getUserById(req.params.id);
      res.json(user);
    } catch (err: any) {
      res.status(404).json({ error: err.message });
    }
  };
  
// GET /count
  count = async (req: Request, res: Response) => {
    try {
      const count = await this.userService.countUsers();
      res.json({ count });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  };

  // GET / (Lấy danh sách)
  getAll = async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const users = await this.userService.getAllUsers(page, limit);
      res.json(users);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  };

  // PUT /:id/status (Khóa/Mở khóa)
  updateStatus = async (req: Request, res: Response) => {
    try {
      const { isActive } = req.body; // Truyền { "isActive": false } để khóa
      if (typeof isActive !== 'boolean') {
        return res.status(400).json({ error: "isActive phải là boolean" });
      }
      await this.userService.changeStatus(req.params.id, isActive);
      res.json({ message: "Cập nhật trạng thái thành công" });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };
}
