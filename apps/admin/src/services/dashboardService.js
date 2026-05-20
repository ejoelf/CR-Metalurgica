import { apiClient } from './apiClient.js';

export const dashboardService = {
  async getDashboard() {
    return apiClient('/crm/dashboard');
  },
};
