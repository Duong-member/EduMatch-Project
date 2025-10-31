import { Router, Request, Response } from "express";
import { UserController } from "../controllers/UserController";
import { UserService } from "../services/UserService";
import { UserRepository } from "../repositories/UserRepository";
import dbPool from "../dbPool";

const router = Router();

const userRepo = new UserRepository(dbPool);
const userService = new UserService(userRepo);
const userController = new UserController(userService);
router.get("/hello", (req,res)=>res.json({msg:"ok"}));

// tránh lỗi this bị mất context
router.post('/register', (req: Request, res: Response) => userController.register(req, res));
router.post('/login', (req: Request, res: Response) => userController.login(req, res));

export default router;
