// services/application-service/src/controllers/application.controller.ts
import { Request, Response } from 'express';
import { ApplicationService } from '../services/application.service';

export class ApplicationController {
  constructor(private appService: ApplicationService) {}

  createApplication = async (req: Request, res: Response) => {
    try {
      const { student_id, opportunity_id } = req.body;
      if (!student_id || !opportunity_id) {
        return res.status(400).json({ error: 'Thiếu thông tin' });
      }
      const result = await this.appService.submit(student_id, opportunity_id);
      res.status(201).json({ message: 'Nộp đơn thành công', result });
    } catch (err: any) {
      res.status(500).json({ error: 'Lỗi server: ' + err.message });
    }
  };

  getApplication = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const result = await this.appService.getDetails(id);
      res.status(200).json(result);
    } catch (err: any) {
      if (err.message === 'Không tìm thấy hồ sơ') {
        return res.status(404).json({ error: err.message });
      }
      res.status(500).json({ error: 'Lỗi server: ' + err.message });
    }
  };

  updateStatus = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      await this.appService.changeStatus(id, status);
      res.status(200).json({ message: 'Cập nhật trạng thái thành công' });
    } catch (err: any) {
       if (err.message === 'Trạng thái không hợp lệ') {
        return res.status(400).json({ error: err.message });
      }
      res.status(500).json({ error: 'Lỗi server: ' + err.message });
    }
  };
  count = async (req: Request, res: Response) => {
    try {
      const count = await this.appService.countApplications();
      res.json({ count });
    } catch (err: any) {
      res.status(500).json({ error: 'Lỗi server: ' + err.message });
    }
  };
  list = async (req: Request, res: Response) => {
  const apps = await this.appService.list();
  res.json(apps);
};

}