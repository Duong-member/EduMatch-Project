// services/application-service/src/services/application.service.ts
import { ApplicationRepository } from '../repositories/application.repository';
import { ApplicationStatus } from '../generated/client';

export class ApplicationService {
  // Sử dụng Dependency Injection
  constructor(private appRepo: ApplicationRepository) {}

  async submit(studentId: string, oppId: number) {
    // Có thể thêm logic kiểm tra (ví dụ: sinh viên này đã nộp đơn chưa?)
    return this.appRepo.create(studentId, oppId);
  }

  async getDetails(id: number) {
    const app = await this.appRepo.findById(id);
    if (!app) throw new Error('Không tìm thấy hồ sơ');
    return app;
  }

  async changeStatus(id: number, status: string) {
    // Logic nghiệp vụ (validation) nằm ở đây
    const validStatuses: string[] = Object.values(ApplicationStatus);
    if (!validStatuses.includes(status)) {
      throw new Error('Trạng thái không hợp lệ');
    }
    return this.appRepo.updateStatus(id, status as ApplicationStatus);
  }
  async countApplications() {
    return this.appRepo.count();
  }
}