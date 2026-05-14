import { prisma } from '../../config/prisma.js';
import { createCrudService } from '../../utils/crudFactory.js';
import { notificationsService } from '../notifications/notifications.service.js';

const crud = createCrudService('expense', {
  include: { job: true },
});

export const expensesService = {
  ...crud,

  async create(data, user) {
    const expense = await prisma.expense.create({
      data: {
        ...data,
        amount: Number(data.amount || 0),
        expenseDate: data.expenseDate ? new Date(data.expenseDate) : new Date(),
        createdById: user?.id || data.createdById || null,
      },
      include: { job: true },
    });

    await notificationsService.createSystemNotification({
      title: 'Egreso registrado',
      message: `Se registro un egreso de ${expense.amount}`,
      type: 'warning',
      entityType: 'expense',
      entityId: expense.id,
    });

    return expense;
  },
};
