import { quotesService } from './quotes.service.js';
import { createCrudController } from '../../utils/controllerFactory.js';
import { sendSuccess } from '../../utils/responses.js';

const baseController = createCrudController(quotesService, 'Presupuesto');

export const quotesController = {
  ...baseController,

  async updateStatus(req, res) {
    const data = await quotesService.updateStatus(req.params.id, req.body.status);
    return sendSuccess(res, data, 'Estado de presupuesto actualizado');
  },

  async addItem(req, res) {
    const data = await quotesService.addItem(req.params.id, req.body);
    return sendSuccess(res, data, 'Item agregado al presupuesto', 201);
  },

  async updateItem(req, res) {
    const data = await quotesService.updateItem(req.params.itemId, req.body);
    return sendSuccess(res, data, 'Item actualizado');
  },

  async deleteItem(req, res) {
    const data = await quotesService.deleteItem(req.params.itemId);
    return sendSuccess(res, data, 'Item eliminado');
  },

  async pdfPlaceholder(req, res) {
    return sendSuccess(res, { quoteId: req.params.id, status: 'pending_integration' }, 'PDF preparado para Bloque 6');
  },

  async sendPlaceholder(req, res) {
    return sendSuccess(res, { quoteId: req.params.id, status: 'pending_integration' }, 'Envio preparado para Bloque 6');
  },
};
