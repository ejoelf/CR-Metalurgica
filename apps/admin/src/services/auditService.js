import { apiClient } from './apiClient.js';

export const auditService = {
  async list(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') query.set(key, value);
    });

    const suffix = query.toString() ? `?${query.toString()}` : '';
    return apiClient(`/audit${suffix}`);
  },
};
