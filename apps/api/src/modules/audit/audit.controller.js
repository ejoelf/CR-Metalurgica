import { auditModuleService } from './audit.service.js';

export const auditController = {
  async list(req, res) {
    const data = await auditModuleService.findMany(req.query);
    return res.json({ success: true, data });
  },

  async detail(req, res) {
    const data = await auditModuleService.findById(req.params.id);
    return res.json({ success: true, data });
  },
};
