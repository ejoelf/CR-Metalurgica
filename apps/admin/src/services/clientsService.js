import { apiClient } from './apiClient.js';

function buildQuery(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') query.set(key, value);
  });
  return query.toString() ? `?${query.toString()}` : '';
}

export const clientsService = {
  async list(params = {}) {
    return apiClient(`/clients${buildQuery(params)}`);
  },

  async getById(id) {
    return apiClient(`/clients/${id}`);
  },

  async create(data) {
    return apiClient('/clients', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id, data) {
    return apiClient(`/clients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async archive(id) {
    return apiClient(`/clients/${id}`, {
      method: 'DELETE',
    });
  },
};
