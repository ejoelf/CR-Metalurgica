import { buildWhatsAppText } from './whatsapp.templates.js';
import { logWhatsAppMessage } from './whatsapp.logger.js';

export async function sendWhatsAppMessage(payload) {
  const provider = process.env.WHATSAPP_PROVIDER || 'mock';
  const destination = payload.to;
  const text = payload.message || buildWhatsAppText(payload.template, payload.variables);

  const normalizedPayload = {
    to: destination,
    type: payload.type || 'text',
    template: payload.template || null,
    variables: payload.variables || {},
    attachments: payload.attachments || [],
    message: text,
  };

  if (!destination) {
    throw new Error('Destino de WhatsApp requerido');
  }

  const log = await logWhatsAppMessage({
    destination,
    provider,
    payload: normalizedPayload,
    status: provider === 'mock' ? 'mocked' : 'queued',
  });

  return {
    success: true,
    provider,
    status: provider === 'mock' ? 'mocked' : 'queued',
    message: text,
    logId: log.id,
  };
}

export async function sendQuoteWhatsApp({ to, quote, quoteUrl, clientName }) {
  return sendWhatsAppMessage({
    to,
    template: 'quote_ready',
    variables: {
      clientName,
      quoteUrl,
      quoteNumber: quote?.quoteNumber,
      businessName: 'CF Metal Pintura',
    },
  });
}
