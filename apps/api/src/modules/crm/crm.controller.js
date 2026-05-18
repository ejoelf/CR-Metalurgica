import { countersService } from '../../services/counters.service.js';

export const crmController = {
  async sidebarCounts(req, res) {
    const data = await countersService.sidebar(req.user?.id);
    return res.json({ success: true, data });
  },
};
