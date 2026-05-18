import { apiClient } from './apiClient.js';

function buildQuery(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') query.set(key, value);
  });
  return query.toString() ? `?${query.toString()}` : '';
}

export const galleryService = {
  async list(params = {}) {
    return apiClient(`/gallery${buildQuery(params)}`);
  },

  async publicList(params = {}) {
    return apiClient(`/gallery/public${buildQuery(params)}`);
  },

  async getById(id) {
    return apiClient(`/gallery/${id}`);
  },

  async create(data) {
    return apiClient('/gallery', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id, data) {
    return apiClient(`/gallery/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async togglePublished(id) {
    return apiClient(`/gallery/${id}/published`, {
      method: 'PATCH',
    });
  },

  async toggleFeatured(id) {
    return apiClient(`/gallery/${id}/featured`, {
      method: 'PATCH',
    });
  },

  async remove(id) {
    return apiClient(`/gallery/${id}`, {
      method: 'DELETE',
    });
  },
};
