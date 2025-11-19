// services/opportunity-service/src/controllers/opportunity.controller.ts
import { Request, Response } from 'express';
import { OpportunityService } from '../services/opportunity.service';
import { AuthRequest } from '../middlewares/auth.middleware'; // Import AuthRequest

export class OpportunityController {
  constructor(private oppService: OpportunityService) {}

  // POST /
  create = async (req: AuthRequest, res: Response) => {
    try {
      const professorId = req.user!.id; // Lấy từ middleware
      const { title, description, deadline, category } = req.body;
      
      const result = await this.oppService.create({
        title, description, deadline, category,
        professor_id: professorId,
      });
      
      res.status(201).json({ message: 'Tạo thành công', opportunity_id: result.opportunity_id });
    } catch (err: any) {
      if (err.message === 'Thiếu Title hoặc Deadline') {
        return res.status(400).json({ message: err.message });
      }
      res.status(500).json({ message: 'Lỗi server khi tạo cơ hội', error: err.message });
    }
  };

  // GET /
  search = async (req: Request, res: Response) => {
    try {
      const { category, deadline, search, page = '1', limit = '10' } = req.query;
      const results = await this.oppService.search(
        parseInt(page as string),
        parseInt(limit as string),
        category as string,
        deadline as string,
        search as string
      );
      res.json(results);
    } catch (err: any) {
      res.status(500).json({ message: 'Lỗi server khi tìm kiếm', error: err.message });
    }
  };

  // GET /my
  getMyOpportunities = async (req: AuthRequest, res: Response) => {
    try {
      const professorId = req.user!.id;
      const results = await this.oppService.getMyOpportunities(professorId);
      res.json(results);
    } catch (err: any) {
      res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
  };

  // GET /:id
  getById = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const result = await this.oppService.getDetails(id);
      res.json(result);
    } catch (err: any) {
      if (err.message === 'Không tìm thấy cơ hội') {
        return res.status(404).json({ message: err.message });
      }
      res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
  };

  // PUT /:id
  update = async (req: AuthRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const professorId = req.user!.id;
      const { title, description, deadline, category } = req.body;

      await this.oppService.update(id, professorId, { title, description, deadline, category });
      res.json({ message: 'Cập nhật thành công' });
    } catch (err: any) {
       if (err.message === 'Không tìm thấy cơ hội hoặc không có quyền') {
        return res.status(404).json({ message: err.message });
      }
      res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
  };

  // DELETE /:id
  delete = async (req: AuthRequest, res: Response) => {
     try {
      const id = parseInt(req.params.id);
      const professorId = req.user!.id;

      await this.oppService.delete(id, professorId);
      res.json({ message: 'Xóa thành công' });
    } catch (err: any) {
       if (err.message === 'Không tìm thấy cơ hội hoặc không có quyền') {
        return res.status(404).json({ message: err.message });
      }
      res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
  };
// GET /count
  count = async (req: Request, res: Response) => {
    try {
      const count = await this.oppService.countOpportunities();
      res.json({ count });
    } catch (err: any) {
      res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
  };
}