import { prisma } from '../../config/prisma.js';
import { createCrudService } from '../../utils/crudFactory.js';
import { badRequest } from '../../utils/ApiError.js';
import { notificationsService } from '../notifications/notifications.service.js';

const allowedStatuses = ['pending', 'quoted', 'approved', 'production', 'painted', 'delivered', 'cancelled'];

const crud = createCrudService('job', {
  include: {
    client: true,
    quotes: true,
    incomes: true,
    expenses: true,
  },
});

export const jobsService = {
  ...crud,

  async create(data, user) {
    const job = await prisma.job.create({
      data: {
        ...data,
        createdById: user?.id || data.createdById || null,
        status: data.status || 'pending',
      },
      include: { client: true },
    });

    await notificationsService.createSystemNotification({
      title: 'Nuevo trabajo creado',
      message: `Se creo el trabajo ${job.title}`,
      type: 'info',
      entityType: 'job',
      entityId: job.id,
    });

    return job;
  },

  async updateStatus(id, status) {
    if (!allowedStatuses.includes(status)) {
      throw badRequest('Estado de trabajo invalido');
    }

    const job = await prisma.job.update({
      where: { id },
      data: {
        status,
        realDeliveryDate: status === 'delivered' ? new Date() : undefined,
      },
      include: { client: true },
    });

    await notificationsService.createSystemNotification({
      title: 'Trabajo actualizado',
      message: `El trabajo ${job.title} cambio a ${status}`,
      type: 'info',
      entityType: 'job',
      entityId: job.id,
    });

    return job;
  },

  async timeline(id) {
    const job = await this.findById(id);
    return {
      job,
      timeline: [
        { label: 'Creado', date: job.createdAt },
        { label: 'Actualizado', date: job.updatedAt },
        job.realDeliveryDate ? { label: 'Entregado', date: job.realDeliveryDate } : null,
      ].filter(Boolean),
    };
  },
};
