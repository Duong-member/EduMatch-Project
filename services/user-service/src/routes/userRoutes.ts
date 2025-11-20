import { Router, Request, Response } from "express";
import { UserController } from "../controllers/UserController";
import { UserService } from "../services/UserService";
import { UserRepository } from "../repositories/UserRepository";

const router = Router();

const userRepo = new UserRepository();
const userService = new UserService(userRepo);
const userController = new UserController(userService);
router.get("/hello", (req,res)=>res.json({msg:"ok"}));

// tránh lỗi this bị mất context
router.post('/register', (req: Request, res: Response) => userController.register(req, res));
router.post('/login', (req: Request, res: Response) => userController.login(req, res));

// --- Internal/Admin Routes (Sau này sẽ bảo vệ bằng middleware) ---
router.get('/count', (req, res) => userController.count(req, res));
router.get('/', (req, res) => userController.getAll(req, res));
router.put('/:id/status', (req, res) => userController.updateStatus(req, res));

// --- Detail Route (Luôn đặt cuối cùng nếu dùng param :id) ---
router.get('/:id', (req, res) => userController.getById(req, res));

export default router;
