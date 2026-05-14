import { notificationsService } from './notifications.service.js';
import { createCrudController } from '../../utils/controllerFactory.js';
import { sendSuccess } from '../../utils/responses.js';

const baseController = createCrudController(notificationsService, 'Notificacion');

export const notificationsController = {
  ...baseController,

  async markAsRead(req, res) {
    const data = await notificationsService.markAsRead(req.params.id);
    return sendSuccess(res, data, 'Notificacion marcada como leida');
  },

  async markAllAsRead(req, res) {
    const data = await notificationsService.markAllAsRead(req.user.id);
    return sendSuccess(res, data, 'Notificaciones marcadas como leidas');
  },
};
