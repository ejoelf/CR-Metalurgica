import { countersService } from '../../services/counters.service.js';
import { dashboardService } from '../../services/dashboard.service.js';

export const crmController = {
  async sidebarCounts(req, res) {
    const data = await countersService.sidebar(req.user?.id);
    return res.json({ success: true, data });
  },

  async dashboard(req, res) {
    const data = await dashboardService.getDashboard();
    return res.json({ success: true, data });
  },
};
