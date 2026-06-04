import { prisma } from '../../config/prisma.js';
import { badRequest, notFound } from '../../utils/ApiError.js';
import { systemActionsService } from '../../services/systemActions.service.js';

const allowedStatuses = ['pending', 'quoted', 'approved', 'production', 'painted', 'completed', 'delivered', 'on_hold', 'rescheduled', 'cancelled'];
const allowedPriorities = ['low', 'normal', 'high', 'urgent'];

function toDecimalOrNull(value) { if (value === undefined || value === null || value === '') return null; return value; }
function parseDateOrNull(value) { if (!value) return null; const date = new Date(value); if (Number.isNaN(date.getTime())) return null; return date; }
function dateKey(value) { return value ? new Date(value).toISOString().slice(0, 10) : ''; }

function normalizeJobPayload(data = {}, user = null) {
  return {
    clientId: data.clientId,
    title: String(data.title || '').trim(),
    description: data.description ? String(data.description).trim() : null,
    serviceType: data.serviceType ? String(data.serviceType).trim() : null,
    status: data.status || 'pending',
    priority: data.priority || 'normal',
    dueDate: parseDateOrNull(data.dueDate || data.estimatedDeliveryDate),
    acceptedAt: parseDateOrNull(data.acceptedAt),
    budgetedAt: parseDateOrNull(data.budgetedAt),
    startedAt: parseDateOrNull(data.startedAt || data.realStartDate),
    completedAt: parseDateOrNull(data.completedAt),
    deliveredAt: parseDateOrNull(data.deliveredAt || data.realDeliveryDate),
    estimatedPrice: toDecimalOrNull(data.estimatedPrice),
    finalPrice: toDecimalOrNull(data.finalPrice),
    paidAmount: data.paidAmount === undefined || data.paidAmount === null || data.paidAmount === '' ? undefined : data.paidAmount,
    internalNotes: data.internalNotes ? String(data.internalNotes).trim() : null,
    createdById: data.createdById || user?.id || null,
  };
}

function decorateJob(job) {
  if (!job) return job;
  const paidAmountFromIncomes = (job.incomes || []).reduce((total, income) => income.status === 'paid' ? total + Number(income.amount || 0) : total, 0);
  const paidAmount = Math.max(Number(job.paidAmount || 0), paidAmountFromIncomes);
  const total = Number(job.finalPrice || job.estimatedPrice || 0);
  const pendingAmount = Math.max(total - paidAmount, 0);
  const paymentPercent = total > 0 ? Math.min((paidAmount / total) * 100, 100) : 0;
  const paymentStatus = paidAmount <= 0 ? 'none' : paidAmount < total ? 'partial' : paidAmount === total ? 'paid' : 'overpaid';
  return { ...job, estimatedDeliveryDate: job.dueDate, estimatedStartDate: job.startedAt, realStartDate: job.startedAt, realDeliveryDate: job.deliveredAt, paidAmount, pendingAmount, paymentPercent, paymentStatus, quotesCount: job.quotes?.length || 0, expensesCount: job.expenses?.length || 0 };
}

async function syncJobAgenda(job) {
  if (!job?.id) return;
  const clientName = job.client?.fullName ? ` · ${job.client.fullName}` : '';
  if (job.dueDate) {
    const existing = await prisma.agendaEvent.findFirst({ where: { jobId: job.id, type: 'delivery', title: { contains: 'Entrega estimada' } } });
    const data = { title: `Entrega estimada: ${job.title}`, description: `Fecha de entrega estimada marcada desde Trabajos.${clientName}`, type: 'delivery', status: job.status === 'cancelled' ? 'cancelled' : 'scheduled', startAt: job.dueDate, endAt: null, reminderAt: job.dueDate, location: null, clientId: job.clientId, jobId: job.id };
    if (existing) await prisma.agendaEvent.update({ where: { id: existing.id }, data }); else await prisma.agendaEvent.create({ data });
  }
  if (job.startedAt) {
    const existing = await prisma.agendaEvent.findFirst({ where: { jobId: job.id, type: 'production', title: { contains: 'Inicio' } } });
    const data = { title: `Inicio de trabajo: ${job.title}`, description: `Inicio marcado desde Trabajos.${clientName}`, type: 'production', status: job.status === 'cancelled' ? 'cancelled' : 'scheduled', startAt: job.startedAt, endAt: null, reminderAt: job.startedAt, location: null, clientId: job.clientId, jobId: job.id };
    if (existing) await prisma.agendaEvent.update({ where: { id: existing.id }, data }); else await prisma.agendaEvent.create({ data });
  }
}

