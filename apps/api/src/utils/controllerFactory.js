import { sendCreated, sendSuccess } from './responses.js';

export function createCrudController(service, entityName = 'registro') {
  return {
    async list(req, res) {
      const data = await service.findMany({ query: req.query });
      return sendSuccess(res, data, `${entityName} listado correctamente`);
    },

    async detail(req, res) {
      const data = await service.findById(req.params.id);
      return sendSuccess(res, data, `${entityName} obtenido correctamente`);
    },

    async create(req, res) {
      const data = await service.create(req.body, req.user);
      return sendCreated(res, data, `${entityName} creado correctamente`);
    },

    async update(req, res) {
      const data = await service.update(req.params.id, req.body, req.user);
      return sendSuccess(res, data, `${entityName} actualizado correctamente`);
    },

    async remove(req, res) {
      const data = await service.remove(req.params.id, req.user);
      return sendSuccess(res, data, `${entityName} eliminado correctamente`);
    },
  };
}
