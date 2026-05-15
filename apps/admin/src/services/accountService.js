import { apiClient } from './apiClient.js';

export const accountService = {
  updateProfile(payload) {
    return apiClient('/settings/profile', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  changePassword(payload) {
    return apiClient('/settings/password', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },
};