async function registerClosureRefund(job, closure = {}, user = null) {
  if (!closure.refundMoney) return null;
  const amount = Number(closure.refundAmount || 0);
  if (amount <= 0) return null;
  return prisma.expense.create({
    data: {
      title: `Devolución por trabajo cancelado: ${job.title}`,
      description: closure.refundNote || `Devolución registrada al cancelar el trabajo ${job.title}.`,
      amount,
      category: 'Devolución a cliente',
      paymentMethod: closure.refundMethod || 'cash',
      expenseDate: new Date(),
      supplierName: job.client?.fullName || null,
      clientId: job.clientId,
      jobId: job.id,
      createdById: user?.id || null,
    },
  });
}

async function deleteCancelledJob(id) {
  const job = await prisma.job.findUnique({ where: { id }, include: { client: true, quotes: true, incomes: true, expenses: true, agendaEvents: true, files: true } });
  if (!job) throw notFound('Trabajo no encontrado');
  if (job.status !== 'cancelled') throw badRequest('Para eliminar definitivamente un trabajo, primero debe estar en estado Cancelado');

  await prisma.$transaction([
    prisma.notification.deleteMany({ where: { entityType: 'job', entityId: id } }),
    prisma.agendaEvent.deleteMany({ where: { jobId: id } }),
    prisma.file.deleteMany({ where: { jobId: id } }),
    prisma.income.updateMany({ where: { jobId: id }, data: { jobId: null } }),
    prisma.expense.updateMany({ where: { jobId: id }, data: { jobId: null } }),
    prisma.quote.updateMany({ where: { jobId: id }, data: { jobId: null } }),
    prisma.job.delete({ where: { id } }),
  ]);

  return decorateJob(job);
}

