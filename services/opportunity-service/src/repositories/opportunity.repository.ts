// services/opportunity-service/src/repositories/opportunity.repository.ts
import { prisma } from '../db/prisma';
import { Opportunity } from '@prisma/client';

// Kiểu dữ liệu cho việc tạo hoặc cập nhật
type OpportunityData = Omit<Opportunity, 'opportunity_id' | 'created_at' | 'updated_at'>;

export class OpportunityRepository {
  
  async create(data: OpportunityData) {
    return prisma.opportunity.create({ data });
  }

  async findAll(page: number, limit: number, category?: string, deadline?: Date, search?: string) {
    const skip = (page - 1) * limit;
    
    // Xây dựng điều kiện 'where' động
    const whereCondition: any = {
        AND: [],
    };
    if (category) {
        whereCondition.AND.push({ category: category });
    }
    if (deadline) {
        whereCondition.AND.push({ deadline: { lte: deadline } }); // lte = less than or equal
    }
    if (search) {
        whereCondition.AND.push({ title: { contains: search } }); // contains = LIKE %search%
    }

    return prisma.opportunity.findMany({
      where: whereCondition.AND.length > 0 ? whereCondition : undefined,
      take: limit,
      skip: skip,
      orderBy: { created_at: 'desc' },
    });
  }

  async findByProfessor(professorId: string) {
    return prisma.opportunity.findMany({
      where: { professor_id: professorId },
      orderBy: { created_at: 'desc' },
    });
  }

  async findById(id: number) {
    return prisma.opportunity.findUnique({
      where: { opportunity_id: id },
    });
  }

  async update(id: number, professorId: string, data: Partial<OpportunityData>) {
    // updateMany đảm bảo chỉ update nếu đúng professorId sở hữu
    const result = await prisma.opportunity.updateMany({
      where: {
        opportunity_id: id,
        professor_id: professorId,
      },
      data,
    });
    return result.count > 0; // Trả về true nếu cập nhật thành công (tìm thấy)
  }

  async delete(id: number, professorId: string) {
    // deleteMany đảm bảo chỉ xóa nếu đúng professorId sở hữu
    const result = await prisma.opportunity.deleteMany({
      where: {
        opportunity_id: id,
        professor_id: professorId,
      },
    });
    return result.count > 0; // Trả về true nếu xóa thành công
  }
// ✅ THÊM: Đếm tổng số cơ hội
  async count() {
    return prisma.opportunity.count();
  }
}