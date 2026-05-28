import { prisma } from '../config/prisma.js';

function visibleNotificationsWhere(userId = null) {
  return {
    isRead: false,
    OR: [{ userId }, { userId: null }],
    NOT: { entityType: 'system' },
  };
}

export const countersService = {
  async sidebar(userId = null) {
    const [unreadNotifications, unreadMessages] = await Promise.all([
      prisma.notification.count({
        where: visibleNotificationsWhere(userId),
      }),
      prisma.contactMessage.count({
        where: { status: 'new' },
      }),
    ]);

    return {
      unreadNotifications,
      unreadMessages,
    };
  },
};
