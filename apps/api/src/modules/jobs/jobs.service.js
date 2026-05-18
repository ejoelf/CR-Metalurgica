import { prisma } from '../../config/prisma.js';
import { badRequest, notFound } from '../../utils/ApiError.js';

const allowedStatuses = ['pending', 'quoted', 'approved', 'production', 'painted', 'delivered', 'cancelled'];
const allowedPriorities = ['low', 'normal', 'high', 'urgent'];

function toDecimalOrNull(value) {
  if (value === undefined || value === null || value === '') return null;
  return value;
}

function normalizeJobPayload(data = {}, user = null) {
  return {
    clientId: data.clientId,
    title: String(data.title || '').trim(),
    description: data.description ? String(data.description).trim() : null,
    serviceType: data.serviceType ? String(data.serviceType).trim() : null,
    status: data.status || 'pending',
    priority: data.priority || 'normal',
    estimatedStartDate: data.estimatedStartDate ? new Date(data.estimatedStartDate) : null,
    estimatedDeliveryDate: data.estimatedDeliveryDate ? new Date(data.estimatedDeliveryDate) : null,
    realStartDate: data.realStartDate ? new Date(data.realStartDate) : null,
    realDeliveryDate: data.realDeliveryDate ? new Date(data.realDeliveryDate) : null,
    estimatedPrice: toDecimalOrNull(data.estimatedPrice),
    finalPrice: toDecimalOrNull(data.finalPrice),
    internalNotes: data.internalNotes ? String(data.internalNotes).trim() : null,
    createdById: data.createdById || user?.id || null,
  };
}

function decorateJob(job) {
  if (!job) return job;

  const paidAmount = (job.incomes || []).reduce((total, income) => {
    const amount = Number(income.amount || 0);
    return income.status === 'paid' ? total + amount : total;
  }, 0);

  const total = Number(job.finalPrice || job.estimatedPrice || 0);
  const pendingAmount = Math.max(total - paidAmount, 0);
  const paymentPercent = total > 0 ? Math.min((paidAmount / total) * 100, 100) : 0;
  const paymentStatus = paidAmount <= 0 ? 'none' : paidAmount < total ? 'partial' : paidAmount === total ? 'paid' : 'overpaid';

  return {
    ...job,
    paidAmount,
    pendingAmount,
    paymentPercent,
    paymentStatus,
    quotesCount: job.quotes?.length || 0,
    expensesCount: job.expenses?.length || 0,
  };
}

export const jobsService = {
  async findMany({ search, status, priority, clientId } = {}) {
    const searchValue = String(search || '').trim();

    const jobs = await prisma.job.findMany({
      where: {
        ...(status ? { status } : {}),
        ...(priority ? { priority } : {}),
        ...(clientId ? { clientId } : {}),
        ...(searchValue
          ? {
              OR: [
                { title: { contains: searchValue, mode: 'insensitive' } },
                { description: { contains: searchValue, mode: 'insensitive' } },
                { serviceType: { contains: searchValue, mode: 'insensitive' } },
                { client: { fullName: { contains: searchValue, mode: 'insensitive' } } },
              ],
            }
          : {}),
      },
      include: {
        client: true,
        quotes: { select: { id: true, quoteNumber: true, title: true, status: true, total: true, pdfUrl: true, createdAt: true } },
        incomes: { select: { id: true, title: true, amount: true, status: true, paidAt: true, createdAt: true } },
        expenses: { select: { id: true, title: true, amount: true, category: true, paidAt: true, createdAt: true } },
        agendaEvents: { select: { id: true, title: true, type: true, status: true, startAt: true } },
        files: true,
      },
      orderBy: [{ priority: 'desc' }, { estimatedDeliveryDate: 'asc' }, { updatedAt: 'desc' }],
    });

    return jobs.map(decorateJob);
  },

  async findById(id) {
    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        client: true,
        quotes: { orderBy: { createdAt: 'desc' }, include: { pdfDocuments: true, items: true } },
        incomes: { orderBy: { createdAt: 'desc' } },
        expenses: { orderBy: { createdAt: 'desc' } },
        agendaEvents: { orderBy: { startAt: 'desc' } },
        files: true,
        createdBy: { select: { id: true, name: true, email: true } },
      },
    });

    if (!job) throw notFound('Trabajo no encontrado');
    return decorateJob(job);
  },

  async create(data, user) {
    if (!data.clientId) throw badRequest('El cliente es requerido');
    if (!data.title) throw badRequest('El título del trabajo es requerido');
    if (data.status && !allowedStatuses.includes(data.status)) throw badRequest('Estado de trabajo inválido');
    if (data.priority && !allowedPriorities.includes(data.priority)) throw badRequest('Prioridad inválida');

    const payload = normalizeJobPayload(data, user);

    return prisma.job.create({
      data: payload,
      include: { client: true, quotes: true, incomes: true, expenses: true, agendaEvents: true, files: true },
    });
  },

  async update(id, data) {
    await this.findById(id);
    if (data.status && !allowedStatuses.includes(data.status)) throw badRequest('Estado de trabajo inválido');
    if (data.priority && !allowedPriorities.includes(data.priority)) throw badRequest('Prioridad inválida');

    const payload = normalizeJobPayload(data);
    delete payload.createdById;

    return prisma.job.update({
      where: { id },
      data: payload,
      include: { client: true, quotes: true, incomes: true, expenses: true, agendaEvents: true, files: true },
    });
  },

  async updateStatus(id, status) {
    if (!allowedStatuses.includes(status)) throw badRequest('Estado de trabajo inválido');

    const updateData = { status };
    if (status === 'delivered') updateData.realDeliveryDate = new Date();
    if (status === 'production') updateData.realStartDate = new Date();

    return prisma.job.update({
      where: { id },
      data: updateData,
      include: { client: true, quotes: true, incomes: true, expenses: true, agendaEvents: true, files: true },
    });
  },

  async remove(id) {
    await this.findById(id);
    return prisma.job.update({
      where: { id },
      data: { status: 'cancelled' },
    });
  },

  async timeline(id) {
    const job = await this.findById(id);
    return {
      job,
      timeline: [
        { label: 'Creado', date: job.createdAt },
        { label: 'Última actualización', date: job.updatedAt },
        job.estimatedStartDate ? { label: 'Inicio estimado', date: job.estimatedStartDate } : null,
        job.realStartDate ? { label: 'Inicio real', date: job.realStartDate } : null,
        job.estimatedDeliveryDate ? { label: 'Entrega estimada', date: job.estimatedDeliveryDate } : null,
        job.realDeliveryDate ? { label: 'Entregado', date: job.realDeliveryDate } : null,
      ].filter(Boolean),
    };
  },
};
