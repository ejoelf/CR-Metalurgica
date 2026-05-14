import { prisma } from '../../config/prisma.js';
import { createCrudService } from '../../utils/crudFactory.js';
import { notificationsService } from '../notifications/notifications.service.js';

const crud = createCrudService('income', {
  include: { client: true, job: true, quote: true },
});

export const incomesService = {
  ...crud,

  async create(data, user) {
    const income = await prisma.income.create({
      data: {
        ...data,
        amount: Number(data.amount || 0),
        paidAt: data.status === 'paid' ? new Date(data.paidAt || Date.now()) : data.paidAt ? new Date(data.paidAt) : null,
        createdById: user?.id || data.createdById || null,
      },
      include: { client: true, job: true, quote: true },
    });

    await notificationsService.createSystemNotification({
      title: 'Ingreso registrado',
      message: `Se registro un ingreso de ${income.amount}`,
      type: income.status === 'paid' ? 'success' : 'info',
      entityType: 'income',
      entityId: income.id,
    });

    return income;
  },

  async updateStatus(id, status) {
    const income = await prisma.income.update({
      where: { id },
      data: {
        status,
        paidAt: status === 'paid' ? new Date() : undefined,
      },
      include: { client: true, job: true, quote: true },
    });

    await notificationsService.createSystemNotification({
      title: 'Ingreso actualizado',
      message: `El ingreso ${income.title} cambio a ${status}`,
      type: status === 'paid' ? 'success' : 'info',
      entityType: 'income',
      entityId: income.id,
    });

    return income;
  },
};
