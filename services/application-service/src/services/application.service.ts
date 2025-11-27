import { ApplicationRepository } from '../repositories/application.repository';
import { ApplicationStatus } from '@prisma/client';

export class ApplicationService {
  constructor(private appRepo: ApplicationRepository) {}

  async submit(studentId: string, oppId: number) {
    return this.appRepo.create(studentId, oppId);
  }

  async getDetails(id: number) {
    const app = await this.appRepo.findById(id);
    if (!app) throw new Error('Không tìm thấy hồ sơ');
    return app;
  }

  async changeStatus(id: number, status: string) {
    const validStatuses: string[] = Object.values(ApplicationStatus);
    if (!validStatuses.includes(status)) {
      throw new Error('Trạng thái không hợp lệ');
    }
    return this.appRepo.updateStatus(id, status as ApplicationStatus);
  }

  async countApplications() {
    return this.appRepo.count();
  }

  // ⭐⭐ PHẢI THÊM HÀM NÀY — NẾU THIẾU SẼ LỖI BUILD
  async list() {
    return this.appRepo.list();
  }
}
