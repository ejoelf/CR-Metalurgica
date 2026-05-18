import { prisma } from '../../config/prisma.js';
import { notFound } from '../../utils/ApiError.js';

export const auditModuleService = {
  async findMany(query = {}) {
    const searchValue = String(query.search || '').trim();
    const take = Math.min(Number(query.limit || 100), 200);

    return prisma.auditLog.findMany({
      where: {
        ...(query.action ? { action: query.action } : {}),
        ...(query.entityType ? { entityType: query.entityType } : {}),
        ...(query.userId ? { userId: query.userId } : {}),
        ...(searchValue
          ? {
              OR: [
                { action: { contains: searchValue, mode: 'insensitive' } },
                { entityType: { contains: searchValue, mode: 'insensitive' } },
                { entityId: { contains: searchValue, mode: 'insensitive' } },
                { user: { name: { contains: searchValue, mode: 'insensitive' } } },
                { user: { email: { contains: searchValue, mode: 'insensitive' } } },
              ],
            }
          : {}),
      },
      include: { user: { select: { id: true, name: true, username: true, email: true, role: true } } },
      orderBy: { createdAt: 'desc' },
      take,
    });
  },

  async findById(id) {
    const item = await prisma.auditLog.findUnique({
      where: { id },
      include: { user: { select: { id: true, name: true, username: true, email: true, role: true } } },
    });
    if (!item) throw notFound('Registro de auditoría no encontrado');
    return item;
  },
};
