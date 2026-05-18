import { settingsService } from './settings.service.js';
import { auditService } from '../../services/audit.service.js';
import { sendSuccess } from '../../utils/responses.js';

export const settingsController = {
  async getBusinessSettings(req, res) {
    const data = await settingsService.getBusinessSettings();
    return sendSuccess(res, data, 'Configuracion del negocio obtenida');
  },

  async updateBusinessSettings(req, res) {
    const oldValue = await settingsService.getBusinessSettings();
    const data = await settingsService.updateBusinessSettings(req.body);
    await auditService.log({ req, action: 'update', entityType: 'business_settings', entityId: data.id, oldValue, newValue: data });
    return sendSuccess(res, data, 'Configuracion del negocio actualizada');
  },
};
