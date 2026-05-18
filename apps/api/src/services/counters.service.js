import { prisma } from '../config/prisma.js';

export const countersService = {
  async sidebar(userId = null) {
    const [unreadNotifications, unreadMessages] = await Promise.all([
      prisma.notification.count({
        where: {
          isRead: false,
          ...(userId ? { OR: [{ userId }, { userId: null }] } : {}),
        },
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
