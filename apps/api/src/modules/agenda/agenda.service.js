import { prisma } from '../../config/prisma.js';
import { createCrudService } from '../../utils/crudFactory.js';
import { badRequest } from '../../utils/ApiError.js';
import { notificationsService } from '../notifications/notifications.service.js';

const crud = createCrudService('agendaEvent', {
  include: { client: true, job: true, assignedTo: true },
  orderBy: { startAt: 'asc' },
});

export const agendaService = {
  ...crud,

  async create(data, user) {
    const startAt = new Date(data.startAt);
    const endAt = data.endAt ? new Date(data.endAt) : null;

    if (Number.isNaN(startAt.getTime())) {
      throw badRequest('Fecha de inicio invalida');
    }

    if (endAt && endAt <= startAt) {
      throw badRequest('La fecha de fin debe ser posterior al inicio');
    }

    const event = await prisma.agendaEvent.create({
      data: {
        ...data,
        startAt,
        endAt,
        reminderAt: data.reminderAt ? new Date(data.reminderAt) : null,
        createdById: user?.id || data.createdById || null,
        status: data.status || 'scheduled',
      },
      include: { client: true, job: true, assignedTo: true },
    });

    await notificationsService.createSystemNotification({
      title: 'Evento de agenda creado',
      message: `Se agendo: ${event.title}`,
      type: 'info',
      entityType: 'agendaEvent',
      entityId: event.id,
    });

    return event;
  },

  async updateStatus(id, status) {
    const allowedStatuses = ['scheduled', 'completed', 'cancelled', 'postponed'];
    if (!allowedStatuses.includes(status)) {
      throw badRequest('Estado de agenda invalido');
    }

    return prisma.agendaEvent.update({
      where: { id },
      data: { status },
      include: { client: true, job: true, assignedTo: true },
    });
  },
};
