// services/opportunity-service/src/services/opportunity.service.ts
import { OpportunityRepository } from '../repositories/opportunity.repository';

// Định nghĩa kiểu dữ liệu (DTO) cho việc tạo
interface CreateOppDto {
  title: string;
  description?: string;
  deadline: string; // Nhận chuỗi ISO 8601
  category?: string;
  professor_id: string;
}

// DTO cho việc cập nhật
type UpdateOppDto = Partial<Omit<CreateOppDto, 'professor_id'>>;

export class OpportunityService {
  constructor(private oppRepo: OpportunityRepository) {}

  async create(dto: CreateOppDto) {
    if (!dto.title || !dto.deadline) {
      throw new Error('Thiếu Title hoặc Deadline');
    }
    
  return this.oppRepo.create({
    title: dto.title,
    professor_id: dto.professor_id,
    deadline: dto.deadline ? new Date(dto.deadline) : null,

    description: dto.description ?? null,
    category: dto.category ?? null,
  });
}
  async search(page: number, limit: number, category?: string, deadlineStr?: string, search?: string) {
    const deadline = deadlineStr ? new Date(deadlineStr) : undefined;
    return this.oppRepo.findAll(page, limit, category, deadline, search);
  }

  async getMyOpportunities(professorId: string) {
    return this.oppRepo.findByProfessor(professorId);
  }

  async getDetails(id: number) {
    const opp = await this.oppRepo.findById(id);
    if (!opp) throw new Error('Không tìm thấy cơ hội');
    return opp;
  }

  async update(id: number, professorId: string, dto: UpdateOppDto) {
    const dataToUpdate: any = { ...dto };
    if (dto.deadline) {
      dataToUpdate.deadline = new Date(dto.deadline);
    }
    
    const success = await this.oppRepo.update(id, professorId, dataToUpdate);
    if (!success) throw new Error('Không tìm thấy cơ hội hoặc không có quyền');
    return true;
  }

  async delete(id: number, professorId: string) {
    const success = await this.oppRepo.delete(id, professorId);
    if (!success) throw new Error('Không tìm thấy cơ hội hoặc không có quyền');
    return true;
  }
}