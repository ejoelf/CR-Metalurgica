export const BUSINESS_TIME_ZONE = 'America/Argentina/Cordoba';

function formatPartsInTimeZone(value, timeZone = BUSINESS_TIME_ZONE) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(date);

  return Object.fromEntries(parts.map((part) => [part.type, part.value]));
}

export function getUserTimeZone() {
  return BUSINESS_TIME_ZONE;
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
    timeZone: options.timeZone || BUSINESS_TIME_ZONE,
  }).format(date);
}

export function formatDateTime(value, options = {}) {
  if (!value) return '-';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '-';

  return new Intl.DateTimeFormat('es-AR', {
    dateStyle: options.dateStyle || 'medium',
    timeStyle: options.timeStyle || 'short',
    timeZone: options.timeZone || BUSINESS_TIME_ZONE,
  }).format(date);
}

export function toInputDate(value, timeZone = BUSINESS_TIME_ZONE) {
  const parts = formatPartsInTimeZone(value, timeZone);
  if (!parts) return '';
  return `${parts.year}-${parts.month}-${parts.day}`;
}

export function toInputDateTime(value, timeZone = BUSINESS_TIME_ZONE) {
  const parts = formatPartsInTimeZone(value, timeZone);
  if (!parts) return '';
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
}

export function buildArgentinaDateTime(date, time = '00:00') {
  if (!date || !time) return null;
  return `${date}T${time}:00-03:00`;
}

export function calculatePaymentSummary(total = 0, paid = 0) {
  const totalValue = Number(total || 0);
  const paidValue = Number(paid || 0);
  const pending = Math.max(totalValue - paidValue, 0);
  const percent = totalValue > 0 ? Math.min((paidValue / totalValue) * 100, 100) : 0;
  const status = paidValue <= 0 ? 'none' : paidValue < totalValue ? 'partial' : paidValue === totalValue ? 'paid' : 'overpaid';

  return { total: totalValue, paid: paidValue, pending, percent, status };
}
