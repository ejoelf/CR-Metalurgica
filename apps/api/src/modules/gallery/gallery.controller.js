import { galleryService } from './gallery.service.js';
import { auditService } from '../../services/audit.service.js';
import { sendSuccess } from '../../utils/responses.js';

export const galleryController = {
  async publicList(req, res) {
    const data = await galleryService.publicList(req.query);
    return sendSuccess(res, data, 'Galería pública obtenida');
  },

  async list(req, res) {
    const data = await galleryService.findMany(req.query);
    return sendSuccess(res, data, 'Galería obtenida');
  },

  async detail(req, res) {
    const data = await galleryService.findById(req.params.id);
    return sendSuccess(res, data, 'Trabajo de galería obtenido');
  },

  async create(req, res) {
    const data = await galleryService.create(req.body);
    await auditService.log({ req, action: 'create', entityType: 'gallery_item', entityId: data.id, newValue: data });
    return sendSuccess(res, data, 'Trabajo de galería creado', 201);
  },

  async update(req, res) {
    const oldValue = await galleryService.findById(req.params.id);
    const data = await galleryService.update(req.params.id, req.body);
    await auditService.log({ req, action: 'update', entityType: 'gallery_item', entityId: data.id, oldValue, newValue: data });
    return sendSuccess(res, data, 'Trabajo de galería actualizado');
  },

  async togglePublished(req, res) {
    const oldValue = await galleryService.findById(req.params.id);
    const data = await galleryService.togglePublished(req.params.id);
    await auditService.log({ req, action: 'update', entityType: 'gallery_item', entityId: data.id, oldValue, newValue: data });
    return sendSuccess(res, data, data.isPublished ? 'Trabajo visible en web' : 'Trabajo oculto en web');
  },

  async toggleFeatured(req, res) {
    const oldValue = await galleryService.findById(req.params.id);
    const data = await galleryService.toggleFeatured(req.params.id);
    await auditService.log({ req, action: 'update', entityType: 'gallery_item', entityId: data.id, oldValue, newValue: data });
    return sendSuccess(res, data, data.isFeatured ? 'Trabajo destacado' : 'Trabajo sin destacar');
  },

  async remove(req, res) {
    const oldValue = await galleryService.findById(req.params.id);
    const data = await galleryService.remove(req.params.id);
    await auditService.log({ req, action: 'delete', entityType: 'gallery_item', entityId: data.id, oldValue });
    return sendSuccess(res, data, 'Trabajo de galería eliminado');
  },
};
