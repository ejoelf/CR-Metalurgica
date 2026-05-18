import { notificationsService } from './notifications.service.js';
import { auditService } from '../../services/audit.service.js';
import { sendSuccess } from '../../utils/responses.js';

export const notificationsController = {
  async list(req, res) {
    const data = await notificationsService.findMany(req.query, req.user?.id || null);
    return sendSuccess(res, data, 'Notificaciones obtenidas correctamente');
  },

  async detail(req, res) {
    const data = await notificationsService.markAsRead(req.params.id);
    return sendSuccess(res, data, 'Notificación obtenida');
  },

  async unreadCount(req, res) {
    const count = await notificationsService.unreadCount(req.user?.id || null);
    return sendSuccess(res, { count }, 'Cantidad de notificaciones no leídas');
  },

  async markAsRead(req, res) {
    const oldValue = await notificationsService.findById(req.params.id);
    const data = await notificationsService.markAsRead(req.params.id);
    await auditService.log({ req, action: 'read', entityType: 'notification', entityId: data.id, oldValue, newValue: data });
    return sendSuccess(res, data, 'Notificación marcada como leída');
  },

  async markAllAsRead(req, res) {
    const data = await notificationsService.markAllAsRead(req.user.id);
    await auditService.log({ req, action: 'read_all', entityType: 'notification', entityId: req.user.id, newValue: data });
    return sendSuccess(res, data, 'Notificaciones marcadas como leídas');
  },

  async remove(req, res) {
    const oldValue = await notificationsService.findById(req.params.id);
    const data = await notificationsService.remove(req.params.id);
    await auditService.log({ req, action: 'delete', entityType: 'notification', entityId: oldValue.id, oldValue });
    return sendSuccess(res, data, 'Notificación eliminada correctamente');
  },
};
