import { apiClient } from './apiClient.js';

export const authService = {
  async login(credentials) {
    return apiClient('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  async me(token) {
    return apiClient('/auth/me', {
      headers: { Authorization: 'Bearer ' + token },
    });
  },
};
