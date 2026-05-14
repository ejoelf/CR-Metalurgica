import { jobsService } from './jobs.service.js';
import { createCrudController } from '../../utils/controllerFactory.js';
import { sendSuccess } from '../../utils/responses.js';

const baseController = createCrudController(jobsService, 'Trabajo');

export const jobsController = {
  ...baseController,

  async updateStatus(req, res) {
    const data = await jobsService.updateStatus(req.params.id, req.body.status);
    return sendSuccess(res, data, 'Estado de trabajo actualizado');
  },

  async timeline(req, res) {
    const data = await jobsService.timeline(req.params.id);
    return sendSuccess(res, data, 'Timeline de trabajo obtenido');
  },
};
