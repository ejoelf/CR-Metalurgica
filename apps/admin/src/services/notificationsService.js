import { apiClient } from './apiClient.js';

function buildQuery(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') query.set(key, value);
  });
  return query.toString() ? `?${query.toString()}` : '';
}

export const notificationsService = {
  async list(params = {}) {
    return apiClient(`/notifications${buildQuery(params)}`);
  },

  async unreadCount() {
    return apiClient('/notifications/unread-count');
  },

  async getById(id) {
    return apiClient(`/notifications/${id}`);
  },

  async markAsRead(id) {
    return apiClient(`/notifications/${id}/read`, {
      method: 'PATCH',
    });
  },

  async markAllAsRead() {
    return apiClient('/notifications/read-all', {
      method: 'PATCH',
    });
  },

  async remove(id) {
    return apiClient(`/notifications/${id}`, {
      method: 'DELETE',
    });
  },
};
