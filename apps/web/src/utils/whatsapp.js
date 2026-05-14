export function buildWhatsAppUrl(phone, message = '') {
  const normalizedPhone = String(phone || '').replace(/[^0-9]/g, '');
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${normalizedPhone}${encodedMessage ? `?text=${encodedMessage}` : ''}`;
}

export function quoteMessage(service = 'trabajo a medida') {
  return `Hola CF Metal Pintura, quiero consultar por un presupuesto para ${service}.`;
}
