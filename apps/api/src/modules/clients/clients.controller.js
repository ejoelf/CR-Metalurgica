import { clientsService } from './clients.service.js';
import { auditService } from '../../services/audit.service.js';

export const clientsController = {
  async list(req, res) {
    const data = await clientsService.findMany({ search: req.query.search });
    return res.json({ success: true, data });
  },

  async detail(req, res) {
    const data = await clientsService.findById(req.params.id);
    return res.json({ success: true, data });
  },

  async create(req, res) {
    const data = await clientsService.create(req.body);
    await auditService.log({ req, action: 'create', entityType: 'client', entityId: data.id, newValue: data });
    return res.status(201).json({ success: true, message: 'Cliente creado correctamente', data });
  },

  async update(req, res) {
    const oldValue = await clientsService.findById(req.params.id);
    const data = await clientsService.update(req.params.id, req.body);
    await auditService.log({ req, action: 'update', entityType: 'client', entityId: data.id, oldValue, newValue: data });
    return res.json({ success: true, message: 'Cliente actualizado correctamente', data });
  },

  async remove(req, res) {
    const oldValue = await clientsService.findById(req.params.id);
    const data = await clientsService.remove(req.params.id);
    await auditService.log({ req, action: 'delete', entityType: 'client', entityId: data.id, oldValue, newValue: data });
    return res.json({ success: true, message: 'Cliente archivado correctamente', data });
  },
};
