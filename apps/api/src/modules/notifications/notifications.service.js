import { prisma } from '../../config/prisma.js';
import { createCrudService } from '../../utils/crudFactory.js';
import { notFound } from '../../utils/ApiError.js';

const crud = createCrudService('notification', {
  orderBy: { createdAt: 'desc' },
});

let agendaReminderSyncPromise = null;

function visibleForUserWhere(userId = null) {
  return {
    OR: [{ userId }, { userId: null }],
    NOT: { entityType: 'system' },
  };
}

function todayRange() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 1);
  return { start, end };
}

function formatAgendaTime(value) {
  return new Intl.DateTimeFormat('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Argentina/Cordoba',
  }).format(new Date(value));
}

async function ensureTodayAgendaReminders(userId = null) {
  if (agendaReminderSyncPromise) return agendaReminderSyncPromise;

  agendaReminderSyncPromise = (async () => {
    const { start, end } = todayRange();

    const events = await prisma.agendaEvent.findMany({
      where: {
        startAt: { gte: start, lt: end },
        status: 'scheduled',
        ...(userId ? { OR: [{ assignedToId: userId }, { assignedToId: null }] } : {}),
      },
      include: { client: true, job: true },
    });

    for (const event of events) {
      const targetUserId = event.assignedToId || null;
      const existingReminders = await prisma.notification.findMany({
        where: {
          entityType: 'agendaEventReminder',
          entityId: event.id,
        },
        orderBy: { createdAt: 'asc' },
      });

      if (existingReminders.length > 1) {
        await prisma.notification.deleteMany({
          where: {
            id: { in: existingReminders.slice(1).map((item) => item.id) },
          },
        });
      }

      if (existingReminders.length > 0) continue;

      const context = [event.client?.fullName, event.job?.title, event.location].filter(Boolean).join(' · ');

      await prisma.notification.create({
        data: {
          userId: targetUserId,
          title: 'Recordatorio de agenda para hoy',
          message: `${formatAgendaTime(event.startAt)} · ${event.title}${context ? ` · ${context}` : ''}`,
          type: 'reminder',
          entityType: 'agendaEventReminder',
          entityId: event.id,
        },
      });
    }
  })().finally(() => {
    agendaReminderSyncPromise = null;
  });

  return agendaReminderSyncPromise;
}

export const notificationsService = {
  ...crud,

  async findMany(query = {}, userId = null) {
    await ensureTodayAgendaReminders(userId);

    return prisma.notification.findMany({
      where: {
        ...visibleForUserWhere(userId),
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
    await ensureTodayAgendaReminders(userId);

    return prisma.notification.count({
      where: { ...visibleForUserWhere(userId), isRead: false },
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
      where: { ...visibleForUserWhere(userId), isRead: false },
      data: { isRead: true, readAt: new Date() },
    });
  },

  async remove(id) {
    await this.findById(id);
    return prisma.notification.delete({ where: { id } });
  },
};