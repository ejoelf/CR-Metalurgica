import { incomesService } from './incomes.service.js';
import { createCrudController } from '../../utils/controllerFactory.js';
import { sendSuccess } from '../../utils/responses.js';

const baseController = createCrudController(incomesService, 'Ingreso');

export const incomesController = {
  ...baseController,

  async updateStatus(req, res) {
    const data = await incomesService.updateStatus(req.params.id, req.body.status);
    return sendSuccess(res, data, 'Estado de ingreso actualizado');
  },
};
