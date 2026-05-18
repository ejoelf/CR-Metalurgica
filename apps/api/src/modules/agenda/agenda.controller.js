import { agendaService } from './agenda.service.js';
import { auditService } from '../../services/audit.service.js';
import { sendSuccess } from '../../utils/responses.js';

export const agendaController = {
  async list(req, res) {
    const data = await agendaService.findMany(req.query);
    return sendSuccess(res, data, 'Eventos de agenda obtenidos');
  },

  async detail(req, res) {
    const data = await agendaService.findById(req.params.id);
    return sendSuccess(res, data, 'Evento de agenda obtenido');
  },

  async today(req, res) {
    const data = await agendaService.today(req.user?.id);
    return sendSuccess(res, data, 'Eventos del día obtenidos');
  },

  async create(req, res) {
    const data = await agendaService.create(req.body, req.user);
    await auditService.log({ req, action: 'create', entityType: 'agenda_event', entityId: data.id, newValue: data });
    return sendSuccess(res, data, 'Evento de agenda creado', 201);
  },

  async update(req, res) {
    const oldValue = await agendaService.findById(req.params.id);
    const data = await agendaService.update(req.params.id, req.body);
    await auditService.log({ req, action: 'update', entityType: 'agenda_event', entityId: data.id, oldValue, newValue: data });
    return sendSuccess(res, data, 'Evento de agenda actualizado');
  },

  async updateStatus(req, res) {
    const oldValue = await agendaService.findById(req.params.id);
    const data = await agendaService.updateStatus(req.params.id, req.body.status);
    await auditService.log({ req, action: 'status_change', entityType: 'agenda_event', entityId: data.id, oldValue, newValue: data });
    return sendSuccess(res, data, 'Estado de agenda actualizado');
  },

  async remove(req, res) {
    const oldValue = await agendaService.findById(req.params.id);
    const data = await agendaService.remove(req.params.id);
    await auditService.log({ req, action: 'delete', entityType: 'agenda_event', entityId: data.id, oldValue, newValue: data });
    return sendSuccess(res, data, 'Evento de agenda eliminado');
  },
};
