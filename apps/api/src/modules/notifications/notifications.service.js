import { prisma } from '../../config/prisma.js';
import { createCrudService } from '../../utils/crudFactory.js';

const crud = createCrudService('notification', {
  orderBy: { createdAt: 'desc' },
});

export const notificationsService = {
  ...crud,

  async createSystemNotification({ title, message, type = 'info', userId = null, entityType = null, entityId = null }) {
    return prisma.notification.create({
      data: { title, message, type, userId, entityType, entityId },
    });
  },

  async markAsRead(id) {
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
};
