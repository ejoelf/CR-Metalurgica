export function formatCurrency(value, currency = 'ARS') {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency,
  }).format(Number(value || 0));
}
