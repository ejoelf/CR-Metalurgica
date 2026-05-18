import { apiClient } from './apiClient.js';

function buildQuery(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') query.set(key, value);
  });
  return query.toString() ? `?${query.toString()}` : '';
}

export const agendaService = {
  async list(params = {}) {
    return apiClient(`/agenda${buildQuery(params)}`);
  },

  async today() {
    return apiClient('/agenda/today');
  },

  async getById(id) {
    return apiClient(`/agenda/${id}`);
  },

  async create(data) {
    return apiClient('/agenda', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id, data) {
    return apiClient(`/agenda/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async updateStatus(id, status) {
    return apiClient(`/agenda/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  async remove(id) {
    return apiClient(`/agenda/${id}`, {
      method: 'DELETE',
    });
  },
};
