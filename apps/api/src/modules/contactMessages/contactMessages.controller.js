import { contactMessagesService } from './contactMessages.service.js';
import { createCrudController } from '../../utils/controllerFactory.js';
import { sendCreated, sendSuccess } from '../../utils/responses.js';

const baseController = createCrudController(contactMessagesService, 'Mensaje de contacto');

export const contactMessagesController = {
  ...baseController,

  async publicCreate(req, res) {
    const data = await contactMessagesService.create(req.body);
    return sendCreated(res, data, 'Consulta recibida correctamente');
  },

  async updateStatus(req, res) {
    const data = await contactMessagesService.updateStatus(req.params.id, req.body.status);
    return sendSuccess(res, data, 'Estado de mensaje actualizado');
  },

  async convertToClient(req, res) {
    const data = await contactMessagesService.convertToClient(req.params.id);
    return sendCreated(res, data, 'Mensaje convertido en cliente');
  },
};
