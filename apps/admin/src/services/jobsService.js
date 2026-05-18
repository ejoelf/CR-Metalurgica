import { apiClient } from './apiClient.js';

function buildQuery(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') query.set(key, value);
  });
  return query.toString() ? `?${query.toString()}` : '';
}

export const jobsService = {
  async list(params = {}) {
    return apiClient(`/jobs${buildQuery(params)}`);
  },

  async getById(id) {
    return apiClient(`/jobs/${id}`);
  },

  async create(data) {
    return apiClient('/jobs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id, data) {
    return apiClient(`/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async updateStatus(id, status) {
    return apiClient(`/jobs/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  async remove(id) {
    return apiClient(`/jobs/${id}`, {
      method: 'DELETE',
    });
  },
};