export const jobsService = {
  async findMany({ search, status, priority, clientId } = {}) {
    const searchValue = String(search || '').trim();
    const jobs = await prisma.job.findMany({ where: { ...(status ? { status } : {}), ...(priority ? { priority } : {}), ...(clientId ? { clientId } : {}), ...(searchValue ? { OR: [{ title: { contains: searchValue, mode: 'insensitive' } }, { description: { contains: searchValue, mode: 'insensitive' } }, { serviceType: { contains: searchValue, mode: 'insensitive' } }, { client: { fullName: { contains: searchValue, mode: 'insensitive' } } }] } : {}) }, include: { client: true, quotes: { select: { id: true, quoteNumber: true, title: true, status: true, total: true, pdfUrl: true, createdAt: true } }, incomes: { select: { id: true, title: true, amount: true, status: true, paidAt: true, createdAt: true } }, expenses: { select: { id: true, title: true, amount: true, category: true, expenseDate: true, createdAt: true } }, agendaEvents: { select: { id: true, title: true, type: true, status: true, startAt: true } }, files: true }, orderBy: [{ priority: 'desc' }, { dueDate: 'asc' }, { updatedAt: 'desc' }] });
    return jobs.map(decorateJob);
  },
  async findById(id) {
    const job = await prisma.job.findUnique({ where: { id }, include: { client: true, quotes: { orderBy: { createdAt: 'desc' }, include: { pdfDocuments: true, items: true } }, incomes: { orderBy: { createdAt: 'desc' } }, expenses: { orderBy: { createdAt: 'desc' } }, agendaEvents: { orderBy: { startAt: 'desc' } }, files: true, createdBy: { select: { id: true, name: true, username: true, email: true } } } });
    if (!job) throw notFound('Trabajo no encontrado'); return decorateJob(job);
  },
  async create(data, user) {
    if (!data.clientId) throw badRequest('El cliente es requerido'); if (!data.title) throw badRequest('El título del trabajo es requerido');
    if (data.status && !allowedStatuses.includes(data.status)) throw badRequest('Estado de trabajo inválido'); if (data.priority && !allowedPriorities.includes(data.priority)) throw badRequest('Prioridad inválida');
    const payload = normalizeJobPayload(data, user); if (payload.paidAmount === undefined) delete payload.paidAmount;
    const job = await prisma.job.create({ data: payload, include: { client: true, quotes: true, incomes: true, expenses: true, agendaEvents: true, files: true } });
    await syncJobAgenda(job);
    await systemActionsService.notify({ name: 'job_created', title: 'Trabajo creado', message: `Se creó el trabajo: ${job.title}`, type: 'success', entityType: 'job', entityId: job.id, payload: { clientId: job.clientId, dueDate: job.dueDate } });
    return decorateJob(job);
  },
  async update(id, data) {
    const previous = await this.findById(id);
    if (['cancelled', 'delivered'].includes(previous.status)) throw badRequest('Este trabajo ya está cerrado y no permite cambios de estado o edición operativa');
    if (data.status && !allowedStatuses.includes(data.status)) throw badRequest('Estado de trabajo inválido'); if (data.priority && !allowedPriorities.includes(data.priority)) throw badRequest('Prioridad inválida');
    const payload = normalizeJobPayload(data); delete payload.createdById; if (payload.paidAmount === undefined) delete payload.paidAmount;
    const job = await prisma.job.update({ where: { id }, data: payload, include: { client: true, quotes: true, incomes: true, expenses: true, agendaEvents: true, files: true } });
    await syncJobAgenda(job);
    if (dateKey(previous.dueDate) !== dateKey(job.dueDate) || dateKey(previous.startedAt) !== dateKey(job.startedAt)) await systemActionsService.notify({ name: 'job_dates_updated', title: 'Fechas de trabajo actualizadas', message: `Se actualizaron fechas del trabajo: ${job.title}`, type: 'info', entityType: 'job', entityId: job.id, payload: { dueDate: job.dueDate, startedAt: job.startedAt } });
    return decorateJob(job);
  },
  async updateStatus(id, status) {
    if (!allowedStatuses.includes(status)) throw badRequest('Estado de trabajo inválido');
    const current = await this.findById(id);
    if (current.status === 'delivered') throw badRequest('El trabajo entregado queda cerrado y no permite cambiar estado');
    if (current.status === 'cancelled') throw badRequest('El trabajo cancelado queda cerrado y no permite cambiar estado');
    if (current.status === 'completed' && status !== 'delivered') throw badRequest('Un trabajo completado solo puede pasar a Entregado');
    const updateData = { status };
    if (status === 'delivered') updateData.deliveredAt = new Date(); if (status === 'completed') updateData.completedAt = new Date(); if (status === 'production') updateData.startedAt = new Date(); if (status === 'approved') updateData.acceptedAt = new Date(); if (status === 'quoted') updateData.budgetedAt = new Date();
    const job = await prisma.job.update({ where: { id }, data: updateData, include: { client: true, quotes: true, incomes: true, expenses: true, agendaEvents: true, files: true } });
    await syncJobAgenda(job); return decorateJob(job);
  },
  async remove(id, closure = {}, user = null) {
    const current = await this.findById(id);
    if (current.status === 'cancelled') {
      const deleted = await deleteCancelledJob(id);
      await systemActionsService.notify({ name: 'job_deleted_final', title: 'Trabajo eliminado definitivamente', message: `Se eliminó definitivamente el trabajo: ${deleted.title}`, type: 'warning', entityType: 'job', entityId: deleted.id, payload: { finalDelete: true } });
      return deleted;
    }

    if (current.status === 'delivered') throw badRequest('Un trabajo entregado queda cerrado y no se puede eliminar desde este flujo');

    const job = await prisma.job.update({ where: { id }, data: { status: 'cancelled' }, include: { client: true, quotes: true, incomes: true, expenses: true, agendaEvents: true, files: true } });
    await registerClosureRefund(job, closure, user);
    await syncJobAgenda(job);
    await systemActionsService.notify({ name: 'job_cancelled', title: 'Trabajo cancelado', message: `Se canceló el trabajo: ${job.title}`, type: 'warning', entityType: 'job', entityId: job.id, payload: { refundMoney: Boolean(closure.refundMoney), refundAmount: Number(closure.refundAmount || 0) } });
    return decorateJob(await this.findById(id));
  },
  async timeline(id) { const job = await this.findById(id); return { job, timeline: [{ label: 'Creado', date: job.createdAt }, { label: 'Última actualización', date: job.updatedAt }, job.budgetedAt ? { label: 'Presupuestado', date: job.budgetedAt } : null, job.acceptedAt ? { label: 'Aceptado', date: job.acceptedAt } : null, job.startedAt ? { label: 'Inicio', date: job.startedAt } : null, job.completedAt ? { label: 'Completado', date: job.completedAt } : null, job.dueDate ? { label: 'Entrega prevista', date: job.dueDate } : null, job.deliveredAt ? { label: 'Entregado', date: job.deliveredAt } : null].filter(Boolean) }; },
};
