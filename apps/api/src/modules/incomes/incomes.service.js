import { prisma } from '../../config/prisma.js';
import { createCrudService } from '../../utils/crudFactory.js';
import { notificationsService } from '../notifications/notifications.service.js';

const crud = createCrudService('income', { include: { client: true, job: true, quote: true } });

async function syncIncomeAgenda(income) {
  if (!income?.paidAt && !income?.createdAt) return;
  const startAt = income.paidAt || income.createdAt;
  const existing = await prisma.agendaEvent.findFirst({ where: { type: 'payment', title: { contains: income.title }, clientId: income.clientId || undefined, jobId: income.jobId || undefined, quoteId: income.quoteId || undefined } });
  const data = { title: `Ingreso registrado: ${income.title}`, description: `Movimiento financiero registrado por $${income.amount}.`, type: 'payment', status: 'completed', startAt, endAt: null, reminderAt: null, location: null, clientId: income.clientId || null, jobId: income.jobId || null, quoteId: income.quoteId || null };
  if (existing) await prisma.agendaEvent.update({ where: { id: existing.id }, data }); else await prisma.agendaEvent.create({ data });
}

export const incomesService = {
  ...crud,
  async create(data, user) {
    const income = await prisma.income.create({ data: { ...data, amount: Number(data.amount || 0), paidAt: data.status === 'paid' ? new Date(data.paidAt || Date.now()) : data.paidAt ? new Date(data.paidAt) : null, createdById: user?.id || data.createdById || null }, include: { client: true, job: true, quote: true } });
    await syncIncomeAgenda(income);
    await notificationsService.createSystemNotification({ title: 'Ingreso registrado', message: `Se registró un ingreso de ${income.amount}`, type: income.status === 'paid' ? 'success' : 'info', entityType: 'income', entityId: income.id });
    return income;
  },
  async update(id, data) {
    const income = await crud.update(id, { ...data, amount: Number(data.amount || 0), paidAt: data.paidAt ? new Date(data.paidAt) : null });
    await syncIncomeAgenda(income);
    return income;
  },
  async updateStatus(id, status) {
    const income = await prisma.income.update({ where: { id }, data: { status, paidAt: status === 'paid' ? new Date() : undefined }, include: { client: true, job: true, quote: true } });
    await syncIncomeAgenda(income);
    await notificationsService.createSystemNotification({ title: 'Ingreso actualizado', message: `El ingreso ${income.title} cambió a ${status}`, type: status === 'paid' ? 'success' : 'info', entityType: 'income', entityId: income.id });
    return income;
  },
};