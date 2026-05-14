export function buildQuotePdfContent({ quote, client, company }) {
  return {
    title: `Presupuesto ${quote.quoteNumber}`,
    company: {
      name: company?.publicName || company?.businessName || 'CF Metal Pintura',
      phone: company?.phone || '',
      whatsapp: company?.whatsapp || '',
      email: company?.email || '',
      address: company?.address || '',
    },
    client: {
      name: client?.fullName || quote.client?.fullName || 'Cliente',
      phone: client?.phone || quote.client?.phone || '',
      email: client?.email || quote.client?.email || '',
      address: client?.address || quote.client?.address || '',
    },
    quote: {
      number: quote.quoteNumber,
      title: quote.title,
      description: quote.description || '',
      status: quote.status,
      createdAt: quote.createdAt,
      validUntil: quote.validUntil,
      materialsCost: Number(quote.materialsCost || 0),
      laborCost: Number(quote.laborCost || 0),
      paintCost: Number(quote.paintCost || 0),
      extraCost: Number(quote.extraCost || 0),
      subtotal: Number(quote.subtotal || 0),
      discount: Number(quote.discount || 0),
      profitMargin: Number(quote.profitMargin || 0),
      total: Number(quote.total || 0),
      notes: quote.internalNotes || '',
    },
    items: quote.items || [],
  };
}

export function formatMoney(value) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(Number(value || 0));
}

export function formatDate(value) {
  if (!value) return '-';
  return new Intl.DateTimeFormat('es-AR').format(new Date(value));
}
