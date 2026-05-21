export const JOB_STATUS_LABELS = {
  pending: 'Pendiente',
  quoted: 'Presupuestado',
  approved: 'Aprobado',
  production: 'Producción',
  painted: 'Pintura',
  delivered: 'Entregado',
  completed: 'Completado',
  cancelled: 'Cancelado',
  on_hold: 'En espera',
  rescheduled: 'Reprogramado',
};

export const QUOTE_STATUS_LABELS = {
  draft: 'Borrador',
  draft_auto: 'Borrador automático',
  ready: 'Listo',
  not_sent: 'No enviado',
  sent: 'Enviado',
  viewed: 'Visto',
  accepted: 'Aceptado',
  rejected: 'Rechazado',
  expired: 'Vencido',
  converted_to_job: 'Convertido a trabajo',
  cancelled: 'Cancelado',
};

export const PAYMENT_STATUS_LABELS = {
  none: 'Sin pago',
  pending: 'Pendiente',
  partial: 'Parcial',
  paid: 'Pagado',
  overpaid: 'Revisar saldo',
  cancelled: 'Cancelado',
};

export const PRIORITY_LABELS = {
  low: 'Baja',
  normal: 'Normal',
  high: 'Alta',
  urgent: 'Urgente',
};

export const MESSAGE_STATUS_LABELS = {
  new: 'Nuevo',
  read: 'Leído',
  replied: 'Respondido',
  converted_to_client: 'Convertido a cliente',
  archived: 'Archivado',
  deleted: 'Eliminado',
};

export const NOTIFICATION_TYPE_LABELS = {
  message: 'Mensaje',
  agenda: 'Agenda',
  quote: 'Presupuesto',
  job: 'Trabajo',
  finance: 'Finanzas',
  reminder: 'Recordatorio',
  automation: 'Automatización',
  info: 'Información',
  success: 'Correcto',
  warning: 'Advertencia',
  error: 'Error',
};

export const NOTIFICATION_STATUS_LABELS = {
  unread: 'No leída',
  read: 'Leída',
  deleted: 'Eliminada',
};

export function getLabel(map, value, fallback = 'Sin estado') {
  if (!value) return fallback;
  return map[value] || value;
}
