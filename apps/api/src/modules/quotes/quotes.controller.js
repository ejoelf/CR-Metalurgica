import { quotesService } from './quotes.service.js';
import { auditService } from '../../services/audit.service.js';
import { sendSuccess } from '../../utils/responses.js';

export const quotesController = {
  async list(req, res) {
    const data = await quotesService.findMany({
      search: req.query.search,
      status: req.query.status,
      clientId: req.query.clientId,
      jobId: req.query.jobId,
    });
    return sendSuccess(res, data, 'Presupuestos obtenidos correctamente');
  },

  async detail(req, res) {
    const data = await quotesService.findById(req.params.id);
    return sendSuccess(res, data, 'Presupuesto obtenido correctamente');
  },

  async create(req, res) {
    const data = await quotesService.create(req.body, req.user);
    await auditService.log({ req, action: 'create', entityType: 'quote', entityId: data.id, newValue: data });
    return res.status(201).json({ success: true, message: 'Presupuesto creado correctamente', data });
  },

  async update(req, res) {
    const oldValue = await quotesService.findById(req.params.id);
    const data = await quotesService.update(req.params.id, req.body);
    await auditService.log({ req, action: 'update', entityType: 'quote', entityId: data.id, oldValue, newValue: data });
    return sendSuccess(res, data, 'Presupuesto actualizado correctamente');
  },

  async updateStatus(req, res) {
    const oldValue = await quotesService.findById(req.params.id);
    const data = await quotesService.updateStatus(req.params.id, req.body.status);
    await auditService.log({ req, action: 'status_change', entityType: 'quote', entityId: data.id, oldValue, newValue: data });
    return sendSuccess(res, data, 'Estado de presupuesto actualizado');
  },

  async addItem(req, res) {
    const data = await quotesService.addItem(req.params.id, req.body);
    await auditService.log({ req, action: 'update', entityType: 'quote', entityId: req.params.id, newValue: data });
    return sendSuccess(res, data, 'Ítem agregado al presupuesto', 201);
  },

  async updateItem(req, res) {
    const data = await quotesService.updateItem(req.params.itemId, req.body);
    await auditService.log({ req, action: 'update', entityType: 'quote_item', entityId: req.params.itemId, newValue: data });
    return sendSuccess(res, data, 'Ítem actualizado');
  },

  async deleteItem(req, res) {
    const data = await quotesService.deleteItem(req.params.itemId);
    await auditService.log({ req, action: 'delete', entityType: 'quote_item', entityId: req.params.itemId, oldValue: data });
    return sendSuccess(res, data, 'Ítem eliminado');
  },

  async pdfPlaceholder(req, res) {
    const quote = await quotesService.findById(req.params.id);
    return sendSuccess(res, { quoteId: quote.id, pdfUrl: quote.pdfUrl, status: quote.pdfUrl ? 'available' : 'pending_generation' }, 'PDF pendiente de generación profesional');
  },

  async sendPlaceholder(req, res) {
    const data = await quotesService.markSent(req.params.id);
    await auditService.log({ req, action: 'sent', entityType: 'quote', entityId: data.id, newValue: data });
    return sendSuccess(res, data, 'Presupuesto marcado como enviado');
  },

  async remove(req, res) {
    const oldValue = await quotesService.findById(req.params.id);
    const data = await quotesService.remove(req.params.id);
    await auditService.log({ req, action: 'delete', entityType: 'quote', entityId: data.id, oldValue, newValue: data });
    return sendSuccess(res, data, 'Presupuesto eliminado correctamente');
  },
};
