import { apiClient } from './apiClient.js';

export const crmService = {
  async getSidebarCounts() {
    return apiClient('/crm/sidebar-counts');
  },
};
