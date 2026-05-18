import { auditService } from './audit.service.js';
import { notificationsService } from '../modules/notifications/notifications.service.js';

export const systemActionsService = {
  async logAction({ req = null, userId = null, name, entityType = null, entityId = null, payload = null }) {
    return auditService.log({
      req,
      userId,
      action: 'system_action',
      entityType: entityType || 'system',
      entityId,
      newValue: {
        name,
        payload,
      },
    });
  },

  async notify({ req = null, userId = null, name, title, message, type = 'info', entityType = null, entityId = null, payload = null }) {
    const notification = await notificationsService.createSystemNotification({
      title,
      message,
      type,
      userId,
      entityType,
      entityId,
    });

    await this.logAction({
      req,
      userId,
      name,
      entityType,
      entityId,
      payload: {
        ...(payload || {}),
        notificationId: notification.id,
      },
    });

    return notification;
  },
};
