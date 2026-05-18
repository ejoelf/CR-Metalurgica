export const BUSINESS_TIME_ZONE = 'America/Argentina/Cordoba';

export function getUserTimeZone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || BUSINESS_TIME_ZONE;
}

export function formatMoney(value, currency = 'ARS') {
  const numericValue = Number(value || 0);
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(numericValue);
}

export function formatPercent(value, digits = 1) {
  const numericValue = Number(value || 0);
  return `${numericValue.toFixed(digits)}%`;
}

export function formatDate(value, options = {}) {
  if (!value) return '-';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '-';

  return new Intl.DateTimeFormat('es-AR', {
    dateStyle: options.dateStyle || 'medium',
    timeZone: options.timeZone || getUserTimeZone(),
  }).format(date);
}

export function formatDateTime(value, options = {}) {
  if (!value) return '-';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '-';

  return new Intl.DateTimeFormat('es-AR', {
    dateStyle: options.dateStyle || 'medium',
    timeStyle: options.timeStyle || 'short',
    timeZone: options.timeZone || getUserTimeZone(),
  }).format(date);
}

export function toInputDate(value) {
  if (!value) return '';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
}

export function toInputDateTime(value) {
  if (!value) return '';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 16);
}

export function calculatePaymentSummary(total = 0, paid = 0) {
  const totalValue = Number(total || 0);
  const paidValue = Number(paid || 0);
  const pending = Math.max(totalValue - paidValue, 0);
  const percent = totalValue > 0 ? Math.min((paidValue / totalValue) * 100, 100) : 0;
  const status = paidValue <= 0 ? 'none' : paidValue < totalValue ? 'partial' : paidValue === totalValue ? 'paid' : 'overpaid';

  return { total: totalValue, paid: paidValue, pending, percent, status };
}
