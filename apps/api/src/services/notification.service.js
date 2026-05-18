import { prisma } from '../config/prisma.js';

export const notificationService = {
  async create({ userId = null, title, message, type = 'info', entityType = null, entityId = null }) {
    if (!title || !message) return null;

    return prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
        entityType,
        entityId,
      },
    });
  },

  async list({ userId, includeRead = true, take = 50 } = {}) {
    return prisma.notification.findMany({
      where: {
        ...(userId ? { OR: [{ userId }, { userId: null }] } : {}),
        ...(includeRead ? {} : { isRead: false }),
      },
      orderBy: { createdAt: 'desc' },
      take,
    });
  },

  async markRead(id) {
    return prisma.notification.update({
      where: { id },
      data: { isRead: true, readAt: new Date() },
    });
  },

  async markAllRead(userId = null) {
    return prisma.notification.updateMany({
      where: {
        isRead: false,
        ...(userId ? { OR: [{ userId }, { userId: null }] } : {}),
      },
      data: { isRead: true, readAt: new Date() },
    });
  },

  async unreadCount(userId = null) {
    return prisma.notification.count({
      where: {
        isRead: false,
        ...(userId ? { OR: [{ userId }, { userId: null }] } : {}),
      },
    });
  },
};
