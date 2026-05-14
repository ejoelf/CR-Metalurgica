import { prisma } from '../../config/prisma.js';
import { getEmailProvider } from './email.providers.js';

export async function sendEmail(payload) {
  const providerName = process.env.EMAIL_PROVIDER || 'mock';
  const from = payload.from || process.env.EMAIL_FROM || 'CF Metal Pintura <no-reply@cfmetalpintura.com>';
  const normalizedPayload = {
    from,
    to: payload.to,
    subject: payload.subject,
    html: payload.html,
    text: payload.text || '',
    attachments: payload.attachments || [],
  };

  if (!payload.to) {
    throw new Error('Destinatario de email requerido');
  }

  let status = 'mocked';
  let providerResponse = null;

  if (providerName === 'smtp') {
    const provider = getEmailProvider();
    if (!provider) throw new Error('Proveedor SMTP no configurado');
    providerResponse = await provider.sendMail(normalizedPayload);
    status = 'sent';
  }

  const log = await prisma.messageLog.create({
    data: {
      type: 'email',
      provider: providerName,
      destination: payload.to,
      payload: normalizedPayload,
      status,
    },
  });

  return { success: true, provider: providerName, status, logId: log.id, providerResponse };
}

export async function sendQuoteEmail({ to, clientName, quoteNumber, quoteUrl, html }) {
  return sendEmail({
    to,
    subject: `Presupuesto ${quoteNumber} - CF Metal Pintura`,
    html,
    text: `Hola ${clientName || 'cliente'}, tu presupuesto ${quoteNumber} está listo: ${quoteUrl}`,
  });
}
