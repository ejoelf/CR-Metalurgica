import { apiClient } from './apiClient.js';

function buildQuery(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') query.set(key, value);
  });
  return query.toString() ? `?${query.toString()}` : '';
}

export const auditService = {
  async list(params = {}) {
    return apiClient(`/audit${buildQuery(params)}`);
  },

  async getById(id) {
    return apiClient(`/audit/${id}`);
  },
};
