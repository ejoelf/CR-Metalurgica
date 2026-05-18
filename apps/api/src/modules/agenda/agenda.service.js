import { prisma } from '../../config/prisma.js';
import { badRequest, notFound } from '../../utils/ApiError.js';
import { systemActionsService } from '../../services/systemActions.service.js';

const allowedStatuses = ['scheduled', 'completed', 'cancelled', 'postponed'];
const allowedTypes = ['visit', 'delivery', 'meeting', 'task', 'reminder', 'other'];

function parseDate(value, fallback = null) {
  if (!value) return fallback;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) throw badRequest('Fecha inválida');
  return date;
}

function getRange(query = {}) {
  const now = new Date();
  const start = query.start ? parseDate(query.start) : new Date(now.getFullYear(), now.getMonth(), 1);
  const end = query.end ? parseDate(query.end) : new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return { start, end };
}

function normalizePayload(data = {}, user = null) {
  if (!data.title) throw badRequest('El título del evento es requerido');

  const startAt = parseDate(data.startAt);
  const endAt = parseDate(data.endAt, null);
  const reminderAt = parseDate(data.reminderAt, null);

  if (endAt && endAt <= startAt) throw badRequest('La fecha de fin debe ser posterior al inicio');
  if (data.status && !allowedStatuses.includes(data.status)) throw badRequest('Estado de agenda inválido');
  if (data.type && !allowedTypes.includes(data.type)) throw badRequest('Tipo de evento inválido');

  return {
    title: String(data.title).trim(),
    description: data.description ? String(data.description).trim() : null,
    type: data.type || 'task',
    status: data.status || 'scheduled',
    startAt,
    endAt,
    reminderAt,
    location: data.location ? String(data.location).trim() : null,
    clientId: data.clientId || null,
    jobId: data.jobId || null,
    quoteId: data.quoteId || null,
    assignedToId: data.assignedToId || null,
    createdById: data.createdById || user?.id || null,
  };
}

function includeRelations() {
  return {
    client: true,
    job: true,
    quote: true,
    assignedTo: { select: { id: true, name: true, email: true } },
    createdBy: { select: { id: true, name: true, email: true } },
  };
}

export const agendaService = {
  async findMany(query = {}) {
    const { start, end } = getRange(query);
    const searchValue = String(query.search || '').trim();

    return prisma.agendaEvent.findMany({
      where: {
        startAt: { gte: start, lt: end },
        ...(query.status ? { status: query.status } : {}),
        ...(query.type ? { type: query.type } : {}),
        ...(query.clientId ? { clientId: query.clientId } : {}),
        ...(query.jobId ? { jobId: query.jobId } : {}),
        ...(query.quoteId ? { quoteId: query.quoteId } : {}),
        ...(searchValue
          ? {
              OR: [
                { title: { contains: searchValue, mode: 'insensitive' } },
                { description: { contains: searchValue, mode: 'insensitive' } },
                { location: { contains: searchValue, mode: 'insensitive' } },
                { client: { fullName: { contains: searchValue, mode: 'insensitive' } } },
                { job: { title: { contains: searchValue, mode: 'insensitive' } } },
                { quote: { title: { contains: searchValue, mode: 'insensitive' } } },
              ],
            }
          : {}),
      },
      include: includeRelations(),
      orderBy: { startAt: 'asc' },
    });
  },

  async findById(id) {
    const event = await prisma.agendaEvent.findUnique({ where: { id }, include: includeRelations() });
    if (!event) throw notFound('Evento de agenda no encontrado');
    return event;
  },

  async create(data, user) {
    const payload = normalizePayload(data, user);
    const event = await prisma.agendaEvent.create({ data: payload, include: includeRelations() });

    await systemActionsService.notify({
      userId: event.assignedToId || null,
      name: 'agenda_event_created',
      title: 'Nuevo evento de agenda',
      message: `Se agendó: ${event.title}`,
      type: 'reminder',
      entityType: 'agendaEvent',
      entityId: event.id,
      payload: { startAt: event.startAt, reminderAt: event.reminderAt, clientId: event.clientId, jobId: event.jobId },
    });

    return event;
  },

  async update(id, data) {
    await this.findById(id);
    const payload = normalizePayload(data);
    delete payload.createdById;

    return prisma.agendaEvent.update({ where: { id }, data: payload, include: includeRelations() });
  },

  async updateStatus(id, status) {
    if (!allowedStatuses.includes(status)) throw badRequest('Estado de agenda inválido');
    return prisma.agendaEvent.update({ where: { id }, data: { status }, include: includeRelations() });
  },

  async remove(id) {
    await this.findById(id);
    return prisma.agendaEvent.update({ where: { id }, data: { status: 'cancelled' }, include: includeRelations() });
  },

  async today(userId = null) {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(start.getDate() + 1);

    return prisma.agendaEvent.findMany({
      where: {
        startAt: { gte: start, lt: end },
        status: { not: 'cancelled' },
        ...(userId ? { OR: [{ assignedToId: userId }, { assignedToId: null }] } : {}),
      },
      include: includeRelations(),
      orderBy: { startAt: 'asc' },
    });
  },
};
