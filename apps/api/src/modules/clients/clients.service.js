import { prisma } from '../../config/prisma.js';
import { notFound } from '../../utils/ApiError.js';

function normalizeClientPayload(data = {}) {
  const firstName = String(data.firstName || '').trim();
  const lastName = String(data.lastName || '').trim();
  const fullName = String(data.fullName || `${firstName} ${lastName}`.trim()).trim();

  return {
    fullName,
    phone: String(data.phone || '').trim(),
    email: data.email ? String(data.email).trim() : null,
    address: data.address ? String(data.address).trim() : null,
    city: data.city ? String(data.city).trim() : null,
    notes: data.notes ? String(data.notes).trim() : null,
    source: data.source ? String(data.source).trim() : 'crm',
    status: data.status || 'active',
  };
}

function splitName(fullName = '') {
  const parts = String(fullName).trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] || '',
    lastName: parts.slice(1).join(' '),
  };
}

function decorateClient(client) {
  if (!client) return client;
  const { firstName, lastName } = splitName(client.fullName);
  return {
    ...client,
    firstName,
    lastName,
    jobsCount: client.jobs?.length || 0,
    quotesCount: client.quotes?.length || 0,
    incomesCount: client.incomes?.length || 0,
    agendaEventsCount: client.agendaEvents?.length || 0,
  };
}

export const clientsService = {
  async findMany({ search } = {}) {
    const searchValue = String(search || '').trim();

    const clients = await prisma.client.findMany({
      where: searchValue
        ? {
            OR: [
              { fullName: { contains: searchValue, mode: 'insensitive' } },
              { phone: { contains: searchValue, mode: 'insensitive' } },
              { email: { contains: searchValue, mode: 'insensitive' } },
              { city: { contains: searchValue, mode: 'insensitive' } },
            ],
          }
        : {},
      include: {
        jobs: { select: { id: true, title: true, status: true, priority: true, dueDate: true, finalPrice: true, updatedAt: true } },
        quotes: { select: { id: true, quoteNumber: true, title: true, status: true, total: true, pdfUrl: true, createdAt: true } },
        incomes: { select: { id: true, title: true, amount: true, status: true, paidAt: true, createdAt: true } },
        agendaEvents: { select: { id: true, title: true, type: true, status: true, startAt: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const decorated = clients.map(decorateClient);

    if (!searchValue || searchValue.length !== 1) return decorated;

    const lower = searchValue.toLowerCase();
    return decorated.sort((a, b) => {
      const aFirst = a.firstName.toLowerCase().startsWith(lower) ? 0 : 1;
      const bFirst = b.firstName.toLowerCase().startsWith(lower) ? 0 : 1;
      if (aFirst !== bFirst) return aFirst - bFirst;

      const aLast = a.lastName.toLowerCase().startsWith(lower) ? 0 : 1;
      const bLast = b.lastName.toLowerCase().startsWith(lower) ? 0 : 1;
      if (aLast !== bLast) return aLast - bLast;

      return a.fullName.localeCompare(b.fullName, 'es');
    });
  },

  async findById(id) {
    const client = await prisma.client.findUnique({
      where: { id },
      include: {
        jobs: { orderBy: { updatedAt: 'desc' }, include: { quotes: true, incomes: true } },
        quotes: { orderBy: { createdAt: 'desc' }, include: { pdfDocuments: true, items: true } },
        incomes: { orderBy: { createdAt: 'desc' } },
        agendaEvents: { orderBy: { startAt: 'desc' } },
        contactMessages: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!client) throw notFound('Cliente no encontrado');
    return decorateClient(client);
  },

  async create(data) {
    const payload = normalizeClientPayload(data);
    return prisma.client.create({
      data: payload,
      include: { jobs: true, quotes: true, incomes: true, agendaEvents: true },
    });
  },

  async update(id, data) {
    await this.findById(id);
    const payload = normalizeClientPayload(data);
    return prisma.client.update({
      where: { id },
      data: payload,
      include: { jobs: true, quotes: true, incomes: true, agendaEvents: true },
    });
  },

  async remove(id) {
    await this.findById(id);
    return prisma.client.update({
      where: { id },
      data: { status: 'archived' },
    });
  },
};
