import { prisma } from '../../config/prisma.js';
import { createCrudService } from '../../utils/crudFactory.js';
import { notificationsService } from '../notifications/notifications.service.js';

const crud = createCrudService('contactMessage', {
  include: { client: true },
});

export const contactMessagesService = {
  ...crud,

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

  async updateStatus(id, status) {
    return prisma.contactMessage.update({
      where: { id },
      data: { status },
      include: { client: true },
    });
  },

  async convertToClient(id) {
    const message = await this.findById(id);

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

    await prisma.contactMessage.update({
      where: { id },
      data: { status: 'converted_to_client', clientId: client.id },
    });

    return client;
  },
};
