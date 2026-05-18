import { auditService } from '../../services/audit.service.js';

export const auditController = {
  async list(req, res) {
    const take = Math.min(Number(req.query.take || 50), 100);
    const data = await auditService.listRecent({
      take,
      entityType: req.query.entityType,
      entityId: req.query.entityId,
    });

    return res.json({ success: true, data });
  },
};
