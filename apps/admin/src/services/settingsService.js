import { apiClient } from './apiClient.js';

export const settingsService = {
  getBusinessSettings() {
    return apiClient('/settings/business');
  },

  updateBusinessSettings(payload) {
    return apiClient('/settings/business', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },
};
