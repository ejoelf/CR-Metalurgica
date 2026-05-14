import { prisma } from '../../config/prisma.js';

export async function logWhatsAppMessage({ destination, payload, status = 'mocked', provider = process.env.WHATSAPP_PROVIDER || 'mock' }) {
  return prisma.messageLog.create({
    data: {
      type: 'whatsapp',
      provider,
      destination,
      payload,
      status,
    },
  });
}
