import { financeService } from './finance.service.js';
import { auditService } from '../../services/audit.service.js';
import { financePdfService } from '../../services/financePdf.service.js';
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

  async movements(req, res) {
    const data = await financeService.movements(req.query);
    return sendSuccess(res, data, 'Movimientos financieros obtenidos');
  },

  async movementDetail(req, res) {
    const data = await financeService.movementDetail(req.params.type, req.params.id);
    return sendSuccess(res, data, 'Movimiento financiero obtenido');
  },

  async createMovement(req, res) {
    const data = await financeService.createMovement(req.body, req.user);
    await auditService.log({ req, action: 'create', entityType: 'finance_movement', entityId: data.id, newValue: data });
    return sendSuccess(res, data, 'Movimiento financiero creado', 201);
  },

  async updateMovement(req, res) {
    const oldValue = await financeService.movementDetail(req.params.type, req.params.id);
    const data = await financeService.updateMovement(req.params.type, req.params.id, req.body);
    await auditService.log({ req, action: 'update', entityType: 'finance_movement', entityId: data.id, oldValue, newValue: data });
    return sendSuccess(res, data, 'Movimiento financiero actualizado');
  },

  async deleteMovement(req, res) {
    const oldValue = await financeService.movementDetail(req.params.type, req.params.id);
    const data = await financeService.deleteMovement(req.params.type, req.params.id);
    await auditService.log({ req, action: 'delete', entityType: 'finance_movement', entityId: data.id, oldValue, newValue: data });
    return sendSuccess(res, data, 'Movimiento financiero eliminado');
  },

  async reportPdf(req, res) {
    const data = await financePdfService.generate(req.query);
    await auditService.log({ req, action: 'pdf_generated', entityType: 'finance_report', entityId: data.fileName, newValue: { pdfUrl: data.publicUrl, movementsCount: data.movementsCount } });
    return sendSuccess(res, data, 'Reporte financiero PDF generado');
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
