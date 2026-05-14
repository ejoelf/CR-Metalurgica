import { settingsService } from './settings.service.js';
import { sendSuccess } from '../../utils/responses.js';

export const settingsController = {
  async getBusinessSettings(req, res) {
    const data = await settingsService.getBusinessSettings();
    return sendSuccess(res, data, 'Configuracion del negocio obtenida');
  },

  async updateBusinessSettings(req, res) {
    const data = await settingsService.updateBusinessSettings(req.body);
    return sendSuccess(res, data, 'Configuracion del negocio actualizada');
  },
};
