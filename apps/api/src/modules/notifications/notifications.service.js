import { prisma } from '../../config/prisma.js';
import { createCrudService } from '../../utils/crudFactory.js';
import { notFound } from '../../utils/ApiError.js';

const crud = createCrudService('notification', {
  orderBy: { createdAt: 'desc' },
});

export const notificationsService = {
  ...crud,

  async findMany(query = {}, userId = null) {
    return prisma.notification.findMany({
      where: {
        OR: [{ userId }, { userId: null }],
        ...(query.isRead !== undefined && query.isRead !== '' ? { isRead: query.isRead === true || query.isRead === 'true' } : {}),
        ...(query.type ? { type: query.type } : {}),
        ...(query.entityType ? { entityType: query.entityType } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  async findById(id) {
    const notification = await prisma.notification.findUnique({ where: { id } });
    if (!notification) throw notFound('Notificación no encontrada');
    return notification;
  },

  async createSystemNotification({ title, message, type = 'info', userId = null, entityType = null, entityId = null }) {
    return prisma.notification.create({
      data: { title, message, type, userId, entityType, entityId },
    });
  },

  async unreadCount(userId = null) {
    return prisma.notification.count({
      where: { OR: [{ userId }, { userId: null }], isRead: false },
    });
  },

  async markAsRead(id) {
    await this.findById(id);
    return prisma.notification.update({
      where: { id },
      data: { isRead: true, readAt: new Date() },
    });
  },

  async markAllAsRead(userId) {
    return prisma.notification.updateMany({
      where: { OR: [{ userId }, { userId: null }], isRead: false },
      data: { isRead: true, readAt: new Date() },
    });
  },

  async remove(id) {
    await this.findById(id);
    return prisma.notification.delete({ where: { id } });
  },
};
