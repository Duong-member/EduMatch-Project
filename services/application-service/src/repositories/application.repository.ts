// services/application-service/src/repositories/application.repository.ts
import { ApplicationStatus } from '@prisma/client';

import { prisma } from '../db/prisma';



export class ApplicationRepository {
  async create(studentId: string, oppId: number) {
    return prisma.application.create({
      data: { student_id: studentId, opportunity_id: oppId, status: 'pending' },
    });
  }

  async findById(id: number) {
    return prisma.application.findUnique({ where: { application_id: id } });
  }

  async updateStatus(id: number, status: ApplicationStatus) {
    return prisma.application.update({
      where: { application_id: id },
      data: { status: status },
    });
  }
  async count() {
    return prisma.application.count();
  }
  async findAll() {
  return prisma.application.findMany();
}

async list() {
  return prisma.application.findMany({
    orderBy: { created_at: 'desc' }
  });
}

}