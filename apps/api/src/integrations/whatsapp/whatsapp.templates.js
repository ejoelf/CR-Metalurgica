export const WHATSAPP_TEMPLATES = {
  QUOTE_READY: 'quote_ready',
  JOB_COMPLETED: 'job_completed',
  PAYMENT_REMINDER: 'payment_reminder',
  DELIVERY_REMINDER: 'delivery_reminder',
  WELCOME_CLIENT: 'welcome_client',
};

export function buildWhatsAppText(template, variables = {}) {
  const clientName = variables.clientName || 'cliente';
  const businessName = variables.businessName || 'CF Metal Pintura';

  const templates = {
    [WHATSAPP_TEMPLATES.QUOTE_READY]: `Hola ${clientName}, ya tenemos listo tu presupuesto de ${businessName}. Podés revisarlo acá: ${variables.quoteUrl || ''}`,
    [WHATSAPP_TEMPLATES.JOB_COMPLETED]: `Hola ${clientName}, tu trabajo ya está listo. Coordinamos entrega o retiro cuando te quede cómodo.`,
    [WHATSAPP_TEMPLATES.PAYMENT_REMINDER]: `Hola ${clientName}, te recordamos que tenés un pago pendiente de ${variables.amount || ''}. Cualquier duda nos escribís.`,
    [WHATSAPP_TEMPLATES.DELIVERY_REMINDER]: `Hola ${clientName}, te recordamos la entrega programada para ${variables.date || ''}.`,
    [WHATSAPP_TEMPLATES.WELCOME_CLIENT]: `Hola ${clientName}, gracias por contactar a ${businessName}. Vamos a revisar tu consulta y responderte a la brevedad.`,
  };

  return templates[template] || variables.message || '';
}
