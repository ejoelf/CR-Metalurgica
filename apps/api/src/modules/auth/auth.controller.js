import { authService } from './auth.service.js';
import { sendSuccess } from '../../utils/responses.js';

export const authController = {
  async login(req, res) {
    const data = await authService.login(req.body);
    return sendSuccess(res, data, 'Sesion iniciada correctamente');
  },

  async refresh(req, res) {
    const data = await authService.refresh(req.body.refreshToken);
    return sendSuccess(res, data, 'Token renovado correctamente');
  },

  async logout(req, res) {
    const data = await authService.logout(req.body.refreshToken);
    return sendSuccess(res, data, 'Sesion cerrada correctamente');
  },

  async me(req, res) {
    const data = await authService.me(req.user.id);
    return sendSuccess(res, data, 'Usuario autenticado');
  },
};
