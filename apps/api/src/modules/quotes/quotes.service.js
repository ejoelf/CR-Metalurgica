import { prisma } from '../../config/prisma.js';
import { createCrudService } from '../../utils/crudFactory.js';
import { badRequest } from '../../utils/ApiError.js';
import { notificationsService } from '../notifications/notifications.service.js';

const crud = createCrudService('quote', {
  include: {
    client: true,
    job: true,
    items: true,
  },
});

function calculateTotals(data) {
  const items = data.items || [];
  const itemsTotal = items.reduce((acc, item) => acc + Number(item.quantity || 0) * Number(item.unitPrice || 0), 0);
  const materialsCost = Number(data.materialsCost || 0);
  const laborCost = Number(data.laborCost || 0);
  const paintCost = Number(data.paintCost || 0);
  const extraCost = Number(data.extraCost || 0);
  const discount = Number(data.discount || 0);
  const profitMargin = Number(data.profitMargin || 0);
  const subtotal = itemsTotal + materialsCost + laborCost + paintCost + extraCost;
  const marginAmount = subtotal * (profitMargin / 100);
  const total = subtotal + marginAmount - discount;

  return { itemsTotal, subtotal, total, materialsCost, laborCost, paintCost, extraCost, discount, profitMargin };
}

export const quotesService = {
  ...crud,

  calculateTotals,

  async create(data, user) {
    const totals = calculateTotals(data);
    const quote = await prisma.quote.create({
      data: {
        quoteNumber: data.quoteNumber || `P-${Date.now()}`,
        clientId: data.clientId,
        jobId: data.jobId || null,
        title: data.title,
        description: data.description || null,
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
        internalNotes: data.internalNotes || null,
        createdById: user?.id || data.createdById || null,
        items: data.items?.length
          ? {
              create: data.items.map((item, index) => ({
                name: item.name,
                description: item.description || null,
                quantity: Number(item.quantity || 1),
                unitPrice: Number(item.unitPrice || 0),
                total: Number(item.quantity || 1) * Number(item.unitPrice || 0),
                sortOrder: index,
              })),
            }
          : undefined,
      },
      include: { client: true, job: true, items: true },
    });

    await notificationsService.createSystemNotification({
      title: 'Presupuesto creado',
      message: `Se creo el presupuesto ${quote.quoteNumber}`,
      type: 'info',
      entityType: 'quote',
      entityId: quote.id,
    });

    return quote;
  },

  async updateStatus(id, status) {
    const allowedStatuses = ['draft', 'sent', 'approved', 'rejected', 'expired', 'cancelled'];
    if (!allowedStatuses.includes(status)) throw badRequest('Estado de presupuesto invalido');

    const quote = await prisma.quote.update({
      where: { id },
      data: {
        status,
        sentAt: status === 'sent' ? new Date() : undefined,
        approvedAt: status === 'approved' ? new Date() : undefined,
        rejectedAt: status === 'rejected' ? new Date() : undefined,
      },
      include: { client: true, job: true, items: true },
    });

    if (status === 'approved' && quote.jobId) {
      await prisma.job.update({ where: { id: quote.jobId }, data: { status: 'approved' } });
    }

    await notificationsService.createSystemNotification({
      title: 'Presupuesto actualizado',
      message: `El presupuesto ${quote.quoteNumber} cambio a ${status}`,
      type: status === 'approved' ? 'success' : 'info',
      entityType: 'quote',
      entityId: quote.id,
    });

    return quote;
  },

  async addItem(quoteId, data) {
    const item = await prisma.quoteItem.create({
      data: {
        quoteId,
        name: data.name,
        description: data.description || null,
        quantity: Number(data.quantity || 1),
        unitPrice: Number(data.unitPrice || 0),
        total: Number(data.quantity || 1) * Number(data.unitPrice || 0),
        sortOrder: data.sortOrder || 0,
      },
    });
    await this.recalculateQuote(quoteId);
    return item;
  },

  async updateItem(itemId, data) {
    const item = await prisma.quoteItem.update({
      where: { id: itemId },
      data: {
        ...data,
        total: data.quantity && data.unitPrice ? Number(data.quantity) * Number(data.unitPrice) : undefined,
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
};
