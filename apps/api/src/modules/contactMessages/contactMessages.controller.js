import { contactMessagesService } from './contactMessages.service.js';
import { auditService } from '../../services/audit.service.js';
import { sendCreated, sendSuccess } from '../../utils/responses.js';

export const contactMessagesController = {
  async publicCreate(req, res) {
    const data = await contactMessagesService.create(req.body);
    return sendCreated(res, data, 'Consulta recibida correctamente');
  },

  async list(req, res) {
    const data = await contactMessagesService.findMany(req.query);
    return sendSuccess(res, data, 'Mensajes obtenidos correctamente');
  },

  async detail(req, res) {
    const data = await contactMessagesService.findById(req.params.id);
    return sendSuccess(res, data, 'Mensaje obtenido correctamente');
  },

  async unreadCount(req, res) {
    const count = await contactMessagesService.unreadCount();
    return sendSuccess(res, { count }, 'Cantidad de mensajes no leídos');
  },

  async markAsRead(req, res) {
    const oldValue = await contactMessagesService.findById(req.params.id);
    const data = await contactMessagesService.markAsRead(req.params.id);
    await auditService.log({ req, action: 'read', entityType: 'contact_message', entityId: data.id, oldValue, newValue: data });
    return sendSuccess(res, data, 'Mensaje marcado como leído');
  },

  async updateStatus(req, res) {
    const oldValue = await contactMessagesService.findById(req.params.id);
    const data = await contactMessagesService.updateStatus(req.params.id, req.body.status);
    await auditService.log({ req, action: 'status_change', entityType: 'contact_message', entityId: data.id, oldValue, newValue: data });
    return sendSuccess(res, data, 'Estado de mensaje actualizado');
  },

  async convertToClient(req, res) {
    const oldValue = await contactMessagesService.findById(req.params.id);
    const data = await contactMessagesService.convertToClient(req.params.id);
    await auditService.log({ req, action: 'convert_to_client', entityType: 'contact_message', entityId: req.params.id, oldValue, newValue: data });
    return sendCreated(res, data, 'Mensaje convertido en cliente');
  },

  async remove(req, res) {
    const oldValue = await contactMessagesService.findById(req.params.id);
    const data = await contactMessagesService.remove(req.params.id);
    await auditService.log({ req, action: 'delete', entityType: 'contact_message', entityId: data.id, oldValue, newValue: data });
    return sendSuccess(res, data, 'Mensaje eliminado correctamente');
  },
};
