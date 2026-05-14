import { financeService } from './finance.service.js';
import { sendSuccess } from '../../utils/responses.js';

export const financeController = {
  async summary(req, res) {
    const data = await financeService.summary(req.query);
    return sendSuccess(res, data, 'Resumen financiero obtenido');
  },

  async monthly(req, res) {
    const data = await financeService.monthly(req.query);
    return sendSuccess(res, data, 'Resumen mensual obtenido');
  },

  async byJob(req, res) {
    const data = await financeService.byJob(req.params.jobId);
    return sendSuccess(res, data, 'Finanzas por trabajo obtenidas');
  },

  async profitability(req, res) {
    const data = await financeService.profitability();
    return sendSuccess(res, data, 'Rentabilidad obtenida');
  },
};
