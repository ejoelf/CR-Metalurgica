import { prisma } from '../../config/prisma.js';
import { createCrudService } from '../../utils/crudFactory.js';
import { notificationsService } from '../notifications/notifications.service.js';

const crud = createCrudService('expense', { include: { client: true, job: true, quote: true } });

async function syncExpenseAgenda(expense) {
  const startAt = expense.expenseDate || expense.createdAt || new Date();
  const existing = await prisma.agendaEvent.findFirst({
    where: {
      type: 'payment',
      title: { contains: expense.title },
      clientId: expense.clientId || undefined,
      jobId: expense.jobId || undefined,
      quoteId: expense.quoteId || undefined,
    },
  });
  const data = {
    title: `Egreso registrado: ${expense.title}`,
    description: `Movimiento financiero registrado por $${expense.amount}.${expense.category ? ` Categoría: ${expense.category}.` : ''}`,
    type: 'payment',
    status: 'completed',
    startAt,
    endAt: null,
    reminderAt: null,
    location: null,
    clientId: expense.clientId || null,
    jobId: expense.jobId || null,
    quoteId: expense.quoteId || null,
  };
  if (existing) await prisma.agendaEvent.update({ where: { id: existing.id }, data });
  else await prisma.agendaEvent.create({ data });
}

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
      include: { client: true, job: true, quote: true },
    });

    await syncExpenseAgenda(expense);

    await notificationsService.createSystemNotification({
      title: 'Egreso registrado',
      message: `Se registró un egreso de ${expense.amount}`,
      type: 'warning',
      entityType: 'expense',
      entityId: expense.id,
    });

    return expense;
  },

  async update(id, data) {
    const expense = await crud.update(id, {
      ...data,
      amount: Number(data.amount || 0),
      expenseDate: data.expenseDate ? new Date(data.expenseDate) : new Date(),
    });
    await syncExpenseAgenda(expense);
    return expense;
  },
};