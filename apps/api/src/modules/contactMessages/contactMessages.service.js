import { prisma } from '../../config/prisma.js';
import { createCrudService } from '../../utils/crudFactory.js';
import { badRequest, notFound } from '../../utils/ApiError.js';
import { notificationsService } from '../notifications/notifications.service.js';

const allowedStatuses = ['new', 'contacted', 'converted_to_client', 'dismissed'];

const crud = createCrudService('contactMessage', {
  include: { client: true },
  orderBy: { createdAt: 'desc' },
});

function normalizeStatus(status) {
  if (!allowedStatuses.includes(status)) throw badRequest('Estado de mensaje inválido');
  return status;
}

function folderWhere(folder = 'inbox') {
  if (folder === 'converted') return { status: 'converted_to_client' };
  if (folder === 'archived') return { status: 'dismissed' };
  if (folder === 'sent' || folder === 'drafts') return null;
  return { status: { in: ['new', 'contacted', 'converted_to_client'] } };
}

export const contactMessagesService = {
  ...crud,

  async findMany(query = {}) {
    const searchValue = String(query.search || '').trim();
    const statusWhere = query.status ? { status: normalizeStatus(query.status) } : folderWhere(query.folder);
    if (!statusWhere) return [];

    return prisma.contactMessage.findMany({
      where: {
        ...statusWhere,
        ...(searchValue
          ? {
              OR: [
                { fullName: { contains: searchValue, mode: 'insensitive' } },
                { phone: { contains: searchValue, mode: 'insensitive' } },
                { email: { contains: searchValue, mode: 'insensitive' } },
                { serviceInterest: { contains: searchValue, mode: 'insensitive' } },
                { message: { contains: searchValue, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      include: { client: true },
      orderBy: { createdAt: 'desc' },
    });
  },

  async findById(id) {
    const message = await prisma.contactMessage.findUnique({ where: { id }, include: { client: true } });
    if (!message) throw notFound('Mensaje no encontrado');
    return message;
  },

  async create(data) {
    const message = await prisma.contactMessage.create({
      data: {
        fullName: data.fullName || data.name,
        phone: data.phone,
        email: data.email || null,
        message: data.message,
        serviceInterest: data.serviceInterest || null,
        status: 'new',
      },
    });

    await notificationsService.createSystemNotification({
      title: 'Nueva consulta web',
      message: `Nueva consulta de ${message.fullName}`,
      type: 'info',
      entityType: 'contactMessage',
      entityId: message.id,
    });

    return message;
  },

  async markAsRead(id) {
    const message = await this.findById(id);
    if (message.status !== 'new') return message;
    return prisma.contactMessage.update({ where: { id }, data: { status: 'contacted' }, include: { client: true } });
  },

  async updateStatus(id, status) {
    return prisma.contactMessage.update({ where: { id }, data: { status: normalizeStatus(status) }, include: { client: true } });
  },

  async convertToClient(id) {
    const message = await this.findById(id);

    if (message.clientId) {
      await prisma.contactMessage.update({ where: { id }, data: { status: 'converted_to_client' } });
      return prisma.client.findUnique({ where: { id: message.clientId } });
    }

    const client = await prisma.client.create({
      data: {
        fullName: message.fullName,
        phone: message.phone,
        email: message.email,
        source: 'web_contact',
        notes: message.message,
        status: 'lead',
      },
    });

    await prisma.contactMessage.update({ where: { id }, data: { status: 'converted_to_client', clientId: client.id } });

    await notificationsService.createSystemNotification({
      title: 'Consulta convertida en cliente',
      message: `${client.fullName} fue agregado a clientes desde mensajes.`,
      type: 'success',
      entityType: 'client',
      entityId: client.id,
    });

    return client;
  },

  async remove(id) {
    await this.findById(id);
    return prisma.contactMessage.update({ where: { id }, data: { status: 'dismissed' }, include: { client: true } });
  },

  async unreadCount() {
    return prisma.contactMessage.count({ where: { status: 'new' } });
  },
};
