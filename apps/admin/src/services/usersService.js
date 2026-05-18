import { apiClient } from './apiClient.js';

export const usersService = {
  async list() {
    return apiClient('/users');
  },

  async getById(id) {
    return apiClient(`/users/${id}`);
  },

  async create(data) {
    return apiClient('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id, data) {
    return apiClient(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deactivate(id) {
    return apiClient(`/users/${id}`, {
      method: 'DELETE',
    });
  },
};
