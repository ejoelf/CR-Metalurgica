import { agendaService } from './agenda.service.js';
import { createCrudController } from '../../utils/controllerFactory.js';
import { sendSuccess } from '../../utils/responses.js';

const baseController = createCrudController(agendaService, 'Evento de agenda');

export const agendaController = {
  ...baseController,

  async updateStatus(req, res) {
    const data = await agendaService.updateStatus(req.params.id, req.body.status);
    return sendSuccess(res, data, 'Estado de agenda actualizado');
  },
};
