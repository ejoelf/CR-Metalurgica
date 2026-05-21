import { prisma } from '../../config/prisma.js';
import { badRequest, notFound } from '../../utils/ApiError.js';

const allowedStatuses = ['draft', 'sent', 'approved', 'rejected', 'expired', 'cancelled'];
const quoteTextFields = [
  'recipientName',
  'recipientCompany',
  'recipientContactName',
  'recipientPhone',
  'recipientEmail',
  'recipientTaxId',
  'recipientAddress',
  'recipientCity',
  'recipientProvince',
  'recipientAdminAddress',
  'workObject',
  'workLocation',
  'includedTasks',
  'excludedTasks',
  'technicalNotes',
  'paymentTerms',
  'executionTime',
  'warranty',
  'commercialConditions',
];

function toNumber(value) { return Number(value || 0); }
function cleanText(value) { const text = String(value || '').trim(); return text || null; }

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
  if (status && !allowedStatuses.includes(status)) throw badRequest('Estado de presupuesto inválido');
}

function buildQuoteTextPayload(data = {}) {
  return quoteTextFields.reduce((acc, field) => {
    acc[field] = cleanText(data[field]);
    return acc;
  }, {});
}

function hasRecipientData(data = {}) {
  return Boolean(data.clientId || cleanText(data.recipientName) || cleanText(data.recipientCompany) || cleanText(data.recipientContactName));
}

function normalizeQuotePayload(data = {}, user = null) {
  const totals = calculateTotals(data);
  if (!hasRecipientData(data)) throw badRequest('El presupuesto necesita un cliente existente o un destinatario manual');
  if (!data.title) throw badRequest('El título del presupuesto es requerido');
  validateStatus(data.status);

  return {
    quoteNumber: data.quoteNumber || `P-${Date.now()}`,
    clientId: data.clientId || null,
    jobId: data.jobId || null,
    title: String(data.title || '').trim(),
    description: cleanText(data.description),
    status: data.status || 'draft',
    ...buildQuoteTextPayload(data),
    includeDigitalSignature: Boolean(data.includeDigitalSignature),
    materialsCost: totals.materialsCost,
    laborCost: totals.laborCost,
    paintCost: totals.paintCost,
    extraCost: totals.extraCost,
    subtotal: totals.subtotal,
    discount: totals.discount,
    profitMargin: totals.profitMargin,
    total: totals.total,
    validUntil: data.validUntil ? new Date(data.validUntil) : null,
    internalNotes: cleanText(data.internalNotes),
    createdById: data.createdById || user?.id || null,
  };
}

function normalizeQuoteItems(items = []) {
  return (Array.isArray(items) ? items : [])
    .filter((item) => item?.name || item?.description || toNumber(item?.unitPrice) > 0)
    .map((item, index) => {
      const quantity = toNumber(item.quantity || 1);
      const unitPrice = toNumber(item.unitPrice);
      return {
        name: String(item.name || `Ítem ${index + 1}`).trim(),
        description: cleanText(item.description),
        quantity,
        unit: cleanText(item.unit) || 'unidad',
        unitPrice,
        total: quantity * unitPrice,
        note: cleanText(item.note),
        sortOrder: index,
      };
    });
}

async function ensureQuoteClient(quote, user = null) {
  if (quote.clientId) return quote.clientId;
  const fullName = quote.recipientName || quote.recipientCompany || quote.recipientContactName;
  if (!fullName) throw badRequest('Para convertir este presupuesto en trabajo, cargá el nombre del destinatario o vinculá un cliente');

  const client = await prisma.client.create({
    data: {
      fullName,
      phone: quote.recipientPhone || 'Sin teléfono',
      email: quote.recipientEmail || null,
      address: quote.recipientAddress || quote.recipientAdminAddress || null,
      city: quote.recipientCity || null,
      taxId: quote.recipientTaxId || null,
      clientType: quote.recipientCompany ? 'empresa' : 'particular',
      source: 'presupuesto',
      status: 'lead',
      notes: `Cliente creado automáticamente desde el presupuesto ${quote.quoteNumber}.${quote.recipientCompany ? ` Empresa: ${quote.recipientCompany}.` : ''}${quote.recipientContactName ? ` Contacto: ${quote.recipientContactName}.` : ''}`,
    },
  });
  await prisma.quote.update({ where: { id: quote.id }, data: { clientId: client.id } });
  return client.id;
}

