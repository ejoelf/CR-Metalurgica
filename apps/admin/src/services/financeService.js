import { apiClient } from './apiClient.js';

function buildQuery(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') query.set(key, value);
  });
  return query.toString() ? `?${query.toString()}` : '';
}

export const financeService = {
  async summary(params = {}) {
    return apiClient(`/finance/summary${buildQuery(params)}`);
  },

  async movements(params = {}) {
    return apiClient(`/finance/movements${buildQuery(params)}`);
  },

  async movementDetail(type, id) {
    return apiClient(`/finance/movements/${type}/${id}`);
  },

  async createMovement(data) {
    return apiClient('/finance/movements', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateMovement(type, id, data) {
    return apiClient(`/finance/movements/${type}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteMovement(type, id) {
    return apiClient(`/finance/movements/${type}/${id}`, {
      method: 'DELETE',
    });
  },

  async generateReportPdf(params = {}) {
    return apiClient(`/finance/report/pdf${buildQuery(params)}`);
  },
};
