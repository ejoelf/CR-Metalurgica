import { apiClient } from './apiClient.js';

function buildQuery(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') query.set(key, value);
  });
  return query.toString() ? `?${query.toString()}` : '';
}

export const quotesService = {
  async list(params = {}) {
    return apiClient(`/quotes${buildQuery(params)}`);
  },

  async getById(id) {
    return apiClient(`/quotes/${id}`);
  },

  async create(data) {
    return apiClient('/quotes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id, data) {
    return apiClient(`/quotes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async updateStatus(id, status) {
    return apiClient(`/quotes/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  async convertToJob(id) {
    return apiClient(`/quotes/${id}/convert-to-job`, {
      method: 'POST',
    });
  },

  async generatePdf(id) {
    return apiClient(`/quotes/${id}/pdf`);
  },

  async markAsSent(id) {
    return apiClient(`/quotes/${id}/send`, {
      method: 'POST',
    });
  },

  async remove(id) {
    return apiClient(`/quotes/${id}`, {
      method: 'DELETE',
    });
  },
};
