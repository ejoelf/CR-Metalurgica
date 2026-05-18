import { jobsService } from './jobs.service.js';
import { auditService } from '../../services/audit.service.js';
import { sendSuccess } from '../../utils/responses.js';

export const jobsController = {
  async list(req, res) {
    const data = await jobsService.findMany({
      search: req.query.search,
      status: req.query.status,
      priority: req.query.priority,
      clientId: req.query.clientId,
    });
    return sendSuccess(res, data, 'Trabajos obtenidos correctamente');
  },

  async detail(req, res) {
    const data = await jobsService.findById(req.params.id);
    return sendSuccess(res, data, 'Trabajo obtenido correctamente');
  },

  async create(req, res) {
    const data = await jobsService.create(req.body, req.user);
    await auditService.log({ req, action: 'create', entityType: 'job', entityId: data.id, newValue: data });
    return res.status(201).json({ success: true, message: 'Trabajo creado correctamente', data });
  },

  async update(req, res) {
    const oldValue = await jobsService.findById(req.params.id);
    const data = await jobsService.update(req.params.id, req.body);
    await auditService.log({ req, action: 'update', entityType: 'job', entityId: data.id, oldValue, newValue: data });
    return sendSuccess(res, data, 'Trabajo actualizado correctamente');
  },

  async updateStatus(req, res) {
    const oldValue = await jobsService.findById(req.params.id);
    const data = await jobsService.updateStatus(req.params.id, req.body.status);
    await auditService.log({ req, action: 'status_change', entityType: 'job', entityId: data.id, oldValue, newValue: data });
    return sendSuccess(res, data, 'Estado de trabajo actualizado');
  },

  async remove(req, res) {
    const oldValue = await jobsService.findById(req.params.id);
    const data = await jobsService.remove(req.params.id);
    await auditService.log({ req, action: 'delete', entityType: 'job', entityId: data.id, oldValue, newValue: data });
    return sendSuccess(res, data, 'Trabajo eliminado correctamente');
  },

  async timeline(req, res) {
    const data = await jobsService.timeline(req.params.id);
    return sendSuccess(res, data, 'Timeline de trabajo obtenido');
  },
};
