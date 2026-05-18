import { apiClient } from './apiClient.js';

export const rolesService = {
  async list() {
    return apiClient('/roles');
  },

  async getById(id) {
    return apiClient(`/roles/${id}`);
  },

  async create(data) {
    return apiClient('/roles', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id, data) {
    return apiClient(`/roles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteById(id) {
    return apiClient(`/roles/${id}`, {
      method: 'DELETE',
    });
  },
};
