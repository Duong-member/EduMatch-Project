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
}