export const quotesService = {
  calculateTotals,
  async findMany({ search, status, clientId, jobId } = {}) {
    const searchValue = String(search || '').trim();
    return prisma.quote.findMany({
      where: {
        ...(status ? { status } : {}), ...(clientId ? { clientId } : {}), ...(jobId ? { jobId } : {}),
        ...(searchValue ? { OR: [
          { quoteNumber: { contains: searchValue, mode: 'insensitive' } }, { title: { contains: searchValue, mode: 'insensitive' } }, { description: { contains: searchValue, mode: 'insensitive' } },
          { recipientName: { contains: searchValue, mode: 'insensitive' } }, { recipientCompany: { contains: searchValue, mode: 'insensitive' } }, { recipientContactName: { contains: searchValue, mode: 'insensitive' } },
          { workObject: { contains: searchValue, mode: 'insensitive' } }, { client: { fullName: { contains: searchValue, mode: 'insensitive' } } }, { job: { title: { contains: searchValue, mode: 'insensitive' } } },
        ] } : {}),
      },
      include: quoteInclude(),
      orderBy: { createdAt: 'desc' },
    });
  },
  async findById(id) { const quote = await prisma.quote.findUnique({ where: { id }, include: quoteInclude() }); if (!quote) throw notFound('Presupuesto no encontrado'); return quote; },
  async create(data, user) {
    const payload = normalizeQuotePayload(data, user); const items = normalizeQuoteItems(data.items);
    return prisma.quote.create({ data: { ...payload, items: items.length ? { create: items } : undefined }, include: quoteInclude() });
  },
  async update(id, data) {
    await this.findById(id); const payload = normalizeQuotePayload(data); const items = normalizeQuoteItems(data.items); delete payload.quoteNumber; delete payload.createdById;
    return prisma.$transaction(async (tx) => { await tx.quoteItem.deleteMany({ where: { quoteId: id } }); return tx.quote.update({ where: { id }, data: { ...payload, items: items.length ? { create: items } : undefined }, include: quoteInclude() }); });
  },
  async updateStatus(id, status) {
    validateStatus(status);
    const quote = await prisma.quote.update({ where: { id }, data: { status, sentAt: status === 'sent' ? new Date() : undefined, approvedAt: status === 'approved' ? new Date() : undefined, rejectedAt: status === 'rejected' ? new Date() : undefined }, include: quoteInclude() });
    if (status === 'approved' && quote.jobId) await prisma.job.update({ where: { id: quote.jobId }, data: { status: 'approved' } });
    return quote;
  },
  async convertToJob(id, user = null) {
    const quote = await this.findById(id); const clientId = await ensureQuoteClient(quote, user);
    if (quote.jobId) {
      const job = await prisma.job.update({ where: { id: quote.jobId }, data: { clientId, status: 'approved', finalPrice: quote.total, internalNotes: quote.internalNotes || quote.description || undefined }, include: { client: true, quotes: true, incomes: true, expenses: true, agendaEvents: true, files: true } });
      const updatedQuote = await prisma.quote.update({ where: { id }, data: { clientId, status: 'approved', approvedAt: new Date() }, include: quoteInclude() });
      return { job, quote: updatedQuote, created: false };
    }
    const job = await prisma.job.create({ data: { clientId, title: quote.title, description: quote.workObject || quote.description, serviceType: 'Trabajo desde presupuesto', status: 'approved', priority: 'normal', estimatedPrice: quote.total, finalPrice: quote.total, internalNotes: quote.internalNotes || quote.commercialConditions || quote.description || null, createdById: user?.id || quote.createdById || null }, include: { client: true, quotes: true, incomes: true, expenses: true, agendaEvents: true, files: true } });
    const updatedQuote = await prisma.quote.update({ where: { id }, data: { clientId, jobId: job.id, status: 'approved', approvedAt: new Date() }, include: quoteInclude() });
    return { job, quote: updatedQuote, created: true };
  },
  async addItem(quoteId, data) { await this.findById(quoteId); const itemData = normalizeQuoteItems([data])[0] || { name: 'Nuevo ítem', quantity: 1, unit: 'unidad', unitPrice: 0, total: 0, sortOrder: 0 }; const item = await prisma.quoteItem.create({ data: { quoteId, ...itemData } }); await this.recalculateQuote(quoteId); return item; },
  async updateItem(itemId, data) {
    const current = await prisma.quoteItem.findUnique({ where: { id: itemId } }); if (!current) throw notFound('Ítem no encontrado');
    const quantity = data.quantity !== undefined ? toNumber(data.quantity) : Number(current.quantity || 1); const unitPrice = data.unitPrice !== undefined ? toNumber(data.unitPrice) : Number(current.unitPrice || 0);
    const item = await prisma.quoteItem.update({ where: { id: itemId }, data: { name: data.name !== undefined ? String(data.name).trim() : undefined, description: data.description !== undefined ? cleanText(data.description) : undefined, quantity, unit: data.unit !== undefined ? cleanText(data.unit) || 'unidad' : undefined, unitPrice, total: quantity * unitPrice, note: data.note !== undefined ? cleanText(data.note) : undefined, sortOrder: data.sortOrder !== undefined ? Number(data.sortOrder) : undefined } });
    await this.recalculateQuote(item.quoteId); return item;
  },
  async deleteItem(itemId) { const item = await prisma.quoteItem.delete({ where: { id: itemId } }); await this.recalculateQuote(item.quoteId); return item; },
  async recalculateQuote(quoteId) { const quote = await prisma.quote.findUnique({ where: { id: quoteId }, include: { items: true } }); if (!quote) return null; const totals = calculateTotals({ ...quote, items: quote.items }); return prisma.quote.update({ where: { id: quoteId }, data: { subtotal: totals.subtotal, total: totals.total } }); },
  async remove(id) { await this.findById(id); return prisma.quote.update({ where: { id }, data: { status: 'cancelled' }, include: quoteInclude() }); },
  async markSent(id) { return this.updateStatus(id, 'sent'); },
};