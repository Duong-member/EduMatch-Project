import { prisma } from '../db/prisma';

type OpportunityData = {
  title: string;
  description?: string | null;
  deadline?: Date | null;
  category?: string | null;
  professor_id: string;   // ✔ bắt buộc
};


export class OpportunityRepository {

  async create(data: OpportunityData) {
    return prisma.opportunity.create({ data });
  }

  async findAll(page: number, limit: number, category?: string, deadline?: Date, search?: string) {

    const skip = (page - 1) * limit;

    const where: any = {};

    if (category) where.category = category;
    if (deadline) where.deadline = { lte: deadline };
    if (search)  where.title = { contains: search };

    return prisma.opportunity.findMany({
      where,
      skip,
      take: limit,
      orderBy: { created_at: 'desc' }
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
    const result = await prisma.opportunity.updateMany({
      where: { opportunity_id: id, professor_id: professorId },
      data,
    });
    return result.count > 0;
  }

  async delete(id: number, professorId: string) {
    const result = await prisma.opportunity.deleteMany({
      where: { opportunity_id: id, professor_id: professorId },
    });
    return result.count > 0;
  }

  async count() {
    return prisma.opportunity.count();
  }
}
