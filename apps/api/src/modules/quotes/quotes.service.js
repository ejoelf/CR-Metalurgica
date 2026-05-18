import { prisma } from '../../config/prisma.js';
import { badRequest, notFound } from '../../utils/ApiError.js';

const allowedStatuses = ['draft', 'sent', 'approved', 'rejected', 'expired', 'cancelled'];

function toNumber(value) {
  return Number(value || 0);
}

function calculateTotals(data = {}) {
  const items = data.items || [];
  const itemsTotal = items.reduce((acc, item) => acc + toNumber(item.quantity || 1) * toNumber(item.unitPrice), 0);
  const materialsCost = toNumber(data.materialsCost);
  const laborCost = toNumber(data.laborCost);
  const paintCost = toNumber(data.paintCost);
  const extraCost = toNumber(data.extraCost);
  const discount = toNumber(data.discount);
  const profitMargin = toNumber(data.profitMargin);
  const subtotal = itemsTotal + materialsCost + laborCost + paintCost + extraCost;
  const marginAmount = subtotal * (profitMargin / 100);
  const total = Math.max(subtotal + marginAmount - discount, 0);

  return { itemsTotal, subtotal, total, materialsCost, laborCost, paintCost, extraCost, discount, profitMargin };
}

function quoteInclude() {
  return {
    client: true,
    job: true,
    items: { orderBy: { sortOrder: 'asc' } },
    pdfDocuments: true,
    incomes: true,
    files: true,
    createdBy: { select: { id: true, name: true, email: true } },
  };
}

function validateStatus(status) {
  if (status && !allowedStatuses.includes(status)) {
    throw badRequest('Estado de presupuesto inválido');
  }
}

function normalizeQuotePayload(data = {}, user = null) {
  const totals = calculateTotals(data);

  if (!data.clientId) throw badRequest('El cliente es requerido para guardar el presupuesto en esta versión');
  if (!data.title) throw badRequest('El título del presupuesto es requerido');

  validateStatus(data.status);

  return {
    quoteNumber: data.quoteNumber || `P-${Date.now()}`,
    clientId: data.clientId,
    jobId: data.jobId || null,
    title: String(data.title || '').trim(),
    description: data.description ? String(data.description).trim() : null,
    status: data.status || 'draft',
    materialsCost: totals.materialsCost,
    laborCost: totals.laborCost,
    paintCost: totals.paintCost,
    extraCost: totals.extraCost,
    subtotal: totals.subtotal,
    discount: totals.discount,
    profitMargin: totals.profitMargin,
    total: totals.total,
    validUntil: data.validUntil ? new Date(data.validUntil) : null,
    internalNotes: data.internalNotes ? String(data.internalNotes).trim() : null,
    createdById: data.createdById || user?.id || null,
  };
}

export const quotesService = {
  calculateTotals,

  async findMany({ search, status, clientId, jobId } = {}) {
    const searchValue = String(search || '').trim();

    return prisma.quote.findMany({
      where: {
        ...(status ? { status } : {}),
        ...(clientId ? { clientId } : {}),
        ...(jobId ? { jobId } : {}),
        ...(searchValue
          ? {
              OR: [
                { quoteNumber: { contains: searchValue, mode: 'insensitive' } },
                { title: { contains: searchValue, mode: 'insensitive' } },
                { description: { contains: searchValue, mode: 'insensitive' } },
                { client: { fullName: { contains: searchValue, mode: 'insensitive' } } },
                { job: { title: { contains: searchValue, mode: 'insensitive' } } },
              ],
            }
          : {}),
      },
      include: quoteInclude(),
      orderBy: { createdAt: 'desc' },
    });
  },

  async findById(id) {
    const quote = await prisma.quote.findUnique({ where: { id }, include: quoteInclude() });
    if (!quote) throw notFound('Presupuesto no encontrado');
    return quote;
  },

  async create(data, user) {
    const payload = normalizeQuotePayload(data, user);

    return prisma.quote.create({
      data: {
        ...payload,
        items: data.items?.length
          ? {
              create: data.items.map((item, index) => ({
                name: String(item.name || `Ítem ${index + 1}`).trim(),
                description: item.description ? String(item.description).trim() : null,
                quantity: toNumber(item.quantity || 1),
                unitPrice: toNumber(item.unitPrice),
                total: toNumber(item.quantity || 1) * toNumber(item.unitPrice),
                sortOrder: index,
              })),
            }
          : undefined,
      },
      include: quoteInclude(),
    });
  },

  async update(id, data) {
    await this.findById(id);
    const payload = normalizeQuotePayload(data);
    delete payload.quoteNumber;
    delete payload.createdById;

    return prisma.quote.update({
      where: { id },
      data: payload,
      include: quoteInclude(),
    });
  },

  async updateStatus(id, status) {
    validateStatus(status);

    const quote = await prisma.quote.update({
      where: { id },
      data: {
        status,
        sentAt: status === 'sent' ? new Date() : undefined,
        approvedAt: status === 'approved' ? new Date() : undefined,
        rejectedAt: status === 'rejected' ? new Date() : undefined,
      },
      include: quoteInclude(),
    });

    if (status === 'approved' && quote.jobId) {
      await prisma.job.update({ where: { id: quote.jobId }, data: { status: 'approved' } });
    }

    return quote;
  },

  async addItem(quoteId, data) {
    await this.findById(quoteId);
    const item = await prisma.quoteItem.create({
      data: {
        quoteId,
        name: String(data.name || 'Nuevo ítem').trim(),
        description: data.description ? String(data.description).trim() : null,
        quantity: toNumber(data.quantity || 1),
        unitPrice: toNumber(data.unitPrice),
        total: toNumber(data.quantity || 1) * toNumber(data.unitPrice),
        sortOrder: Number(data.sortOrder || 0),
      },
    });
    await this.recalculateQuote(quoteId);
    return item;
  },

  async updateItem(itemId, data) {
    const current = await prisma.quoteItem.findUnique({ where: { id: itemId } });
    if (!current) throw notFound('Ítem no encontrado');

    const quantity = data.quantity !== undefined ? toNumber(data.quantity) : Number(current.quantity || 1);
    const unitPrice = data.unitPrice !== undefined ? toNumber(data.unitPrice) : Number(current.unitPrice || 0);

    const item = await prisma.quoteItem.update({
      where: { id: itemId },
      data: {
        name: data.name !== undefined ? String(data.name).trim() : undefined,
        description: data.description !== undefined ? String(data.description || '').trim() || null : undefined,
        quantity,
        unitPrice,
        total: quantity * unitPrice,
        sortOrder: data.sortOrder !== undefined ? Number(data.sortOrder) : undefined,
      },
    });
    await this.recalculateQuote(item.quoteId);
    return item;
  },

  async deleteItem(itemId) {
    const item = await prisma.quoteItem.delete({ where: { id: itemId } });
    await this.recalculateQuote(item.quoteId);
    return item;
  },

  async recalculateQuote(quoteId) {
    const quote = await prisma.quote.findUnique({ where: { id: quoteId }, include: { items: true } });
    if (!quote) return null;
    const totals = calculateTotals({ ...quote, items: quote.items });
    return prisma.quote.update({ where: { id: quoteId }, data: { subtotal: totals.subtotal, total: totals.total } });
  },

  async remove(id) {
    await this.findById(id);
    return prisma.quote.update({ where: { id }, data: { status: 'cancelled' }, include: quoteInclude() });
  },

  async markSent(id) {
    return this.updateStatus(id, 'sent');
  },
};
