import { prisma } from '../config/prisma.js';
import { sanitizeForJson } from '../utils/sanitizeForJson.js';

export const auditService = {
  async log({ req, userId, action, entityType, entityId, oldValue = null, newValue = null }) {
    try {
      if (!action) return null;

      return await prisma.auditLog.create({
        data: {
          userId: userId || req?.user?.id || null,
          action,
          entityType: entityType || null,
          entityId: entityId || null,
          oldValue: sanitizeForJson(oldValue),
          newValue: sanitizeForJson(newValue),
          ipAddress: req?.ip || req?.headers?.['x-forwarded-for'] || null,
          userAgent: req?.headers?.['user-agent'] || null,
        },
      });
    } catch (error) {
      console.error('Audit log error:', error.message);
      return null;
    }
  },

  async listRecent({ take = 20, entityType, entityId } = {}) {
    return prisma.auditLog.findMany({
      where: {
        ...(entityType ? { entityType } : {}),
        ...(entityId ? { entityId } : {}),
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take,
    });
  },
};
