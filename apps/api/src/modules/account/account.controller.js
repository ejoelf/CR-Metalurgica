import { accountService } from '../auth/account.service.js';
import { sendSuccess } from '../../utils/responses.js';

export const accountController = {
  async updateProfile(req, res) {
    const data = await accountService.updateProfile(req.user.id, req.body);
    return sendSuccess(res, data, 'Perfil actualizado correctamente');
  },

  async changePassword(req, res) {
    const data = await accountService.changePassword(req.user.id, req.body);
    return sendSuccess(res, data, 'Contraseña actualizada correctamente');
  },
};
